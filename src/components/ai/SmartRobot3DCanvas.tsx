import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RobotSpecialistId, ROBOT_FLEET } from './robotFleetData';

export type RobotMood = 'idle' | 'listening' | 'thinking' | 'speaking' | 'success';

interface SmartRobot3DCanvasProps {
  mood?: RobotMood;
  specialistId?: RobotSpecialistId;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  enableTracking?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export const SmartRobot3DCanvas: React.FC<SmartRobot3DCanvasProps> = ({
  mood = 'idle',
  specialistId = 'prime',
  size = 'md',
  className = '',
  enableTracking = true,
  interactive = true,
  onClick
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const robotGroupRef = useRef<THREE.Group | null>(null);
  const headGroupRef = useRef<THREE.Group | null>(null);
  const goldMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const eyeMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const coreLightRef = useRef<THREE.PointLight | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Get active robot specialist configuration
  const currentSpecialist = ROBOT_FLEET.find((r) => r.id === specialistId) || ROBOT_FLEET[0];

  // Size dimensions
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { width: 90, height: 90 };
      case 'md':
        return { width: 160, height: 160 };
      case 'lg':
        return { width: 260, height: 260 };
      case 'hero':
        return { width: 340, height: 340 };
    }
  };

  // Dynamic color updater when specialistId changes
  useEffect(() => {
    if (goldMaterialRef.current) {
      goldMaterialRef.current.color.setHex(currentSpecialist.armorColor);
    }
    if (eyeMaterialRef.current) {
      eyeMaterialRef.current.color.setHex(currentSpecialist.visorColor);
    }
    if (coreLightRef.current) {
      coreLightRef.current.color.setHex(currentSpecialist.glowColor);
    }
    if (particlesRef.current && (particlesRef.current.material as THREE.PointsMaterial)) {
      (particlesRef.current.material as THREE.PointsMaterial).color.setHex(currentSpecialist.visorColor);
    }
  }, [specialistId, currentSpecialist]);

