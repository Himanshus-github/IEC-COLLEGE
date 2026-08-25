import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  RotateCw, 
  Sun, 
  Moon, 
  Sunset, 
  Layers, 
  Eye, 
  Maximize2, 
  Minimize2, 
  Info, 
  Building2, 
  DoorOpen, 
  UserCheck, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  MapPin,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { BUILDINGS, ROOMS } from '../data/campusData';
import { Building, Teacher } from '../types';

interface ThreeCampusMap3DProps {
  onSelectBuilding?: (buildingId: string) => void;
  selectedBuildingId?: string;
  teachers?: Teacher[];
}

interface Building3DDef {
  id: string;
  name: string;
  code: string;
  posX: number;
  posZ: number;
  width: number;
  depth: number;
  height: number;
  color: number;
  accentColor: number;
  floorsCount: number;
  description: string;
  departments: string[];
}

const IEC_3D_BUILDINGS: Building3DDef[] = [
  {
    id: 'block-e',
    name: 'Block E (Computer Science & AI Hub)',
    code: 'BLOCK-E',
    posX: 16,
    posZ: -12,
    width: 22,
    depth: 18,
    height: 18,
    color: 0x1e293b,
    accentColor: 0xef4444, // Red glow
    floorsCount: 4,
    description: 'Premier Computing, Cloud, Artificial Intelligence, and Innovation Hub with advanced GPU server rooms.',
    departments: ['Computer Science & Engineering', 'Information Technology', 'AI & Machine Learning']
  },
  {
    id: 'block-a',
    name: 'Block A (Administrative Block & Director Secretariat)',
    code: 'BLOCK-A',
    posX: -18,
    posZ: -12,
    width: 24,
    depth: 16,
    height: 16,
    color: 0x334155,
    accentColor: 0x3b82f6, // Blue
    floorsCount: 4,
    description: 'Central Directorate, Registrar Office, Accounts, Central Auditorium, and Board Rooms.',
    departments: ['Administration', 'Management Studies (MBA)', 'Applied Sciences & Humanities']
  },
  {
    id: 'block-b',
    name: 'Block B (Electronics & Electrical Engineering)',
    code: 'BLOCK-B',
    posX: -18,
    posZ: 14,
    width: 20,
    depth: 16,
    height: 15,
    color: 0x1e293b,
    accentColor: 0xf59e0b, // Amber
    floorsCount: 4,
    description: 'VLSI Design Labs, Embedded Systems, Robotics, Power Systems, and Signal Processing.',
    departments: ['Electronics & Communication Engineering', 'Electrical & Electronics Engineering']
  },
  {
    id: 'block-c',
    name: 'Block C (Mechanical & Civil Engineering)',
    code: 'BLOCK-C',
    posX: 16,
    posZ: 14,
    width: 22,
    depth: 18,
    height: 14,
    color: 0x1e293b,
    accentColor: 0x10b981, // Emerald
    floorsCount: 3,
    description: 'High-bay Mechanical Workshop, CNC Machining, CAD/CAM Center, Structural Engineering, and Fluid Mechanics.',
    departments: ['Mechanical Engineering', 'Civil Engineering']
  },
  {
    id: 'block-d',
    name: 'Block D (Pharmacy & Bio-Sciences)',
    code: 'BLOCK-D',
    posX: 0,
    posZ: -24,
    width: 26,
    depth: 14,
    height: 14,
    color: 0x1e293b,
    accentColor: 0x06b6d4, // Cyan
    floorsCount: 4,
    description: 'IEC College of Pharmacy, Medicinal Chemistry, Pharmacology Labs, and Botanical Research.',
    departments: ['Pharmacy & Pharmaceutical Sciences']
  },
  {
    id: 'library-rotunda',
    name: 'Central Library & Knowledge Center',
    code: 'LIBRARY',
    posX: 0,
    posZ: 0,
    width: 14,
    depth: 14,
    height: 12,
    color: 0x475569,
    accentColor: 0xa855f7, // Purple
    floorsCount: 3,
    description: '3-tier Digital Library, 50,000+ volumes, IEEE e-journals repository, and silent study chambers.',
    departments: ['Central Library & Digital Archives']
  },
  {
    id: 'food-court',
    name: 'Student Activity Centre & Food Court',
    code: 'CAFETERIA',
    posX: -28,
    posZ: 0,
    width: 12,
    depth: 16,
    height: 8,
    color: 0x334155,
    accentColor: 0xf97316, // Orange
    floorsCount: 2,
    description: 'IEC Food Court, Nescafe Kiosk, Indoor Badminton & Table Tennis, Student Union Hall.',
    departments: ['Student Welfare & Activities']
  },
  {
    id: 'sports-complex',
    name: 'Sports Complex & Cricket Oval',
    code: 'SPORTS',
    posX: 34,
    posZ: 0,
    width: 24,
    depth: 26,
    height: 3,
    color: 0x14532d,
    accentColor: 0x22c55e, // Green
    floorsCount: 1,
    description: 'Full-sized Cricket Ground, Floodlit Basketball Court, Lawn Tennis, and 200m Running Track.',
    departments: ['Physical Education & Sports']
  },
  {
    id: 'main-gate',
    name: 'Main Campus Portal & Security Desk',
    code: 'GATE-01',
    posX: 0,
    posZ: 32,
    width: 16,
    depth: 6,
    height: 7,
    color: 0x991b1b,
    accentColor: 0xef4444, // Red
    floorsCount: 1,
    description: 'Main Entrance on Knowledge Park III, 24/7 Security Desk, Visitor Check-in, and Helpdesk.',
    departments: ['Campus Security & Transport']
  }
];

