"use client";

import { useEffect, useRef, useState } from "react";
import {
  AppBase,
  AppOptions,
  Asset,
  CameraComponentSystem,
  Color,
  DEVICETYPE_WEBGL2,
  DEVICETYPE_WEBGPU,
  Entity,
  FILLMODE_NONE,
  GSplatComponentSystem,
  GSplatHandler,
  RESOLUTION_AUTO,
  TextureHandler,
  Vec3,
  createGraphicsDevice,
} from "playcanvas";
import type { BoundingBox } from "playcanvas";
import {
  AlertCircle,
  Expand,
  LoaderCircle,
  MousePointer2,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const SPLAT_URL = "/models/tsintskaro-graveyard/meta.json";

const CAMERA_POSE = {
  position: [2.8653907775878906, -9.611495971679688, -0.18310749530792236],
  target: [-0.5972353804156096, -9.553720569780326, -0.2660647769706781],
  fov: 67,
} as const;

const DEFAULT_FOV = 75;
const DEFAULT_CAMERA_DIRECTION = new Vec3(2, 1, 2).normalize();
const DEFAULT_PITCH =
  (Math.asin(DEFAULT_CAMERA_DIRECTION.y) * 180) / Math.PI;
const DEFAULT_YAW =
  (Math.atan2(DEFAULT_CAMERA_DIRECTION.x, DEFAULT_CAMERA_DIRECTION.z) * 180) /
  Math.PI;
const ORBIT_SENSITIVITY = 0.15;
const MOVE_SPEED = 4;
const MOVE_ACCELERATION_DAMPING = 0.992;
const MOVE_DECELERATION_DAMPING = 0.993;
const WHEEL_ZOOM_SPEED = 0.001;
const MIN_PITCH = -90;
const MAX_PITCH = 90;
const MIN_SCENE_RADIUS = 0.5;

type ViewerStatus = "loading" | "ready" | "error";
type DragMode = "orbit" | "pan";

type PointerPosition = {
  x: number;
  y: number;
  pointerType: string;
};

export function GraveyardSplatViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const resetCameraRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<ViewerStatus>("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;

    if (!canvas || !frame) {
      return;
    }

    let active = true;
    let app: AppBase | null = null;
    let graphicsDevice: Awaited<ReturnType<typeof createGraphicsDevice>> | null =
      null;
    let resizeObserver: ResizeObserver | null = null;
    const listenerController = new AbortController();
    const listenerOptions = { signal: listenerController.signal };

    const initialize = async () => {
      try {
        graphicsDevice = await createGraphicsDevice(canvas, {
          deviceTypes: [DEVICETYPE_WEBGPU, DEVICETYPE_WEBGL2],
          antialias: false,
        });

        if (!active) {
          graphicsDevice.destroy();
          return;
        }

        graphicsDevice.maxPixelRatio = Math.min(window.devicePixelRatio, 1.5);

        const options = new AppOptions();
        options.graphicsDevice = graphicsDevice;
        options.componentSystems = [
          CameraComponentSystem,
          GSplatComponentSystem,
        ];
        options.resourceHandlers = [TextureHandler, GSplatHandler];

        app = new AppBase(canvas);
        app.init(options);
        app.setCanvasFillMode(
          FILLMODE_NONE,
          Math.max(1, frame.clientWidth),
          Math.max(1, frame.clientHeight),
        );
        app.setCanvasResolution(RESOLUTION_AUTO);
        app.start();

        const camera = new Entity("Camera");
        camera.addComponent("camera", {
          clearColor: new Color(0.025, 0.027, 0.03),
          fov: DEFAULT_FOV,
        });
        app.root.addChild(camera);

        const target = new Vec3(0, 0, 0);
        const cameraPosition = new Vec3();
        const forward = new Vec3();
        const right = new Vec3();
        const up = new Vec3();
        const move = new Vec3();
        const desiredMove = new Vec3();
        const flyVelocity = new Vec3();
        const nextTarget = new Vec3();
        const worldAabbCenter = new Vec3();
        const pressedKeys = new Set<string>();
        const pointers = new Map<number, PointerPosition>();

        let yaw = DEFAULT_YAW;
        let pitch = DEFAULT_PITCH;
        let distance = 3;
        let fov = DEFAULT_FOV;
        let sceneRadius = 1;
        let dragMode: DragMode | null = null;
        let gestureDistance = 0;
        let gestureMidX = 0;
        let gestureMidY = 0;

        const updateCameraPosition = () => {
          const yawRadians = (yaw * Math.PI) / 180;
          const pitchRadians = (pitch * Math.PI) / 180;
          const cosPitch = Math.cos(pitchRadians);

          cameraPosition.set(
            target.x + distance * Math.sin(yawRadians) * cosPitch,
            target.y + distance * Math.sin(pitchRadians),
            target.z + distance * Math.cos(yawRadians) * cosPitch,
          );
        };

        const updateCamera = () => {
          updateCameraPosition();
          camera.setPosition(cameraPosition);
          camera.lookAt(target);
        };

        const getFrameDistance = (radius: number) => {
          const halfFovRadians = (fov * Math.PI) / 360;
          return radius / Math.sin(halfFovRadians);
        };

        const clampDistance = (value: number) => {
          const minDistance = Math.max(sceneRadius * 0.02, 0.02);
          const maxDistance = Math.max(sceneRadius * 40, 30);
          return Math.max(minDistance, Math.min(maxDistance, value));
        };

        const damp = (damping: number, deltaTime: number) =>
          1 - Math.pow(damping, deltaTime * 1000);

        const applyAuthoredCamera = () => {
          const deltaX = CAMERA_POSE.position[0] - CAMERA_POSE.target[0];
          const deltaY = CAMERA_POSE.position[1] - CAMERA_POSE.target[1];
          const deltaZ = CAMERA_POSE.position[2] - CAMERA_POSE.target[2];
          const poseDistance = Math.sqrt(
            deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ,
          );

          target.set(
            CAMERA_POSE.target[0],
            CAMERA_POSE.target[1],
            CAMERA_POSE.target[2],
          );
          yaw = (Math.atan2(deltaX, deltaZ) * 180) / Math.PI;
          pitch =
            (Math.asin(
              Math.max(-1, Math.min(1, deltaY / poseDistance)),
            ) *
              180) /
            Math.PI;
          distance = poseDistance;
          fov = CAMERA_POSE.fov;

          if (camera.camera) {
            camera.camera.fov = fov;
          }

          flyVelocity.set(0, 0, 0);
          updateCamera();
        };

        const frameSplat = (splat: Entity, bounds?: BoundingBox) => {
          if (bounds) {
            splat
              .getWorldTransform()
              .transformPoint(bounds.center, worldAabbCenter);
            target.copy(worldAabbCenter);
            sceneRadius = Math.max(
              bounds.halfExtents.length(),
              MIN_SCENE_RADIUS,
            );
          } else {
            target.set(0, 0, 0);
            sceneRadius = 1;
          }

          yaw = DEFAULT_YAW;
          pitch = DEFAULT_PITCH;
          fov = DEFAULT_FOV;
          distance = clampDistance(getFrameDistance(sceneRadius));
          updateCamera();
        };

        const updateBasis = () => {
          updateCameraPosition();
          const yawRadians = (yaw * Math.PI) / 180;
          const pitchRadians = (pitch * Math.PI) / 180;
          const cosPitch = Math.cos(pitchRadians);

          forward
            .set(
              -Math.sin(yawRadians) * cosPitch,
              -Math.sin(pitchRadians),
              -Math.cos(yawRadians) * cosPitch,
            )
            .normalize();
          right.set(Math.cos(yawRadians), 0, -Math.sin(yawRadians)).normalize();
          up.cross(right, forward).normalize();
        };

        const panTarget = (deltaX: number, deltaY: number) => {
          updateBasis();

          const height = Math.max(canvas.clientHeight, 1);
          const width = Math.max(canvas.clientWidth, 1);
          const halfHeight = distance * Math.tan((fov * Math.PI) / 360);
          const halfWidth = halfHeight * (width / height);

          nextTarget
            .copy(right)
            .mulScalar((-deltaX / width) * halfWidth * 2)
            .add(
              up
                .clone()
                .mulScalar((deltaY / height) * halfHeight * 2),
            );

          target.add(nextTarget);
          updateCamera();
        };

        const getTouchGesture = () => {
          const touches = Array.from(pointers.values()).filter(
            (pointer) => pointer.pointerType === "touch",
          );

          if (touches.length < 2) {
            return null;
          }

          const first = touches[0];
          const second = touches[1];
          const deltaX = second.x - first.x;
          const deltaY = second.y - first.y;

          return {
            distance: Math.sqrt(deltaX * deltaX + deltaY * deltaY),
            midX: (first.x + second.x) / 2,
            midY: (first.y + second.y) / 2,
          };
        };

        const onPointerDown = (event: PointerEvent) => {
          canvas.focus({ preventScroll: true });
          pointers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
            pointerType: event.pointerType,
          });
          canvas.setPointerCapture(event.pointerId);

          const gesture = getTouchGesture();
          if (gesture) {
            gestureDistance = gesture.distance;
            gestureMidX = gesture.midX;
            gestureMidY = gesture.midY;
            dragMode = null;
            return;
          }

          dragMode = event.button === 2 ? "pan" : "orbit";
        };

        const onPointerMove = (event: PointerEvent) => {
          const previous = pointers.get(event.pointerId);
          if (!previous) {
            return;
          }

          pointers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
            pointerType: event.pointerType,
          });

          const gesture = getTouchGesture();
          if (gesture) {
            if (gestureDistance > 0 && gesture.distance > 0) {
              distance = clampDistance(
                distance * (gestureDistance / gesture.distance),
              );
            }
            panTarget(gesture.midX - gestureMidX, gesture.midY - gestureMidY);
            gestureDistance = gesture.distance;
            gestureMidX = gesture.midX;
            gestureMidY = gesture.midY;
            updateCamera();
            return;
          }

          const deltaX = event.clientX - previous.x;
          const deltaY = event.clientY - previous.y;

          if (dragMode === "pan") {
            panTarget(deltaX, deltaY);
          } else if (dragMode === "orbit") {
            yaw -= deltaX * ORBIT_SENSITIVITY;
            pitch = Math.max(
              MIN_PITCH,
              Math.min(MAX_PITCH, pitch + deltaY * ORBIT_SENSITIVITY),
            );
            updateCamera();
          }
        };

        const endPointer = (event: PointerEvent) => {
          pointers.delete(event.pointerId);
          if (canvas.hasPointerCapture(event.pointerId)) {
            canvas.releasePointerCapture(event.pointerId);
          }

          const gesture = getTouchGesture();
          if (gesture) {
            gestureDistance = gesture.distance;
            gestureMidX = gesture.midX;
            gestureMidY = gesture.midY;
          } else {
            gestureDistance = 0;
            dragMode = null;
          }
        };

        const onWheel = (event: WheelEvent) => {
          event.preventDefault();

          if (event.shiftKey) {
            panTarget(event.deltaX, event.deltaY);
            return;
          }

          distance = clampDistance(
            distance * (1 + event.deltaY * WHEEL_ZOOM_SPEED),
          );
          updateCamera();
        };

        const movementKeys = new Set([
          "KeyW",
          "KeyA",
          "KeyS",
          "KeyD",
          "KeyQ",
          "KeyE",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ]);

        const onKeyDown = (event: KeyboardEvent) => {
          if (!movementKeys.has(event.code)) {
            return;
          }
          event.preventDefault();
          pressedKeys.add(event.code);
        };

        const onKeyUp = (event: KeyboardEvent) => {
          pressedKeys.delete(event.code);
        };

        const onBlur = () => {
          pressedKeys.clear();
        };

        canvas.addEventListener(
          "pointerdown",
          onPointerDown,
          listenerOptions,
        );
        canvas.addEventListener(
          "pointermove",
          onPointerMove,
          listenerOptions,
        );
        canvas.addEventListener("pointerup", endPointer, listenerOptions);
        canvas.addEventListener("pointercancel", endPointer, listenerOptions);
        canvas.addEventListener(
          "contextmenu",
          (event) => event.preventDefault(),
          listenerOptions,
        );
        canvas.addEventListener("wheel", onWheel, {
          ...listenerOptions,
          passive: false,
        });
        canvas.addEventListener("keydown", onKeyDown, listenerOptions);
        canvas.addEventListener("keyup", onKeyUp, listenerOptions);
        canvas.addEventListener("blur", onBlur, listenerOptions);

        const onUpdate = (deltaTime: number) => {
          desiredMove.set(0, 0, 0);

          const strafe =
            Number(
              pressedKeys.has("KeyD") || pressedKeys.has("ArrowRight"),
            ) -
            Number(pressedKeys.has("KeyA") || pressedKeys.has("ArrowLeft"));
          const lift =
            Number(pressedKeys.has("KeyE")) -
            Number(pressedKeys.has("KeyQ"));
          const advance =
            Number(
              pressedKeys.has("KeyW") || pressedKeys.has("ArrowUp"),
            ) -
            Number(pressedKeys.has("KeyS") || pressedKeys.has("ArrowDown"));

          if (strafe !== 0 || lift !== 0 || advance !== 0) {
            updateBasis();
            desiredMove
              .addScaled(right, strafe)
              .addScaled(up, lift)
              .addScaled(forward, advance);

            if (desiredMove.lengthSq() > 0) {
              desiredMove.normalize().mulScalar(MOVE_SPEED);
            }
          }

          const damping =
            desiredMove.lengthSq() > flyVelocity.lengthSq()
              ? MOVE_ACCELERATION_DAMPING
              : MOVE_DECELERATION_DAMPING;
          flyVelocity.lerp(
            flyVelocity,
            desiredMove,
            damp(damping, deltaTime),
          );

          if (
            desiredMove.lengthSq() === 0 &&
            flyVelocity.lengthSq() < 0.0001
          ) {
            flyVelocity.set(0, 0, 0);
          }

          if (flyVelocity.lengthSq() === 0) {
            return;
          }

          move.copy(flyVelocity).mulScalar(deltaTime);
          target.add(move);
          updateCamera();
        };

        app.on("update", onUpdate);
        applyAuthoredCamera();
        resetCameraRef.current = applyAuthoredCamera;

        resizeObserver = new ResizeObserver(() => {
          if (!app) {
            return;
          }
          app.resizeCanvas(
            Math.max(1, frame.clientWidth),
            Math.max(1, frame.clientHeight),
          );
        });
        resizeObserver.observe(frame);

        const splatAsset = new Asset("Graveyard V2", "gsplat", {
          url: SPLAT_URL,
          filename: "meta.json",
        });

        splatAsset.on("load", () => {
          if (!active || !app) {
            return;
          }

          const splat = new Entity("Tsintskaro graveyard");
          splat.setLocalEulerAngles(0, 0, 180);
          splat.addComponent("gsplat", { asset: splatAsset });
          app.root.addChild(splat);

          const resource = splatAsset.resource as {
            aabb?: BoundingBox;
          } | null;

          if (resource?.aabb) {
            sceneRadius = Math.max(
              resource.aabb.halfExtents.length(),
              MIN_SCENE_RADIUS,
            );
          } else {
            frameSplat(splat);
          }

          applyAuthoredCamera();
          setProgress(100);
          setStatus("ready");
        });

        splatAsset.on("progress", (received: number, length: number) => {
          if (!active || length <= 0) {
            return;
          }
          setProgress(
            Math.max(0, Math.min(99, Math.floor((received / length) * 100))),
          );
        });

        splatAsset.on("error", (error: unknown) => {
          console.error("Не удалось загрузить 3D-модель Цинцкаро", error);
          if (active) {
            setStatus("error");
          }
        });

        app.assets.add(splatAsset);
        app.assets.load(splatAsset);
      } catch (error) {
        console.error("Не удалось запустить 3D-просмотрщик", error);
        if (active) {
          setStatus("error");
        }
      }
    };

    void initialize();

    return () => {
      active = false;
      resetCameraRef.current = null;
      listenerController.abort();
      resizeObserver?.disconnect();
      if (app) {
        app.destroy();
      } else {
        graphicsDevice?.destroy();
      }
    };
  }, []);

  const enterFullscreen = async () => {
    try {
      await frameRef.current?.requestFullscreen();
    } catch {
      // The browser can decline fullscreen without affecting the viewer.
    }
  };

  return (
    <div
      ref={frameRef}
      className="relative h-[430px] w-full overflow-hidden bg-[#070809] sm:h-[520px] lg:h-[620px] [&:fullscreen]:h-screen"
    >
      <canvas
        ref={canvasRef}
        tabIndex={0}
        aria-label="Интерактивная 3D-модель кладбища Цинцкаро. Перетаскивайте для осмотра, используйте колесо или жест двумя пальцами для масштаба."
        className="block h-full w-full touch-none outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-inset"
      />

      {status === "loading" && (
        <div
          className="absolute inset-0 grid place-items-center bg-[#08090b]/92 px-6 text-white"
          role="status"
          aria-live="polite"
        >
          <div className="w-full max-w-sm text-center">
            <LoaderCircle
              className="mx-auto mb-4 size-8 motion-safe:animate-spin"
              aria-hidden="true"
            />
            <p className="font-medium">Загружаем 3D-модель</p>
            <p className="mt-1 text-sm text-white/60">
              Большая сцена может открываться несколько секунд
            </p>
            <div
              className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/15"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-white transition-[width] duration-200"
                style={{ width: progress + "%" }}
              />
            </div>
            <p className="mt-2 text-xs tabular-nums text-white/50">
              {progress}%
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div
          className="absolute inset-0 grid place-items-center bg-[#08090b] px-6 text-white"
          role="alert"
        >
          <div className="max-w-md text-center">
            <AlertCircle className="mx-auto mb-4 size-9 text-red-300" />
            <p className="font-semibold">Модель не удалось открыть</p>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Проверьте поддержку WebGL или WebGPU в браузере и обновите
              страницу.
            </p>
          </div>
        </div>
      )}

      {status === "ready" && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="absolute right-3 top-3 flex gap-2">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={() => resetCameraRef.current?.()}
              aria-label="Вернуть исходный вид"
              title="Исходный вид"
              className="border border-white/15 bg-black/55 text-white shadow-lg backdrop-blur hover:bg-black/75"
            >
              <RotateCcw className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={enterFullscreen}
              aria-label="Открыть 3D-модель на весь экран"
              title="На весь экран"
              className="border border-white/15 bg-black/55 text-white shadow-lg backdrop-blur hover:bg-black/75"
            >
              <Expand className="size-4" />
            </Button>
          </div>

          <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2 text-[11px] text-white/75 sm:right-auto sm:text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-black/55 px-2.5 py-1.5 shadow-lg backdrop-blur">
              <MousePointer2 className="size-3.5" />
              Перетащите — осмотр
            </span>
            <span className="rounded-md border border-white/10 bg-black/55 px-2.5 py-1.5 shadow-lg backdrop-blur">
              Колесо или щипок — масштаб
            </span>
            <span className="hidden rounded-md border border-white/10 bg-black/55 px-2.5 py-1.5 shadow-lg backdrop-blur md:inline-flex">
              WASD / стрелки — движение
            </span>
          </div>
        </>
      )}
    </div>
  );
}