  useEffect(() => {
    if (!mountRef.current) return;
    const { width, height } = getDimensions();

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    // 2. WebGL Renderer with High Performance & Tone Mapping
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    mountRef.current.appendChild(renderer.domElement);

    // 3. Lighting Rig (Luxury Specular Highlights for 24K Gold PBR)
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffdf88, 3.8);
    mainKeyLight.position.set(4, 6, 6);
    scene.add(mainKeyLight);

    const goldFillLight = new THREE.DirectionalLight(0xd4af37, 2.2);
    goldFillLight.position.set(-5, -2, 4);
    scene.add(goldFillLight);

    const rimCyanLight = new THREE.DirectionalLight(currentSpecialist.visorColor, 2.0);
    rimCyanLight.position.set(0, -5, -4);
    scene.add(rimCyanLight);

    const coreLight = new THREE.PointLight(currentSpecialist.glowColor, 3.0, 6);
    coreLight.position.set(0, 0.2, 1.2);
    scene.add(coreLight);
    coreLightRef.current = coreLight;

    // 4. Luxury PBR Materials
    const goldPbrMaterial = new THREE.MeshStandardMaterial({
      color: currentSpecialist.armorColor,
      metalness: 0.95,
      roughness: 0.18,
      envMapIntensity: 1.5
    });
    goldMaterialRef.current = goldPbrMaterial;

    const polishedDarkChromeMaterial = new THREE.MeshStandardMaterial({
      color: 0x141418,
      metalness: 0.98,
      roughness: 0.12
    });

    const cyanVisorMaterial = new THREE.MeshBasicMaterial({
      color: currentSpecialist.visorColor
    });
    eyeMaterialRef.current = cyanVisorMaterial;

    const goldTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0xffe082,
      metalness: 0.9,
      roughness: 0.25
    });

    // 5. Construct Procedural Multi-Part 3D Luxury Robot
    const rootRobot = new THREE.Group();
    robotGroupRef.current = rootRobot;
    scene.add(rootRobot);

    // --- Robot Head Group (Swivels with cursor) ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.85, 0);
    headGroupRef.current = headGroup;
    rootRobot.add(headGroup);

    // Head Base (Smooth Cybernetic Helmet)
    const headGeo = new THREE.SphereGeometry(0.85, 32, 32);
    headGeo.scale(1.0, 1.05, 0.95);
    const headMesh = new THREE.Mesh(headGeo, goldPbrMaterial);
    headGroup.add(headMesh);

    // Face Visor Inset (Dark Glass Faceplate)
    const visorGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.38, 32, 1, false, 0, Math.PI);
    visorGeo.rotateY(Math.PI / 2);
    const visorMesh = new THREE.Mesh(visorGeo, polishedDarkChromeMaterial);
    visorMesh.position.set(0, 0.05, 0.58);
    visorMesh.scale.set(1.15, 0.9, 0.4);
    headGroup.add(visorMesh);

    // Cybernetic Glowing Eyes (Horizontal Dual LED Bar)
    const eyeGeo = new THREE.CapsuleGeometry(0.065, 0.38, 8, 16);
    eyeGeo.rotateZ(Math.PI / 2);
    const eyeMesh = new THREE.Mesh(eyeGeo, cyanVisorMaterial);
    eyeMesh.position.set(0, 0.08, 0.76);
    headGroup.add(eyeMesh);

    // Secondary Auxiliary Micro Optic (Amber Sensor)
    const auxEyeGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const auxEyeMat = new THREE.MeshBasicMaterial({ color: 0xffb300 });
    const auxEye = new THREE.Mesh(auxEyeGeo, auxEyeMat);
    auxEye.position.set(0.32, -0.06, 0.72);
    headGroup.add(auxEye);

    // Ear Antennas / Audio Sensory Pods (Gold Cylinder with Cyber Fins)
    const earGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 16);
    earGeo.rotateZ(Math.PI / 2);
    const leftEar = new THREE.Mesh(earGeo, goldTrimMaterial);
    leftEar.position.set(-0.85, 0.05, 0);
    headGroup.add(leftEar);

    const rightEar = leftEar.clone();
    rightEar.position.set(0.85, 0.05, 0);
    headGroup.add(rightEar);

    // Crown Crest / VIP Agency Emblem
    const crestGeo = new THREE.BoxGeometry(0.12, 0.28, 0.6);
    const crestMesh = new THREE.Mesh(crestGeo, goldTrimMaterial);
    crestMesh.position.set(0, 0.88, -0.05);
    crestMesh.rotation.x = -Math.PI / 8;
    headGroup.add(crestMesh);

    // --- Robot Torso / Chassis Group ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.4, 0);
    rootRobot.add(torsoGroup);

    // Neck Connector (Dark Titanium Hydraulic Ring)
    const neckGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.25, 20);
    const neckMesh = new THREE.Mesh(neckGeo, polishedDarkChromeMaterial);
    neckMesh.position.set(0, 0.45, 0);
    torsoGroup.add(neckMesh);

    // Chest Plate (Polished 24K Gold Angular Chest)
    const chestGeo = new THREE.ConeGeometry(0.95, 1.1, 6);
    chestGeo.rotateX(Math.PI);
    chestGeo.scale(1.1, 0.9, 0.75);
    const chestMesh = new THREE.Mesh(chestGeo, goldPbrMaterial);
    chestMesh.position.set(0, -0.1, 0);
    torsoGroup.add(chestMesh);

    // Arc Reactor / Core Glowing Chamber in Chest Center
    const arcRingGeo = new THREE.TorusGeometry(0.24, 0.05, 16, 32);
    const arcRingMesh = new THREE.Mesh(arcRingGeo, goldTrimMaterial);
    arcRingMesh.position.set(0, 0.05, 0.52);
    torsoGroup.add(arcRingMesh);

    const arcCoreGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const arcCoreMesh = new THREE.Mesh(arcCoreGeo, cyanVisorMaterial);
    arcCoreMesh.position.set(0, 0.05, 0.52);
    torsoGroup.add(arcCoreMesh);

    // Floating Shoulder Pauldrons (Anti-Gravity Magnetic Floating Pads)
    const shoulderGeo = new THREE.SphereGeometry(0.42, 20, 20);
    shoulderGeo.scale(1.3, 0.7, 0.9);

    const leftShoulder = new THREE.Mesh(shoulderGeo, goldPbrMaterial);
    leftShoulder.position.set(-1.25, 0.2, 0);
    leftShoulder.rotation.z = Math.PI / 6;
    torsoGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, goldPbrMaterial);
    rightShoulder.position.set(1.25, 0.2, 0);
    rightShoulder.rotation.z = -Math.PI / 6;
    torsoGroup.add(rightShoulder);

    // Anti-Gravity Cyber Magnetic Energy Rings (Orbiting Base)
    const auraGroup = new THREE.Group();
    auraGroup.position.set(0, -1.2, 0);
    rootRobot.add(auraGroup);

    const ringGeo1 = new THREE.TorusGeometry(1.05, 0.03, 16, 48);
    ringGeo1.rotateX(Math.PI / 2);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: currentSpecialist.glowColor,
      transparent: true,
      opacity: 0.65
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    auraGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(0.8, 0.02, 16, 48);
    ringGeo2.rotateX(Math.PI / 2.2);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat1);
    auraGroup.add(ring2);

    // Particle Cloud (Upward luxury golden embers)
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 3.5;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: currentSpecialist.visorColor,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 6. Interactive Mouse Tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTracking) return;
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePosRef.current = { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Animation Game Loop (Clock / Sine Levitation & Swivel)
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Floating sine-wave levitation
      if (rootRobot) {
        rootRobot.position.y = Math.sin(elapsedTime * 2.2) * 0.12;
      }

      // Magnetic floating shoulders subtle offset
      if (leftShoulder && rightShoulder) {
        leftShoulder.position.y = 0.2 + Math.sin(elapsedTime * 3.0) * 0.04;
        rightShoulder.position.y = 0.2 + Math.sin(elapsedTime * 3.0 + 1) * 0.04;
      }

      // Head tracking smooth interpolation towards mouse position
      if (headGroup) {
        const targetRotY = mousePosRef.current.x * 0.55;
        const targetRotX = -mousePosRef.current.y * 0.35;
        headGroup.rotation.y += (targetRotY - headGroup.rotation.y) * 0.08;
        headGroup.rotation.x += (targetRotX - headGroup.rotation.x) * 0.08;
      }

      // Aura Rings rotation
      if (auraGroup) {
        auraGroup.rotation.y = elapsedTime * 0.45;
        auraGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.08;
      }

      // Sparkle particles upward drift
      if (particles) {
        const pos = particles.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          let y = pos.getY(i) + 0.008;
          if (y > 2.2) y = -2.2;
          pos.setY(i, y);
        }
        pos.needsUpdate = true;
        particles.rotation.y = elapsedTime * 0.1;
      }

      // Mood-based Visor & Core Glow Modulation
      if (eyeMaterialRef.current && coreLightRef.current) {
        if (mood === 'listening') {
          eyeMaterialRef.current.color.setHex(0x00f2fe);
          coreLightRef.current.color.setHex(0x00f2fe);
          coreLightRef.current.intensity = 3.8 + Math.sin(elapsedTime * 10) * 1.5;
        } else if (mood === 'thinking') {
          eyeMaterialRef.current.color.setHex(0xffaa00);
          coreLightRef.current.color.setHex(0xffaa00);
          coreLightRef.current.intensity = 3.2 + Math.cos(elapsedTime * 8) * 1.2;
        } else if (mood === 'speaking') {
          eyeMaterialRef.current.color.setHex(0x10b981);
          coreLightRef.current.color.setHex(0x10b981);
          coreLightRef.current.intensity = 4.2 + Math.sin(elapsedTime * 14) * 2.0;
        } else if (mood === 'success') {
          eyeMaterialRef.current.color.setHex(0xffd700);
          coreLightRef.current.color.setHex(0xffd700);
          coreLightRef.current.intensity = 4.5;
        } else {
          // Idle luxury breathing using specialist's colors
          eyeMaterialRef.current.color.setHex(currentSpecialist.visorColor);
          coreLightRef.current.color.setHex(currentSpecialist.glowColor);
          coreLightRef.current.intensity = 2.4 + Math.sin(elapsedTime * 3) * 0.8;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup & Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Recursive disposal
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [size, mood, enableTracking, currentSpecialist]);

  return (
    <div
      ref={mountRef}
      onClick={interactive && onClick ? onClick : undefined}
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-300' : ''
      } ${className}`}
      title={`AVA Smart AI Robot: ${currentSpecialist.nameEn}`}
    />
  );
};