export const ThreeCampusMap3D: React.FC<ThreeCampusMap3DProps> = ({
  onSelectBuilding,
  selectedBuildingId = 'block-e',
  teachers = []
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building3DDef>(
    IEC_3D_BUILDINGS.find(b => b.id === selectedBuildingId) || IEC_3D_BUILDINGS[0]
  );
  const [hoveredBuilding, setHoveredBuilding] = useState<Building3DDef | null>(null);
  const [lightingMode, setLightingMode] = useState<'day' | 'sunset' | 'night'>('night');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [cameraView, setCameraView] = useState<'iso' | 'top' | 'entrance' | 'block-e'>('iso');
  const [floorElevation, setFloorElevation] = useState<number>(0);
  const [activeFloorInspect, setActiveFloorInspect] = useState<number>(1);

  // References for Three.js engine
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const floorLayersRef = useRef<Map<string, THREE.Mesh[]>>(new Map());
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const cameraAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3.2, radius: 85 });
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  // Filter teachers for current selected building department
  const buildingTeachers = teachers.filter(t => 
    selectedBuilding.departments.some(d => t.department.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(t.department.toLowerCase()))
  );

  // Filter rooms for current building
  const buildingRooms = ROOMS.filter(r => 
    r.buildingId === selectedBuilding.id || (selectedBuilding.id === 'block-e' && r.buildingId === 'block-e')
  );

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.008);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear previous canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.5);
    hemiLightRef.current = hemiLight;
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffedd5, 1.4);
    dirLight.position.set(45, 70, 45);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.left = -60;
    dirLight.shadow.camera.right = 60;
    dirLight.shadow.camera.top = 60;
    dirLight.shadow.camera.bottom = -60;
    dirLightRef.current = dirLight;
    scene.add(dirLight);

    // 1. Campus Ground Base Terrain (17.5 Acres)
    const groundGeo = new THREE.PlaneGeometry(160, 140, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.85,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 2. Campus Ring Road
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x172033,
      roughness: 0.7,
      metalness: 0.2
    });
    const roadOuterGeo = new THREE.RingGeometry(38, 48, 64);
    const roadOuter = new THREE.Mesh(roadOuterGeo, roadMat);
    roadOuter.rotation.x = -Math.PI / 2;
    roadOuter.position.y = 0.02;
    roadOuter.receiveShadow = true;
    scene.add(roadOuter);

    // 3. Central Grass Courtyard & Lawns
    const lawnMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.9,
      metalness: 0.05
    });
    const lawnGeo = new THREE.BoxGeometry(22, 0.2, 22);
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.position.set(0, 0.1, 0);
    lawn.receiveShadow = true;
    scene.add(lawn);

    // Sports Field Pitch
    const pitchMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
    const pitch = new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 0.2, 32), pitchMat);
    pitch.position.set(34, 0.1, 0);
    pitch.receiveShadow = true;
    scene.add(pitch);

    // Basketball Court
    const bballMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 });
    const bball = new THREE.Mesh(new THREE.BoxGeometry(10, 0.22, 6), bballMat);
    bball.position.set(34, 0.15, 14);
    bball.receiveShadow = true;
    scene.add(bball);

    // 4. Populate 3D Buildings
    buildingMeshesRef.current.clear();
    floorLayersRef.current.clear();

    IEC_3D_BUILDINGS.forEach((b) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(b.posX, 0, b.posZ);
      bGroup.userData = { building: b };

      const floorHeight = b.height / b.floorsCount;
      const floorMeshes: THREE.Mesh[] = [];

      for (let f = 0; f < b.floorsCount; f++) {
        const fGeo = new THREE.BoxGeometry(b.width, floorHeight * 0.92, b.depth);
        const isBlockE = b.id === 'block-e';

        const fMat = new THREE.MeshStandardMaterial({
          color: isBlockE ? (f === 0 ? 0x0f172a : 0x1e293b) : b.color,
          roughness: 0.3,
          metalness: 0.4,
          emissive: b.accentColor,
          emissiveIntensity: isBlockE ? 0.25 : 0.08
        });

        const fMesh = new THREE.Mesh(fGeo, fMat);
        fMesh.position.y = floorHeight * f + floorHeight / 2;
        fMesh.castShadow = true;
        fMesh.receiveShadow = true;
        fMesh.userData = { buildingId: b.id, floorNum: f + 1 };
        bGroup.add(fMesh);
        floorMeshes.push(fMesh);

        // Window stripes
        const winGeo = new THREE.BoxGeometry(b.width * 1.01, floorHeight * 0.35, b.depth * 1.01);
        const winMat = new THREE.MeshStandardMaterial({
          color: isBlockE ? 0x38bdf8 : 0x94a3b8,
          roughness: 0.1,
          metalness: 0.8,
          emissive: isBlockE ? 0x0284c7 : 0x334155,
          emissiveIntensity: 0.4
        });
        const winMesh = new THREE.Mesh(winGeo, winMat);
        winMesh.position.y = floorHeight * f + floorHeight / 2;
        bGroup.add(winMesh);
      }

      // Roof details
      const roofGeo = new THREE.BoxGeometry(b.width * 0.7, 1.2, b.depth * 0.7);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = b.height + 0.6;
      roof.castShadow = true;
      bGroup.add(roof);

      // Accent Beacon on roof
      const beaconGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 8);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: b.accentColor,
        emissive: b.accentColor,
        emissiveIntensity: 0.8
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(0, b.height + 2, 0);
      bGroup.add(beacon);

      scene.add(bGroup);
      buildingMeshesRef.current.set(b.id, bGroup);
      floorLayersRef.current.set(b.id, floorMeshes);
    });

    // 5. Trees around campus
    const treeGeo = new THREE.ConeGeometry(1.6, 4.5, 6);
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.9 });
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.5, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });

    const treePositions = [
      [-10, 0, -4], [-8, 0, 4], [8, 0, -4], [10, 0, 4],
      [-28, 0, -18], [-28, 0, 18], [28, 0, -22], [28, 0, 22],
      [-4, 0, 24], [4, 0, 24], [-12, 0, 26], [12, 0, 26],
      [-32, 0, -8], [-32, 0, 8], [0, 0, -12], [0, 0, 12]
    ];

    treePositions.forEach(([tx, ty, tz]) => {
      const treeGroup = new THREE.Group();
      const foliage = new THREE.Mesh(treeGeo, treeMat);
      foliage.position.y = 3.2;
      foliage.castShadow = true;
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.75;
      trunk.castShadow = true;
      treeGroup.add(foliage);
      treeGroup.add(trunk);
      treeGroup.position.set(tx, 0, tz);
      scene.add(treeGroup);
    });

    // 6. Streetlights with Point Lights
    const lightPosts = [
      [-14, 0, 0], [14, 0, 0], [0, 0, -14], [0, 0, 14],
      [-24, 0, -14], [24, 0, -14], [-24, 0, 14], [24, 0, 14]
    ];

    lightPosts.forEach(([lx, ly, lz]) => {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.16, 5, 8),
        new THREE.MeshStandardMaterial({ color: 0x64748b })
      );
      post.position.set(lx, 2.5, lz);
      scene.add(post);

      const lamp = new THREE.PointLight(0xfef08a, 0.6, 18);
      lamp.position.set(lx, 5, lz);
      scene.add(lamp);
    });

    // Mouse Raycaster for building hover/click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      let foundBuilding: Building3DDef | null = null;
      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr !== scene) {
          if (curr.userData && curr.userData.building) {
            foundBuilding = curr.userData.building;
            break;
          }
          curr = curr.parent;
        }
        if (foundBuilding) break;
      }
      setHoveredBuilding(foundBuilding);
    };

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handlePointerMoveDrag = (e: MouseEvent) => {
      handlePointerMove(e);
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      cameraAngleRef.current.theta -= deltaX * 0.006;
      cameraAngleRef.current.phi = Math.max(0.15, Math.min(Math.PI / 2.1, cameraAngleRef.current.phi - deltaY * 0.006));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      updateCameraPosition();
    };

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr !== scene) {
          if (curr.userData && curr.userData.building) {
            const b = curr.userData.building as Building3DDef;
            setSelectedBuilding(b);
            if (onSelectBuilding) onSelectBuilding(b.id);
            return;
          }
          curr = curr.parent;
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraAngleRef.current.radius = Math.max(35, Math.min(130, cameraAngleRef.current.radius + e.deltaY * 0.08));
      updateCameraPosition();
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    domEl.addEventListener('pointermove', handlePointerMoveDrag);
    domEl.addEventListener('click', handleClick);
    domEl.addEventListener('wheel', handleWheel, { passive: false });

    // Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (isAutoRotating && !isDraggingRef.current) {
        cameraAngleRef.current.theta += 0.0018;
        updateCameraPosition();
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      domEl.removeEventListener('pointermove', handlePointerMoveDrag);
      domEl.removeEventListener('click', handleClick);
      domEl.removeEventListener('wheel', handleWheel);
      renderer.dispose();
    };
  }, []);

  // Update Camera based on spherical angles
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { theta, phi, radius } = cameraAngleRef.current;
    const target = cameraTargetRef.current;

    cameraRef.current.position.x = target.x + radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.y = target.y + radius * Math.cos(phi);
    cameraRef.current.position.z = target.z + radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.lookAt(target);
  };

  // Switch Lighting Themes
  useEffect(() => {
    if (!sceneRef.current || !dirLightRef.current || !ambientLightRef.current || !hemiLightRef.current) return;

    if (lightingMode === 'day') {
      sceneRef.current.background = new THREE.Color(0x0284c7);
      sceneRef.current.fog = new THREE.FogExp2(0x0284c7, 0.005);
      ambientLightRef.current.color = new THREE.Color(0xffffff);
      ambientLightRef.current.intensity = 0.9;
      dirLightRef.current.color = new THREE.Color(0xffffff);
      dirLightRef.current.intensity = 1.8;
      hemiLightRef.current.intensity = 0.7;
    } else if (lightingMode === 'sunset') {
      sceneRef.current.background = new THREE.Color(0x7c2d12);
      sceneRef.current.fog = new THREE.FogExp2(0x7c2d12, 0.006);
      ambientLightRef.current.color = new THREE.Color(0xfde047);
      ambientLightRef.current.intensity = 0.7;
      dirLightRef.current.color = new THREE.Color(0xf97316);
      dirLightRef.current.intensity = 1.9;
      hemiLightRef.current.intensity = 0.5;
    } else {
      // Night
      sceneRef.current.background = new THREE.Color(0x090d16);
      sceneRef.current.fog = new THREE.FogExp2(0x090d16, 0.008);
      ambientLightRef.current.color = new THREE.Color(0x38bdf8);
      ambientLightRef.current.intensity = 0.4;
      dirLightRef.current.color = new THREE.Color(0x60a5fa);
      dirLightRef.current.intensity = 0.8;
      hemiLightRef.current.intensity = 0.3;
    }
  }, [lightingMode]);

  // Floor Elevation Slicing / Exploded View
  useEffect(() => {
    floorLayersRef.current.forEach((meshes, bId) => {
      const isTarget = bId === selectedBuilding.id;
      meshes.forEach((mesh, index) => {
        const baseFloorHeight = mesh.userData.floorNum;
        if (isTarget && floorElevation > 0) {
          mesh.position.y = (baseFloorHeight * 4.5) + (index * floorElevation * 2.2);
        } else {
          mesh.position.y = baseFloorHeight * 4.5 - 2;
        }
      });
    });
  }, [floorElevation, selectedBuilding]);

  // Camera presets
  const handleSetPreset = (preset: 'iso' | 'top' | 'entrance' | 'block-e') => {
    setCameraView(preset);
    setIsAutoRotating(false);

    if (preset === 'iso') {
      cameraAngleRef.current = { theta: Math.PI / 4, phi: Math.PI / 3.2, radius: 85 };
      cameraTargetRef.current.set(0, 0, 0);
    } else if (preset === 'top') {
      cameraAngleRef.current = { theta: 0, phi: 0.18, radius: 95 };
      cameraTargetRef.current.set(0, 0, 0);
    } else if (preset === 'entrance') {
      cameraAngleRef.current = { theta: Math.PI / 2, phi: Math.PI / 2.8, radius: 60 };
      cameraTargetRef.current.set(0, 0, 20);
    } else if (preset === 'block-e') {
      cameraAngleRef.current = { theta: Math.PI / 5, phi: Math.PI / 3.5, radius: 45 };
      cameraTargetRef.current.set(16, 6, -12);
    }
    updateCameraPosition();
  };

  return (
    <div id="three-campus-map-container" className="space-y-4">
      {/* 3D Map Header & Control Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-100 tracking-tight">
                3D Interactive Campus Model • IEC Group of Colleges
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-red-600/20 border border-red-500/30 text-red-400 text-[10px] font-bold">
                WebGL 3D
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Knowledge Park III • 17.5-Acre Campus • Drag to Orbit 360° • Click Buildings to Inspect
            </p>
          </div>
        </div>

        {/* View Controls & Lighting */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Lighting Mode Pill */}
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              onClick={() => setLightingMode('day')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                lightingMode === 'day' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Daylight Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('sunset')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                lightingMode === 'sunset' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Sunset Golden Hour"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('night')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                lightingMode === 'night' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Cyberpunk Night Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Auto Orbit Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isAutoRotating
                ? 'bg-red-600/20 border-red-500/40 text-red-400'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoRotating ? 'Pause Orbit' : 'Auto Orbit'}</span>
          </motion.button>

          {/* Camera Angles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleSetPreset('iso')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                cameraView === 'iso' ? 'bg-slate-800 text-white border border-slate-700' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Isometric
            </button>
            <button
              onClick={() => handleSetPreset('top')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                cameraView === 'top' ? 'bg-slate-800 text-white border border-slate-700' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Top-Down
            </button>
            <button
              onClick={() => handleSetPreset('block-e')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                cameraView === 'block-e' ? 'bg-red-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Block E
            </button>
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas + Right Dossier Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 3D Canvas */}
        <div className="lg:col-span-2 relative bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl min-h-[480px] sm:min-h-[560px] flex flex-col justify-between">
          <div ref={mountRef} className="w-full h-full min-h-[480px] sm:min-h-[560px] cursor-grab active:cursor-grabbing" />

          {/* Floating Hover Indicator Banner */}
          <AnimatePresence>
            {hoveredBuilding && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-4 left-4 z-20 bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-2 text-xs text-slate-200 shadow-2xl backdrop-blur-md flex items-center gap-3 pointer-events-none"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
                <div>
                  <div className="font-bold text-white">{hoveredBuilding.name}</div>
                  <div className="text-[11px] text-slate-400">{hoveredBuilding.code} • {hoveredBuilding.floorsCount} Floors</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D Exploded Floor Slider Control */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 backdrop-blur-md shadow-xl text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-400" />
              <span className="font-semibold">3D Exploded Floor Slicing:</span>
              <input
                type="range"
                min="0"
                max="3"
                step="0.5"
                value={floorElevation}
                onChange={(e) => setFloorElevation(parseFloat(e.target.value))}
                className="w-28 sm:w-36 accent-red-500 cursor-pointer"
              />
              <span className="font-mono text-red-400 font-bold">{floorElevation > 0 ? `+${floorElevation}x Split` : 'Joined'}</span>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Left-Click: Rotate • Right-Click: Pan • Scroll: Zoom</span>
            </div>
          </div>
        </div>

        {/* Right: Selected 3D Building Dossier with Assigned Faculty & Subjects */}
        <motion.div
          layout
          className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 backdrop-blur-md"
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-black bg-red-500/10 border border-red-500/30 text-red-400">
                  {selectedBuilding.code}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Knowledge Park III</span>
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-2">
                {selectedBuilding.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {selectedBuilding.description}
              </p>
            </div>

            {/* Department Tags */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Departments Hosted:</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedBuilding.departments.map(dept => (
                  <span key={dept} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            {/* Faculty Members for this Department */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-red-400" />
                  <span>Assigned Faculty ({buildingTeachers.length})</span>
                </span>
                <span className="text-[10px] text-slate-400">Name & Teaching Subject</span>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {buildingTeachers.length > 0 ? (
                  buildingTeachers.map(teacher => (
                    <div
                      key={teacher.id}
                      className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/90 text-xs space-y-1"
                    >
                      <div className="font-bold text-slate-200 flex items-center justify-between">
                        <span>{teacher.name}</span>
                        <span className="text-[10px] text-red-400 font-mono">{teacher.department.split(' ')[0]}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{teacher.teachingSubject}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
                    Faculty cabins and visiting research advisors available on Floor 2.
                  </div>
                )}
              </div>
            </div>

            {/* Floor Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <DoorOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>Floor Laboratories ({selectedBuilding.floorsCount} Levels)</span>
                </span>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: selectedBuilding.floorsCount }, (_, i) => i + 1).map(fl => (
                  <button
                    key={fl}
                    onClick={() => setActiveFloorInspect(fl)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeFloorInspect === fl
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Floor {fl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
            <span>Building Status: <strong className="text-emerald-400">Operational</strong></span>
            <span className="text-slate-300">AKTU College Code: 090</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
