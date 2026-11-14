import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { buildTropicalKitHomeScene } from './tropicalKitHomeModel';

interface StageMeta {
  index: number;
  shortLabel: string;
  title: string;
  subtitle: string;
  startSec: number;
  previewSec: number;
}

const STAGES: StageMeta[] = [
  {
    index: 1,
    shortLabel: '01 Grid',
    title: 'Stage 1 — Engineering Grid',
    subtitle: 'CAD datum lines, measurement markers & cyan reference plane',
    startSec: 0,
    previewSec: 1.8,
  },
  {
    index: 2,
    shortLabel: '02 Foundation',
    title: 'Stage 2 — Foundation Geometry',
    subtitle: 'Perimeter outline, structural floor grid & stilt piers',
    startSec: 3.0,
    previewSec: 5.5,
  },
  {
    index: 3,
    shortLabel: '03 Frame',
    title: 'Stage 3 — Structural Framework',
    subtitle: 'Walls, columns, roof trusses, door & window openings',
    startSec: 6.5,
    previewSec: 10.2,
  },
  {
    index: 4,
    shortLabel: '04 3D Transform',
    title: 'Stage 4 — Architectural Transformation',
    subtitle: 'Material finishes, tropical roof covering, glazing & shadows',
    startSec: 11.0,
    previewSec: 14.5,
  },
  {
    index: 5,
    shortLabel: '05 Interactive',
    title: 'Stage 5 — Interactive 3D Presentation',
    subtitle: 'Drag or touch to orbit the contemporary tropical kit home',
    startSec: 15.5,
    previewSec: 17.5,
  },
];

const TOTAL_CYCLE_SEC = 22.0;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function getStageIndexForTime(t: number): number {
  if (t < 3.0) return 1;
  if (t < 6.5) return 2;
  if (t < 11.0) return 3;
  if (t < 15.5) return 4;
  return 5;
}

