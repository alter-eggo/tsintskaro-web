This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3005](http://localhost:3005) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Timeweb VPS

Production address: https://tsintskaro.tw1.ru

The site runs as a separate Docker Compose service in `/opt/tsintskaro` on the existing VPS. Its local port is `127.0.0.1:3107`; the shared Caddy proxy reaches `tsintskaro:3000` through `constmed_default`. The Caddy site block is in `deploy/Caddyfile`; add it to the existing proxy configuration without replacing other sites.

Every push to `main` runs `.github/workflows/deploy-vps.yml`. GitHub Actions tests the deployment failure handling, runs the application checks, and builds a Linux image tagged with the full commit SHA. It then sends the image over SSH to the existing VPS. The workflow can also be started manually on `main`. Concurrent deployments are serialized; a build for an outdated commit is skipped before transfer.

The server first runs a temporary container and verifies the main pages, dictionary data, reviewed-word filter, and word markers. Only then does it switch the live service. Failed startup or HTTPS checks restore the previous Compose file and image. The deployed SHA is recorded in `/opt/tsintskaro/DEPLOYED_REVISION`; Compose backups are kept in `/opt/tsintskaro/backups`. The shared proxy and other sites are not restarted.

The repository secrets `VPS_SSH_KEY` and `VPS_KNOWN_HOSTS` hold the dedicated deployment key and the verified server host key. This key logs in as `tsintskaro-deploy` and can only invoke `deploy <full-commit-SHA>`; it has no interactive shell or port forwarding. Database credentials stay on the VPS.

For initial setup, copy `deploy/vps/` to the server and run `sudo bash install.sh /path/to/deployment-key.pub`. Install only the public key; put the private key directly in the GitHub secret. Run `install.sh` again after changing the server scripts. The existing Compose file and environment file must already exist; the installer does not replace them. Run `python3 deploy/vps/test-deploy.py` to check rejection, preflight, and rollback behavior without touching a live service.

For a manual release, build `docker build --build-arg REVISION=<SHA> -t local/tsintskaro:<SHA> .` on Linux amd64 and pipe `docker save local/tsintskaro:<SHA> | gzip -1` into `ssh tsintskaro-deploy@<server> 'deploy <SHA>'` using the dedicated identity and verified host key. Keep the previous image for rollback.

Runtime settings live only on the server in `/opt/tsintskaro/secrets/tsintskaro.env` (permissions `600`). Required settings are `DATABASE_URL` and, when the database requires a CA certificate, `DB_CERT`. Do not include environment files in the image. The dictionary uses the existing database; deployment does not migrate or recreate it.

Verify `/`, `/language`, `/history`, and `/language/materials` over HTTPS after each release. The container has a health check and restarts automatically after a server reboot.

## Language materials

The alphabet and bilingual story PDFs are stored in `public/materials` and are shown in the “Материалы для изучения” subsection at `/language/materials`, accessible from the Language page and sidebar.

The story video is intentionally kept outside the repository. Upload it to YouTube (an unlisted video is supported), Vimeo, or a video CDN, then set `STORY_VIDEO_URL` in `.env.local` and in the deployment environment. Full YouTube and Vimeo links are converted into embedded players automatically. Direct `.mp4`, `.webm`, and `.ogg` links use the browser video player with loading disabled until the visitor presses play.
