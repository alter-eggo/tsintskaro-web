"""Exercise deployment failures with fake Docker/HTTP commands, never a live site."""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPTS = Path(__file__).resolve().parent
REVISION = "a" * 40
PREVIOUS = "name: tsintskaro\nservices:\n  tsintskaro:\n    image: local/tsintskaro:previous\n"
MOCK = r'''#!/usr/bin/env python3
import json, os, pathlib, sys
command = pathlib.Path(sys.argv[0]).name
args = sys.argv[1:]
base = pathlib.Path(os.environ['TSINTSKARO_DEPLOY_DIR'])
case = os.environ['TEST_CASE']
event = {'command': command, 'args': args, 'compose': (base / 'compose.yaml').read_text()}
with (base / 'events').open('a') as stream:
    stream.write(json.dumps(event) + '\n')
if command == 'docker':
    if args[0] == 'load':
        sys.stdin.buffer.read()
        sys.exit(1 if case == 'load_failure' else 0)
    if args[:2] == ['image', 'inspect']:
        if args[-1] == '{{.Config.User}}':
            print('root' if case == 'root_image' else 'node')
        else:
            print('wrong' if case == 'wrong_revision' else 'a' * 40)
    if args[0] == 'exec' and case == 'candidate_failure':
        sys.exit(1)
    if args[0] == 'compose':
        if 'config' in args and case == 'invalid_config':
            sys.exit(1)
        if 'up' in args:
            state = base / 'up_count'
            count = int(state.read_text()) + 1 if state.exists() else 1
            state.write_text(str(count))
            if case == 'rollback_failure' or (case == 'start_failure' and count == 1):
                sys.exit(1)
if command == 'curl' and case == 'https_failure':
    sys.exit(22)
'''


class DeploymentTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.base = Path(self.temporary.name)
        (self.base / 'secrets').mkdir()
        (self.base / 'secrets/tsintskaro.env').write_text('TEST_ONLY=value\n')
        (self.base / 'compose.yaml').write_text(PREVIOUS)
        binaries = self.base / 'bin'
        binaries.mkdir()
        for command in ['docker', 'curl', 'flock', 'sudo']:
            file = binaries / command
            file.write_text(MOCK)
            file.chmod(0o755)
        self.env = {
            **os.environ,
            'PATH': str(binaries) + os.pathsep + os.environ['PATH'],
            'TSINTSKARO_DEPLOY_DIR': str(self.base),
            'TEST_CASE': 'success',
        }

    def run_deploy(self, case='success', revision=REVISION):
        self.env['TEST_CASE'] = case
        result = subprocess.run(['bash', str(SCRIPTS / 'deploy.sh'), revision],
                                input=b'test-image', env=self.env, capture_output=True)
        event_file = self.base / 'events'
        self.events = [json.loads(line) for line in event_file.read_text().splitlines()] if event_file.exists() else []
        self.assertFalse([path for path in self.base.glob('.deploy.*') if path.name != '.deploy.lock'])
        return result

    def assert_previous_untouched(self):
        self.assertEqual((self.base / 'compose.yaml').read_text(), PREVIOUS)
        self.assertFalse((self.base / 'DEPLOYED_REVISION').exists())

    def compose_starts(self):
        return [event for event in self.events if event['command'] == 'docker'
                and event['args'][0] == 'compose' and 'up' in event['args']]

    def test_success_switches_only_after_candidate_passes(self):
        result = self.run_deploy()
        self.assertEqual(result.returncode, 0, result.stderr.decode())
        self.assertEqual((self.base / 'DEPLOYED_REVISION').read_text().strip(), REVISION)
        candidate = next(e for e in self.events if e['args'][0] == 'exec')
        self.assertEqual(candidate['compose'], PREVIOUS)
        self.assertEqual(len(self.compose_starts()), 1)
        self.assertIn(REVISION, self.compose_starts()[0]['compose'])
        backup, = (self.base / 'backups').iterdir()
        self.assertEqual(backup.read_text(), PREVIOUS)
        self.assertEqual(len([e for e in self.events if e['command'] == 'curl']), 5)

    def test_invalid_revision_never_calls_docker(self):
        result = self.run_deploy(revision='main; echo unsafe')
        self.assertEqual(result.returncode, 64)
        self.assertEqual(self.events, [])
        self.assert_previous_untouched()

    def test_candidate_uses_production_compose_environment_without_live_ports(self):
        result = self.run_deploy()
        self.assertEqual(result.returncode, 0, result.stderr.decode())
        candidate, = [e for e in self.events if e['command'] == 'docker' and 'run' in e['args']]
        self.assertEqual(candidate['args'][0], 'compose')
        self.assertIn('--project-directory', candidate['args'])
        self.assertIn(str(self.base), candidate['args'])
        self.assertNotIn('--env-file', candidate['args'])
        self.assertNotIn('--service-ports', candidate['args'])
        self.assertNotIn('--use-aliases', candidate['args'])

    def test_preflight_failures_leave_live_service_running(self):
        for case in ['load_failure', 'wrong_revision', 'root_image', 'candidate_failure', 'invalid_config']:
            with self.subTest(case=case):
                (self.base / 'events').unlink(missing_ok=True)
                result = self.run_deploy(case)
                self.assertNotEqual(result.returncode, 0)
                self.assert_previous_untouched()
                self.assertEqual(self.compose_starts(), [])
                if case == 'candidate_failure':
                    self.assertTrue(any(e['args'][0] == 'rm' for e in self.events))

    def test_start_failure_restores_previous_image(self):
        result = self.run_deploy('start_failure')
        self.assertNotEqual(result.returncode, 0)
        self.assert_previous_untouched()
        self.assertEqual(len(self.compose_starts()), 2)
        self.assertEqual(self.compose_starts()[1]['compose'], PREVIOUS)
        self.assertIn(b'Previous release restored', result.stderr)

    def test_https_failure_also_rolls_back(self):
        result = self.run_deploy('https_failure')
        self.assertNotEqual(result.returncode, 0)
        self.assert_previous_untouched()
        self.assertEqual(len(self.compose_starts()), 2)

    def test_rollback_failure_is_reported_as_failure(self):
        result = self.run_deploy('rollback_failure')
        self.assertNotEqual(result.returncode, 0)
        self.assert_previous_untouched()
        self.assertIn(b'ROLLBACK FAILED', result.stderr)

    def test_unexpected_compose_file_is_not_rewritten(self):
        original = PREVIOUS.replace('local/tsintskaro', 'another-service')
        (self.base / 'compose.yaml').write_text(original)
        result = self.run_deploy()
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual((self.base / 'compose.yaml').read_text(), original)
        self.assertEqual(self.compose_starts(), [])

    def test_ssh_key_cannot_run_arbitrary_commands(self):
        for command in ['', 'id', 'deploy main', f'deploy {REVISION}; id', f'deploy {REVISION}\nid']:
            result = subprocess.run(['bash', str(SCRIPTS / 'ssh-command.sh')],
                                    env={**self.env, 'SSH_ORIGINAL_COMMAND': command}, capture_output=True)
            self.assertEqual(result.returncode, 64, command)

    def test_ssh_accepts_only_the_deployment_entrypoint(self):
        result = subprocess.run(['bash', str(SCRIPTS / 'ssh-command.sh')],
                                env={**self.env, 'SSH_ORIGINAL_COMMAND': f'deploy {REVISION}'}, capture_output=True)
        self.assertEqual(result.returncode, 0, result.stderr.decode())
        event = json.loads((self.base / 'events').read_text())
        self.assertEqual(event['args'], ['-n', '/usr/local/sbin/tsintskaro-deploy', REVISION])


if __name__ == '__main__':
    unittest.main()