export default function TechturalArchitecturalStage() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeStage, setActiveStage] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return true;
  });

  // Shared mutable animation state refs so React UI updates never tear down WebGL
  const cycleTimeRef = useRef<number>(
    typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 17.5
      : 0
  );
  const isPlayingRef = useRef<boolean>(isPlaying);
  const activeStageRef = useRef<number>(1);
  const resetCameraFnRef = useRef<(() => void) | null>(null);
  const requestRenderFnRef = useRef<(() => void) | null>(null);
  const pointerTiltRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    requestRenderFnRef.current?.();
  }, [isPlaying]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL detection via renderer string (never UA)
    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param) || '');
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Initialize Renderer, Scene, Camera
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 520;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060e1e);
    scene.fog = new THREE.FogExp2(0x060e1e, 0.022);

    // Mandatory studio environment map for metallic & glazing reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.2, 120);
    const defaultCamPos = new THREE.Vector3(12.2, 7.6, 13.4);
    const defaultTarget = new THREE.Vector3(0, 1.9, 0.1);
    camera.position.copy(defaultCamPos);

    // 3. OrbitControls with subtle auto-rotation and smooth damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(defaultTarget);
    controls.enablePan = false;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 8.5;
    controls.maxDistance = 24;
    controls.minPolarAngle = Math.PI * 0.14;
    controls.maxPolarAngle = Math.PI * 0.47;
    controls.autoRotate = !isSoftwareGl;
    controls.autoRotateSpeed = 0.65;
    controls.update();

    let userInteracting = false;
    let cameraResetting = false;
    const onControlStart = () => {
      userInteracting = true;
      cameraResetting = false;
    };
    const onControlEnd = () => {
      userInteracting = false;
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('end', onControlEnd);

    resetCameraFnRef.current = () => {
      cameraResetting = true;
      requestRenderFnRef.current?.();
    };

    // 4. 3-Point Studio + Warm Tropical Sunlight Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x0b1325, 0.72);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff1dc, 2.3);
    sunLight.position.set(11, 16, 10);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 42;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x22d3ee, 0.75);
    rimLight.position.set(-12, 8, -10);
    scene.add(rimLight);

    // 5. Build 5-Stage Tropical Kit Home Scene Graph
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const model = buildTropicalKitHomeScene(maxAniso, isSoftwareGl);
    scene.add(model.root);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 6. Pointer move subtle tilt parallax
    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerTiltRef.current.x = nx;
      pointerTiltRef.current.y = ny;
    };
    const handlePointerLeave = () => {
      pointerTiltRef.current.x = 0;
      pointerTiltRef.current.y = 0;
    };
    renderer.domElement.addEventListener('pointermove', handlePointerMove, { passive: true });
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // 7. ResizeObserver so container fits desktop & mobile cleanly
    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRenderFnRef.current?.();
    });
    resizeObserver.observe(container);

    // 8. Pre-allocated loop state & Stage application function (zero GC churn)
    let frameId = 0;
    let disposed = false;
    let lastTime = performance.now();
    const baseSunIntensity = 2.3;
    const baseHemiIntensity = 0.72;

    const applyStageState = (t: number) => {
      // Seamless loop fade-out at end of cycle (20.8s -> 22.0s)
      const loopResetFade = 1 - smoothstep(20.8, 22.0, t);

      // Stage 1: Engineering grid + glow (0 -> 1.2s)
      const s1Reveal = smoothstep(0.0, 1.3, t);
      const s1Pulse = 0.85 + 0.15 * Math.sin(t * 1.6);
      model.stage1Materials[0].opacity = s1Reveal * 0.85 * s1Pulse; // cyan ground glow
      model.stage1Materials[1].opacity = s1Reveal * 0.18; // fine sub-grid
      model.stage1Materials[2].opacity = s1Reveal * 0.48; // dimension markers & crosshairs

      // Stage 2: Foundation Geometry (2.8s -> 6.0s)
      const s2Reveal = smoothstep(2.8, 5.8, t) * loopResetFade;
      const s2WireDim = 1 - smoothstep(11.5, 14.5, t) * 0.72;
      model.stage2Group.visible = s2Reveal > 0.005;
      model.stage2Group.scale.y = Math.max(0.01, smoothstep(2.8, 4.6, t));
      for (let i = 0; i < model.stage2LineMaterials.length; i++) {
        model.stage2LineMaterials[i].opacity = s2Reveal * s2WireDim * 0.9;
      }

      // Stage 3: Structural Framework (6.2s -> 10.8s)
      const s3Global = smoothstep(6.2, 6.9, t) * loopResetFade;
      const s3WireDim = 1 - smoothstep(11.8, 15.2, t) * 0.78;
      model.stage3Group.visible = s3Global > 0.005;
      for (let i = 0; i < model.stage3Entries.length; i++) {
        const entry = model.stage3Entries[i];
        const entryStart = 6.2 + entry.order * 3.6;
        const entryReveal = smoothstep(entryStart, entryStart + 0.9, t);
        entry.line.visible = entryReveal > 0.01;
        entry.line.scale.setScalar(0.96 + 0.04 * entryReveal);
        entry.material.opacity = entryReveal * s3WireDim * loopResetFade * 0.92;
      }

      // Stage 4: Architectural Transformation (10.8s -> 15.4s)
      const s4Progress = smoothstep(10.8, 15.2, t);
      const s4Active = s4Progress * loopResetFade;
      model.stage4Group.visible = s4Active > 0.005;
      model.contactShadowMaterial.opacity = s4Active * 0.65;

      // Animated cyan architectural scan sweep plane rising from y=0 to y=6m
      const scanActive = t >= 10.8 && t <= 15.6;
      model.scanPlane.visible = scanActive;
      if (scanActive) {
        const scanNorm = (t - 10.8) / 4.8;
        model.scanPlane.position.y = scanNorm * 6.0;
        model.scanPlaneMaterial.opacity = Math.sin(scanNorm * Math.PI) * 0.36;
      } else {
        model.scanPlaneMaterial.opacity = 0;
      }

      for (let i = 0; i < model.stage4SolidEntries.length; i++) {
        const item = model.stage4SolidEntries[i];
        const itemStart = 10.8 + item.order * 3.5;
        const itemReveal = smoothstep(itemStart, itemStart + 0.95, t) * loopResetFade;
        item.mesh.visible = itemReveal > 0.01;
        for (let m = 0; m < item.materials.length; m++) {
          item.materials[m].opacity = itemReveal * item.baseOpacity[m];
        }
      }

      // Transition lighting & warm interior glow cleanly into Stage 4 & Stage 5
      const lightingFactor = s4Active;
      sunLight.intensity = 0.65 + lightingFactor * (baseSunIntensity - 0.65);
      hemiLight.intensity = 0.45 + lightingFactor * (baseHemiIntensity - 0.45);
      model.interiorGlowLight.intensity = lightingFactor * 5.5;

      // Subtle tilt response when pointer hovers in interactive presentation
      const tiltTargetX = pointerTiltRef.current.y * 0.018;
      const tiltTargetZ = -pointerTiltRef.current.x * 0.018;
      model.root.rotation.x += (tiltTargetX - model.root.rotation.x) * 0.06;
      model.root.rotation.z += (tiltTargetZ - model.root.rotation.z) * 0.06;

      // Sync stage label to React only when stage index changes
      const nextStage = getStageIndexForTime(t);
      if (nextStage !== activeStageRef.current) {
        activeStageRef.current = nextStage;
        setActiveStage(nextStage);
      }
    };

    // Software WebGL safe frame scheduling
    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (isPlayingRef.current) {
        cycleTimeRef.current = (cycleTimeRef.current + dt) % TOTAL_CYCLE_SEC;
      }

      if (cameraResetting) {
        const damp = 1 - Math.exp(-5 * dt);
        camera.position.lerp(defaultCamPos, damp);
        controls.target.lerp(defaultTarget, damp);
        if (camera.position.distanceTo(defaultCamPos) < 0.04) {
          camera.position.copy(defaultCamPos);
          controls.target.copy(defaultTarget);
          cameraResetting = false;
        }
      }

      controls.autoRotate = !isSoftwareGl && !userInteracting && !cameraResetting;
      controls.update();

      applyStageState(cycleTimeRef.current);
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    requestRenderFnRef.current = () => {
      applyStageState(cycleTimeRef.current);
    };

    applyStageState(cycleTimeRef.current);
    tick();

    // 9. Clean Disposal on Unmount
    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('end', onControlEnd);
      controls.dispose();
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);

      model.disposables.geometries.forEach((g) => g.dispose());
      model.disposables.materials.forEach((m) => m.dispose());
      model.disposables.textures.forEach((t) => t.dispose());
      envTarget.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const currentStageMeta = STAGES.find((s) => s.index === activeStage) || STAGES[0];

  const handleSelectStage = (stage: StageMeta) => {
    cycleTimeRef.current = stage.previewSec;
    activeStageRef.current = stage.index;
    setActiveStage(stage.index);
    requestRenderFnRef.current?.();
  };

  return (
    <div
      className="relative w-full h-[460px] sm:h-[530px] lg:h-[580px] rounded-2xl overflow-hidden border border-sky-400/20 bg-[#060E1E] shadow-2xl"
      aria-label="Interactive 3D Tropical Kit Home Architectural Animation"
    >
      {/* Dedicated WebGL Mount Container (never mixes sibling HUD nodes) */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top HUD Overlay: Active Stage Title & Orbit Hint (Zero backdrop-filter over WebGL) */}
      <div className="pointer-events-none absolute top-4 left-4 right-4 z-10 flex items-start justify-between gap-4">
        <div className="bg-[#060E1E]/88 border border-sky-400/20 rounded-xl px-3.5 py-2.5 max-w-md">
          <div className="text-[11px] font-mono tabular-nums text-sky-300 font-semibold">
            {currentStageMeta.title}
          </div>
          <p className="text-xs text-slate-300 mt-0.5 leading-snug">
            {currentStageMeta.subtitle}
          </p>
        </div>

        <div className="hidden sm:block bg-[#060E1E]/85 border border-sky-400/15 rounded-lg px-3 py-1.5 text-[11px] font-mono text-slate-300">
          Drag to orbit · Scroll to zoom
        </div>
      </div>

      {/* Unified Bottom Control Dock (Stages 1–5 + Playback + Camera Reset) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-24px)] max-w-[680px]">
        <div className="bg-[#060E1E]/90 border border-sky-400/25 rounded-xl p-1.5 flex items-center gap-1.5 shadow-xl">
          <div
            role="tablist"
            aria-label="Architectural animation stages"
            className="grid grid-cols-5 gap-1 flex-1"
          >
            {STAGES.map((stage) => {
              const isSelected = stage.index === activeStage;
              return (
                <button
                  key={stage.index}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectStage(stage)}
                  className={`min-h-[38px] px-1.5 sm:px-2.5 py-1.5 rounded-lg text-[11px] font-mono tabular-nums font-medium transition-colors cursor-pointer truncate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${
                    isSelected
                      ? 'bg-sky-500/25 text-sky-200 border border-sky-400/50'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {stage.shortLabel}
                </button>
              );
            })}
          </div>

          <div className="h-6 w-px bg-sky-400/20 shrink-0" />

          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? 'Pause architectural sequence' : 'Play architectural sequence'}
            className="w-9 h-9 rounded-lg border border-sky-400/20 bg-white/5 hover:bg-sky-500/20 text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          </button>

          <button
            type="button"
            onClick={() => resetCameraFnRef.current?.()}
            aria-label="Reset 3D camera view"
            title="Reset 3D camera view"
            className="w-9 h-9 rounded-lg border border-sky-400/20 bg-white/5 hover:bg-sky-500/20 text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
