import * as THREE from 'three';

export interface StageGeometryHandles {
  root: THREE.Group;
  stage1Group: THREE.Group;
  stage2Group: THREE.Group;
  stage3Group: THREE.Group;
  stage4Group: THREE.Group;
  stage1Materials: THREE.Material[];
  stage2LineMaterials: THREE.LineBasicMaterial[];
  stage3Entries: Array<{
    line: THREE.LineSegments;
    material: THREE.LineBasicMaterial;
    order: number;
  }>;
  stage4SolidEntries: Array<{
    mesh: THREE.Object3D;
    materials: THREE.MeshStandardMaterial[];
    order: number;
    baseOpacity: number[];
  }>;
  scanPlane: THREE.Mesh;
  scanPlaneMaterial: THREE.MeshBasicMaterial;
  contactShadowMaterial: THREE.MeshBasicMaterial;
  interiorGlowLight: THREE.PointLight;
  disposables: {
    geometries: THREE.BufferGeometry[];
    materials: THREE.Material[];
    textures: THREE.Texture[];
  };
}

/**
 * Generates procedural textures in memory (zero network 404s)
 */
function createProceduralTextures(maxAnisotropy: number) {
  // 1. Soft cyan ground glow radial texture
  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = 512;
  glowCanvas.height = 512;
  const gCtx = glowCanvas.getContext('2d')!;
  const grad = gCtx.createRadialGradient(256, 256, 12, 256, 256, 256);
  grad.addColorStop(0, 'rgba(34, 211, 238, 0.42)');
  grad.addColorStop(0.35, 'rgba(14, 165, 233, 0.22)');
  grad.addColorStop(0.7, 'rgba(6, 182, 212, 0.06)');
  grad.addColorStop(1, 'rgba(6, 14, 30, 0)');
  gCtx.fillStyle = grad;
  gCtx.fillRect(0, 0, 512, 512);
  const glowTexture = new THREE.CanvasTexture(glowCanvas);
  glowTexture.colorSpace = THREE.SRGBColorSpace;

  // 2. Soft dark contact shadow texture
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 512;
  shadowCanvas.height = 512;
  const sCtx = shadowCanvas.getContext('2d')!;
  const sGrad = sCtx.createRadialGradient(256, 256, 40, 256, 256, 256);
  sGrad.addColorStop(0, 'rgba(2, 6, 18, 0.72)');
  sGrad.addColorStop(0.6, 'rgba(2, 6, 18, 0.36)');
  sGrad.addColorStop(1, 'rgba(2, 6, 18, 0)');
  sCtx.fillStyle = sGrad;
  sCtx.fillRect(0, 0, 512, 512);
  const contactShadowTexture = new THREE.CanvasTexture(shadowCanvas);
  contactShadowTexture.colorSpace = THREE.SRGBColorSpace;

  // 3. PNG Kwila Hardwood Timber Decking texture
  const woodCanvas = document.createElement('canvas');
  woodCanvas.width = 512;
  woodCanvas.height = 512;
  const wCtx = woodCanvas.getContext('2d')!;
  wCtx.fillStyle = '#7c4a2d';
  wCtx.fillRect(0, 0, 512, 512);
  const plankCount = 16;
  const plankH = 512 / plankCount;
  for (let i = 0; i < plankCount; i++) {
    const y = i * plankH;
    const toneShift = ((i * 37) % 24) - 12;
    wCtx.fillStyle = `rgb(${124 + toneShift}, ${74 + Math.floor(toneShift * 0.6)}, ${45 + Math.floor(toneShift * 0.4)})`;
    wCtx.fillRect(0, y + 1.5, 512, plankH - 3);
    // Plank seam
    wCtx.fillStyle = '#2d1a0e';
    wCtx.fillRect(0, y, 512, 2);
    // Subtle grain streaks
    wCtx.fillStyle = 'rgba(42, 20, 10, 0.14)';
    for (let g = 0; g < 6; g++) {
      wCtx.fillRect((i * 73 + g * 81) % 512, y + 4 + g * 4, 65 + (g * 19) % 40, 1.5);
    }
  }
  const woodTexture = new THREE.CanvasTexture(woodCanvas);
  woodTexture.colorSpace = THREE.SRGBColorSpace;
  woodTexture.wrapS = THREE.RepeatWrapping;
  woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(3, 2);
  woodTexture.anisotropy = maxAnisotropy;

  // 4. Corrugated Tropical Steel Roof texture
  const roofCanvas = document.createElement('canvas');
  roofCanvas.width = 512;
  roofCanvas.height = 512;
  const rCtx = roofCanvas.getContext('2d')!;
  for (let x = 0; x < 512; x++) {
    const rib = Math.sin((x / 512) * Math.PI * 2 * 28) * 0.5 + 0.5;
    const shade = Math.round(44 + rib * 28);
    rCtx.fillStyle = `rgb(${shade}, ${shade + 7}, ${shade + 18})`;
    rCtx.fillRect(x, 0, 1, 512);
  }
  const roofTexture = new THREE.CanvasTexture(roofCanvas);
  roofTexture.colorSpace = THREE.SRGBColorSpace;
  roofTexture.wrapS = THREE.RepeatWrapping;
  roofTexture.wrapT = THREE.RepeatWrapping;
  roofTexture.repeat.set(3, 2);
  roofTexture.anisotropy = maxAnisotropy;

  return {
    glowTexture,
    contactShadowTexture,
    woodTexture,
    roofTexture,
  };
}

/**
 * Helper to create CAD wireframe lines around a box or custom geometry
 */
function addCadWireBox(
  parent: THREE.Group,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  color: number,
  disposables: StageGeometryHandles['disposables'],
  opacity = 0.9
): { line: THREE.LineSegments; material: THREE.LineBasicMaterial } {
  const boxGeo = new THREE.BoxGeometry(w, h, d);
  const edgesGeo = new THREE.EdgesGeometry(boxGeo);
  boxGeo.dispose();

  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  const line = new THREE.LineSegments(edgesGeo, mat);
  line.position.set(x, y, z);
  parent.add(line);

  disposables.geometries.push(edgesGeo);
  disposables.materials.push(mat);
  return { line, material: mat };
}

/**
 * Builds the 5-stage contemporary tropical residential kit home scene graph.
 * Model scale: 1 unit = 1 meter. Main house footprint ~ 10.8m x 7.2m on raised 0.85m stilt deck.
 */
export function buildTropicalKitHomeScene(
  maxAnisotropy: number,
  isSoftwareGl: boolean
): StageGeometryHandles {
  const root = new THREE.Group();
  const stage1Group = new THREE.Group();
  const stage2Group = new THREE.Group();
  const stage3Group = new THREE.Group();
  const stage4Group = new THREE.Group();

  root.add(stage1Group, stage2Group, stage3Group, stage4Group);

  const disposables: StageGeometryHandles['disposables'] = {
    geometries: [],
    materials: [],
    textures: [],
  };

  const textures = createProceduralTextures(maxAnisotropy);
  disposables.textures.push(
    textures.glowTexture,
    textures.contactShadowTexture,
    textures.woodTexture,
    textures.roofTexture
  );

  const stage1Materials: THREE.Material[] = [];
  const stage2LineMaterials: THREE.LineBasicMaterial[] = [];
  const stage3Entries: StageGeometryHandles['stage3Entries'] = [];
  const stage4SolidEntries: StageGeometryHandles['stage4SolidEntries'] = [];

  // =========================================================================
  // STAGE 1: ENGINEERING GRID, TECHNICAL REFERENCE LINES & CYAN GLOW
  // =========================================================================
  // Soft cyan ground halo glow
  const glowGeo = new THREE.PlaneGeometry(24, 24);
  const glowMat = new THREE.MeshBasicMaterial({
    map: textures.glowTexture,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  glowMesh.rotation.x = -Math.PI / 2;
  glowMesh.position.y = 0.005;
  stage1Group.add(glowMesh);
  disposables.geometries.push(glowGeo);
  disposables.materials.push(glowMat);
  stage1Materials.push(glowMat);

  // Fine engineering sub-grid (0.8m spacing)
  const subGridVerts: number[] = [];
  const gridExtent = 12;
  const subStep = 0.8;
  for (let i = -gridExtent; i <= gridExtent + 0.001; i += subStep) {
    subGridVerts.push(-gridExtent, 0.01, i, gridExtent, 0.01, i);
    subGridVerts.push(i, 0.01, -gridExtent, i, 0.01, gridExtent);
  }
  const subGridGeo = new THREE.BufferGeometry();
  subGridGeo.setAttribute('position', new THREE.Float32BufferAttribute(subGridVerts, 3));
  const subGridMat = new THREE.LineBasicMaterial({
    color: 0x0ea5e9,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  });
  const subGrid = new THREE.LineSegments(subGridGeo, subGridMat);
  stage1Group.add(subGrid);
  disposables.geometries.push(subGridGeo);
  disposables.materials.push(subGridMat);
  stage1Materials.push(subGridMat);

  // Major structural reference grid & measurement markers
  const refVerts: number[] = [];
  for (let i = -12; i <= 12; i += 2.4) {
    refVerts.push(-12, 0.014, i, 12, 0.014, i);
    refVerts.push(i, 0.014, -12, i, 0.014, 12);
  }
  // Dimension callout lines + measurement ticks outside house footprint
  const dimZ = 4.9;
  refVerts.push(-5.4, 0.02, dimZ, 5.4, 0.02, dimZ);
  for (let x = -5.4; x <= 5.41; x += 1.8) {
    refVerts.push(x, 0.02, dimZ - 0.18, x, 0.02, dimZ + 0.18);
  }
  const dimX = 6.7;
  refVerts.push(dimX, 0.02, -3.6, dimX, 0.02, 3.6);
  for (let z = -3.6; z <= 3.61; z += 1.8) {
    refVerts.push(dimX - 0.18, 0.02, z, dimX + 0.18, 0.02, z);
  }
  // Corner CAD datum crosshairs
  const corners = [
    [-5.4, -3.6],
    [5.4, -3.6],
    [-5.4, 3.6],
    [5.4, 3.6],
  ];
  for (const [cx, cz] of corners) {
    refVerts.push(cx - 0.45, 0.025, cz, cx + 0.45, 0.025, cz);
    refVerts.push(cx, 0.025, cz - 0.45, cx, 0.025, cz + 0.45);
  }

  const refGeo = new THREE.BufferGeometry();
  refGeo.setAttribute('position', new THREE.Float32BufferAttribute(refVerts, 3));
  const refMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
  });
  const refLines = new THREE.LineSegments(refGeo, refMat);
  stage1Group.add(refLines);
  disposables.geometries.push(refGeo);
  disposables.materials.push(refMat);
  stage1Materials.push(refMat);

  // =========================================================================
  // STAGE 2: FOUNDATION GEOMETRY (PERIMETER, STRUCTURAL GRID & STILT PIERS)
  // =========================================================================
  const pierXs = [-5.0, -2.5, 0.0, 2.5, 5.0];
  const pierZs = [-3.2, 0.0, 1.8, 3.3];
  const pierHeight = 0.85;

  // Perimeter concrete ground plinth outline & deck floor perimeter
  const perimeterCad = addCadWireBox(stage2Group, 10.6, 0.08, 7.0, 0, 0.04, 0.05, 0x22d3ee, disposables, 0.9);
  stage2LineMaterials.push(perimeterCad.material);

  const deckFrameCad = addCadWireBox(stage2Group, 10.6, 0.22, 7.0, 0, pierHeight, 0.05, 0x67e8f9, disposables, 0.95);
  stage2LineMaterials.push(deckFrameCad.material);

  // Floor structural steel joist grid lines
  const joistVerts: number[] = [];
  for (const px of pierXs) {
    joistVerts.push(px, pierHeight, -3.45, px, pierHeight, 3.55);
  }
  for (const pz of pierZs) {
    joistVerts.push(-5.3, pierHeight, pz, 5.3, pierHeight, pz);
  }
  const joistGeo = new THREE.BufferGeometry();
  joistGeo.setAttribute('position', new THREE.Float32BufferAttribute(joistVerts, 3));
  const joistMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
  });
  stage2Group.add(new THREE.LineSegments(joistGeo, joistMat));
  disposables.geometries.push(joistGeo);
  disposables.materials.push(joistMat);
  stage2LineMaterials.push(joistMat);

  // Structural stilt columns & pad footings
  for (const px of pierXs) {
    for (const pz of pierZs) {
      const footingCad = addCadWireBox(stage2Group, 0.48, 0.16, 0.48, px, 0.08, pz, 0x06b6d4, disposables, 0.85);
      const colCad = addCadWireBox(stage2Group, 0.18, pierHeight - 0.12, 0.18, px, 0.48, pz, 0x67e8f9, disposables, 0.92);
      stage2LineMaterials.push(footingCad.material, colCad.material);
    }
  }

  // Front entry stairs wireframe
  for (let s = 0; s < 4; s++) {
    const stepY = 0.12 + s * 0.2;
    const stepZ = 4.35 - s * 0.28;
    const stepCad = addCadWireBox(stage2Group, 2.2, 0.08, 0.3, -1.2, stepY, stepZ, 0x38bdf8, disposables, 0.85);
    stage2LineMaterials.push(stepCad.material);
  }

  // =========================================================================
  // STAGE 3: STRUCTURAL FRAMEWORK (WALLS, OPENINGS, BEAMS & ROOF TRUSSES)
  // =========================================================================
  const deckTopY = pierHeight + 0.11; // ~0.96m
  const wallH = 2.95;
  const wallCenterY = deckTopY + wallH / 2;

  const pushCadFrame = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    color: number,
    order: number
  ) => {
    const item = addCadWireBox(stage3Group, w, h, d, x, y, z, color, disposables, 0.9);
    stage3Entries.push({ ...item, order });
  };

  // Corner & bay steel structural columns (order 0.05 - 0.25)
  const mainCols = [
    [-5.0, -3.2], [-2.5, -3.2], [0.0, -3.2], [2.5, -3.2], [5.0, -3.2],
    [-5.0, 1.8], [0.0, 1.8], [5.0, 1.8],
    [-5.0, 3.3], [0.0, 3.3], [2.5, 3.3], [5.0, 3.3],
  ];
  mainCols.forEach(([cx, cz], i) => {
    pushCadFrame(0.16, wallH, 0.16, cx, wallCenterY, cz, 0x67e8f9, 0.05 + (i / mainCols.length) * 0.18);
  });

  // Top ring beams & lintel framing (order 0.22 - 0.35)
  pushCadFrame(10.2, 0.22, 0.18, 0, deckTopY + wallH, -3.2, 0x38bdf8, 0.25);
  pushCadFrame(10.2, 0.22, 0.18, 0, deckTopY + wallH, 1.8, 0x38bdf8, 0.28);
  pushCadFrame(10.2, 0.2, 0.16, 0, deckTopY + wallH, 3.3, 0x22d3ee, 0.3);
  pushCadFrame(0.18, 0.22, 5.15, -5.0, deckTopY + wallH, -0.7, 0x38bdf8, 0.32);
  pushCadFrame(0.18, 0.22, 5.15, 5.0, deckTopY + wallH, -0.7, 0x38bdf8, 0.34);

  // Wall framing panels around door & window openings (order 0.32 - 0.58)
  // Rear wall bays with clerestory/window openings
  pushCadFrame(3.2, wallH, 0.16, -3.4, wallCenterY, -3.2, 0x38bdf8, 0.36);
  pushCadFrame(3.0, 0.9, 0.16, 0.0, deckTopY + 0.45, -3.2, 0x38bdf8, 0.4);
  pushCadFrame(3.0, 0.55, 0.16, 0.0, deckTopY + wallH - 0.28, -3.2, 0x38bdf8, 0.42);
  pushCadFrame(3.2, wallH, 0.16, 3.4, wallCenterY, -3.2, 0x38bdf8, 0.44);

  // Left & Right side walls with horizontal louver window bays
  pushCadFrame(0.16, wallH, 1.6, -5.0, wallCenterY, -2.4, 0x38bdf8, 0.45);
  pushCadFrame(0.16, 0.95, 2.2, -5.0, deckTopY + 0.48, -0.5, 0x38bdf8, 0.47);
  pushCadFrame(0.16, 0.5, 2.2, -5.0, deckTopY + wallH - 0.25, -0.5, 0x38bdf8, 0.48);
  pushCadFrame(0.16, wallH, 1.2, -5.0, wallCenterY, 1.2, 0x38bdf8, 0.49);

  pushCadFrame(0.16, wallH, 1.5, 5.0, wallCenterY, -2.45, 0x38bdf8, 0.5);
  pushCadFrame(0.16, 0.9, 2.3, 5.0, deckTopY + 0.45, -0.55, 0x38bdf8, 0.52);
  pushCadFrame(0.16, 0.5, 2.3, 5.0, deckTopY + wallH - 0.25, -0.55, 0x38bdf8, 0.53);
  pushCadFrame(0.16, wallH, 1.2, 5.0, wallCenterY, 1.2, 0x38bdf8, 0.54);

  // Front facade framing (sliding door bay & bedroom corner glazing)
  pushCadFrame(1.4, wallH, 0.16, -4.3, wallCenterY, 1.8, 0x22d3ee, 0.55);
  pushCadFrame(3.6, 0.45, 0.16, -1.8, deckTopY + wallH - 0.22, 1.8, 0x22d3ee, 0.56); // Sliding door header
  pushCadFrame(1.4, wallH, 0.16, 0.7, wallCenterY, 1.8, 0x22d3ee, 0.57);
  pushCadFrame(3.6, 0.85, 0.16, 3.2, deckTopY + 0.42, 1.8, 0x22d3ee, 0.58);
  pushCadFrame(3.6, 0.45, 0.16, 3.2, deckTopY + wallH - 0.22, 1.8, 0x22d3ee, 0.59);

  // Door & window opening frames in bright cyan
  pushCadFrame(3.5, 2.45, 0.08, -1.8, deckTopY + 1.25, 1.8, 0xa5f3fc, 0.6); // Main sliding glass opening
  pushCadFrame(3.5, 1.6, 0.08, 3.2, deckTopY + 1.65, 1.8, 0xa5f3fc, 0.62); // Master bedroom glazing

  // Roof Truss System (6 pitched tropical trusses + purlins, order 0.64 - 0.98)
  const eaveY = deckTopY + wallH + 0.1;
  const ridgeY = eaveY + 1.65;
  const ridgeZ = -0.35;
  const frontEaveZ = 4.0;
  const rearEaveZ = -3.95;

  const trussXs = [-5.3, -3.18, -1.06, 1.06, 3.18, 5.3];
  const trussVerts: number[] = [];
  trussXs.forEach((tx, idx) => {
    const verts: number[] = [
      // Bottom chord
      tx, eaveY, rearEaveZ, tx, eaveY, frontEaveZ,
      // Rear & front rafters
      tx, eaveY, rearEaveZ, tx, ridgeY, ridgeZ,
      tx, ridgeY, ridgeZ, tx, eaveY, frontEaveZ,
      // King post & internal web bracing
      tx, eaveY, ridgeZ, tx, ridgeY, ridgeZ,
      tx, eaveY, -2.0, tx, (eaveY + ridgeY) / 2, (rearEaveZ + ridgeZ) / 2,
      tx, eaveY, 1.8, tx, (eaveY + ridgeY) / 2, (frontEaveZ + ridgeZ) / 2,
      tx, eaveY, ridgeZ, tx, (eaveY + ridgeY) / 2, (rearEaveZ + ridgeZ) / 2,
      tx, eaveY, ridgeZ, tx, (eaveY + ridgeY) / 2, (frontEaveZ + ridgeZ) / 2,
    ];
    const tGeo = new THREE.BufferGeometry();
    tGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    const tMat = new THREE.LineBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const tLine = new THREE.LineSegments(tGeo, tMat);
    stage3Group.add(tLine);
    disposables.geometries.push(tGeo);
    disposables.materials.push(tMat);
    stage3Entries.push({ line: tLine, material: tMat, order: 0.65 + (idx / trussXs.length) * 0.22 });
    trussVerts.push(...verts);
  });

  // Longitudinal ridge beam & roof purlins connecting the 6 trusses
  const purlinZs = [
    { z: rearEaveZ, y: eaveY },
    { z: (rearEaveZ + ridgeZ) / 2, y: (eaveY + ridgeY) / 2 },
    { z: ridgeZ, y: ridgeY },
    { z: (frontEaveZ + ridgeZ) / 2, y: (eaveY + ridgeY) / 2 },
    { z: frontEaveZ, y: eaveY },
  ];
  const purlinVerts: number[] = [];
  for (const p of purlinZs) {
    purlinVerts.push(-5.75, p.y, p.z, 5.75, p.y, p.z);
  }
  const purlinGeo = new THREE.BufferGeometry();
  purlinGeo.setAttribute('position', new THREE.Float32BufferAttribute(purlinVerts, 3));
  const purlinMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });
  const purlinLines = new THREE.LineSegments(purlinGeo, purlinMat);
  stage3Group.add(purlinLines);
  disposables.geometries.push(purlinGeo);
  disposables.materials.push(purlinMat);
  stage3Entries.push({ line: purlinLines, material: purlinMat, order: 0.9 });

  // =========================================================================
  // STAGE 4: REALISTIC 3D ARCHITECTURAL KIT HOME TRANSFORMATION
  // =========================================================================
  // Contact grounding shadow plane beneath the home
  const contactGeo = new THREE.PlaneGeometry(16, 12.5);
  const contactMat = new THREE.MeshBasicMaterial({
    map: textures.contactShadowTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const contactMesh = new THREE.Mesh(contactGeo, contactMat);
  contactMesh.rotation.x = -Math.PI / 2;
  contactMesh.position.set(0, 0.02, 0.15);
  stage4Group.add(contactMesh);
  disposables.geometries.push(contactGeo);
  disposables.materials.push(contactMat);

  // Helper for registering solid PBR meshes with smooth opacity reveal
  const registerSolidMesh = (
    geometry: THREE.BufferGeometry,
    material: THREE.MeshStandardMaterial,
    pos: [number, number, number],
    order: number,
    rot: [number, number, number] = [0, 0, 0],
    castShadow = true,
    receiveShadow = true
  ) => {
    material.transparent = true;
    const baseOp = material.opacity ?? 1;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    mesh.castShadow = !isSoftwareGl && castShadow;
    mesh.receiveShadow = !isSoftwareGl && receiveShadow;
    stage4Group.add(mesh);

    disposables.geometries.push(geometry);
    disposables.materials.push(material);
    stage4SolidEntries.push({
      mesh,
      materials: [material],
      order,
      baseOpacity: [baseOp],
    });
    return mesh;
  };

  // Shared architectural PBR material factories (varied roughness >= 0.25 across adjacent parts)
  const concreteMat = () =>
    new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.9,
      metalness: 0.04,
    });
  const darkSteelMat = () =>
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.32,
      metalness: 0.84,
    });
  const timberDeckMat = () =>
    new THREE.MeshStandardMaterial({
      map: textures.woodTexture,
      color: 0xd99b66,
      roughness: 0.72,
      metalness: 0.04,
    });
  const wallCladdingMat = () =>
    new THREE.MeshStandardMaterial({
      color: 0xeaf0f6,
      roughness: 0.76,
      metalness: 0.05,
    });
  const featureTimberMat = () =>
    new THREE.MeshStandardMaterial({
      map: textures.woodTexture,
      color: 0xb97643,
      roughness: 0.65,
      metalness: 0.05,
    });
  const glassMat = () =>
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.08,
      metalness: 0.25,
      opacity: 0.42,
      emissive: 0x0284c7,
      emissiveIntensity: 0.28,
    });
  const roofSheetMat = () =>
    new THREE.MeshStandardMaterial({
      map: textures.roofTexture,
      color: 0x334155,
      roughness: 0.38,
      metalness: 0.58,
    });
  const fasciaMat = () =>
    new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.52,
      metalness: 0.15,
    });

  // 1. Foundation footings & steel stilt piers (order 0.08 - 0.18)
  for (const px of pierXs) {
    for (const pz of pierZs) {
      registerSolidMesh(new THREE.BoxGeometry(0.48, 0.16, 0.48), concreteMat(), [px, 0.08, pz], 0.08, [0, 0, 0], false, true);
      registerSolidMesh(new THREE.BoxGeometry(0.16, pierHeight - 0.1, 0.16), darkSteelMat(), [px, 0.48, pz], 0.14);
    }
  }

  // 2. Kwila Hardwood Verandah Deck & Entry Stairs (order 0.2 - 0.28)
  registerSolidMesh(new THREE.BoxGeometry(10.6, 0.2, 7.0), timberDeckMat(), [0, pierHeight, 0.05], 0.22, [0, 0, 0], true, true);
  registerSolidMesh(new THREE.BoxGeometry(10.72, 0.14, 7.12), darkSteelMat(), [0, pierHeight - 0.08, 0.05], 0.2, [0, 0, 0], true, false);
  for (let s = 0; s < 4; s++) {
    const stepY = 0.12 + s * 0.2;
    const stepZ = 4.35 - s * 0.28;
    registerSolidMesh(new THREE.BoxGeometry(2.2, 0.08, 0.3), timberDeckMat(), [-1.2, stepY, stepZ], 0.26);
  }
  // Sleek steel verandah & stair balustrade posts + horizontal top rail
  [-5.0, -3.5, -2.3, 0.1, 2.5, 5.0].forEach((bx) => {
    registerSolidMesh(new THREE.BoxGeometry(0.06, 0.95, 0.06), darkSteelMat(), [bx, deckTopY + 0.48, 3.45], 0.28);
  });
  registerSolidMesh(new THREE.BoxGeometry(2.76, 0.05, 0.07), featureTimberMat(), [-3.65, deckTopY + 0.96, 3.45], 0.3);
  registerSolidMesh(new THREE.BoxGeometry(5.06, 0.05, 0.07), featureTimberMat(), [2.5, deckTopY + 0.96, 3.45], 0.3);

  // 3. Exterior Insulated Wall Panels & Timber Feature Wall (order 0.34 - 0.55)
  // Rear wall
  registerSolidMesh(new THREE.BoxGeometry(3.2, wallH, 0.18), wallCladdingMat(), [-3.4, wallCenterY, -3.2], 0.36);
  registerSolidMesh(new THREE.BoxGeometry(3.0, 0.9, 0.18), wallCladdingMat(), [0.0, deckTopY + 0.45, -3.2], 0.38);
  registerSolidMesh(new THREE.BoxGeometry(3.0, 0.55, 0.18), wallCladdingMat(), [0.0, deckTopY + wallH - 0.28, -3.2], 0.39);
  registerSolidMesh(new THREE.BoxGeometry(3.2, wallH, 0.18), wallCladdingMat(), [3.4, wallCenterY, -3.2], 0.4);

  // Left & Right side walls
  registerSolidMesh(new THREE.BoxGeometry(0.18, wallH, 1.6), wallCladdingMat(), [-5.0, wallCenterY, -2.4], 0.42);
  registerSolidMesh(new THREE.BoxGeometry(0.18, 0.95, 2.2), wallCladdingMat(), [-5.0, deckTopY + 0.48, -0.5], 0.43);
  registerSolidMesh(new THREE.BoxGeometry(0.18, 0.5, 2.2), wallCladdingMat(), [-5.0, deckTopY + wallH - 0.25, -0.5], 0.44);
  registerSolidMesh(new THREE.BoxGeometry(0.18, wallH, 1.2), wallCladdingMat(), [-5.0, wallCenterY, 1.2], 0.45);

  registerSolidMesh(new THREE.BoxGeometry(0.18, wallH, 1.5), wallCladdingMat(), [5.0, wallCenterY, -2.45], 0.46);
  registerSolidMesh(new THREE.BoxGeometry(0.18, 0.9, 2.3), wallCladdingMat(), [5.0, deckTopY + 0.45, -0.55], 0.47);
  registerSolidMesh(new THREE.BoxGeometry(0.18, 0.5, 2.3), wallCladdingMat(), [5.0, deckTopY + wallH - 0.25, -0.55], 0.48);
  registerSolidMesh(new THREE.BoxGeometry(0.18, wallH, 1.2), wallCladdingMat(), [5.0, wallCenterY, 1.2], 0.49);

  // Front facade cladding & warm Kwila batten accent wall
  registerSolidMesh(new THREE.BoxGeometry(1.4, wallH, 0.18), featureTimberMat(), [-4.3, wallCenterY, 1.8], 0.5);
  registerSolidMesh(new THREE.BoxGeometry(3.6, 0.45, 0.18), wallCladdingMat(), [-1.8, deckTopY + wallH - 0.22, 1.8], 0.52);
  registerSolidMesh(new THREE.BoxGeometry(1.4, wallH, 0.18), featureTimberMat(), [0.7, wallCenterY, 1.8], 0.53);
  registerSolidMesh(new THREE.BoxGeometry(3.6, 0.85, 0.18), wallCladdingMat(), [3.2, deckTopY + 0.42, 1.8], 0.54);
  registerSolidMesh(new THREE.BoxGeometry(3.6, 0.45, 0.18), wallCladdingMat(), [3.2, deckTopY + wallH - 0.22, 1.8], 0.55);

  // Architectural tropical louver sun-screen fins on verandah
  for (let l = 0; l < 6; l++) {
    registerSolidMesh(
      new THREE.BoxGeometry(0.06, wallH, 0.18),
      featureTimberMat(),
      [3.7 + l * 0.24, wallCenterY, 3.3],
      0.56 + l * 0.01
    );
  }
  // Verandah steel posts supporting wide roof overhang
  [-5.0, -0.1, 2.5, 5.0].forEach((vx) => {
    registerSolidMesh(new THREE.BoxGeometry(0.14, wallH + 0.1, 0.14), darkSteelMat(), [vx, wallCenterY + 0.04, 3.3], 0.58);
  });

  // 4. Reflective Architectural Glazing & Anodized Frames (order 0.62 - 0.72)
  // Front sliding doors & master bedroom window
  registerSolidMesh(new THREE.BoxGeometry(3.5, 2.45, 0.05), glassMat(), [-1.8, deckTopY + 1.25, 1.8], 0.64, [0, 0, 0], false, false);
  registerSolidMesh(new THREE.BoxGeometry(0.07, 2.48, 0.1), darkSteelMat(), [-1.8, deckTopY + 1.25, 1.8], 0.65);
  registerSolidMesh(new THREE.BoxGeometry(3.5, 1.6, 0.05), glassMat(), [3.2, deckTopY + 1.65, 1.8], 0.66, [0, 0, 0], false, false);
  registerSolidMesh(new THREE.BoxGeometry(0.07, 1.62, 0.1), darkSteelMat(), [3.2, deckTopY + 1.65, 1.8], 0.67);
  // Side & rear windows
  registerSolidMesh(new THREE.BoxGeometry(0.05, 1.5, 2.2), glassMat(), [-5.0, deckTopY + 1.7, -0.5], 0.68, [0, 0, 0], false, false);
  registerSolidMesh(new THREE.BoxGeometry(0.05, 1.55, 2.3), glassMat(), [5.0, deckTopY + 1.68, -0.55], 0.69, [0, 0, 0], false, false);
  registerSolidMesh(new THREE.BoxGeometry(3.0, 1.5, 0.05), glassMat(), [0.0, deckTopY + 1.65, -3.2], 0.7, [0, 0, 0], false, false);

  // Warm interior living space floor + glowing light bounce
  registerSolidMesh(new THREE.BoxGeometry(9.8, 0.06, 4.8), featureTimberMat(), [0, deckTopY + 0.04, -0.7], 0.6, [0, 0, 0], false, true);
  const interiorGlowLight = new THREE.PointLight(0xffb36b, 0, 11, 1.8);
  interiorGlowLight.position.set(-1.2, deckTopY + 2.2, -0.2);
  stage4Group.add(interiorGlowLight);

  // 5. Tropical Pitched Corrugated Roof Panels, Fascia & Solar Array (order 0.76 - 0.96)
  // Compute slope angles from ridge (ridgeZ, ridgeY) to front & rear eaves
  const frontRun = frontEaveZ - ridgeZ;
  const rearRun = ridgeZ - rearEaveZ;
  const roofRise = ridgeY - eaveY;
  const frontSlopeLen = Math.hypot(frontRun, roofRise) + 0.15;
  const rearSlopeLen = Math.hypot(rearRun, roofRise) + 0.15;
  const frontAngle = Math.atan2(roofRise, frontRun);
  const rearAngle = -Math.atan2(roofRise, rearRun);

  registerSolidMesh(
    new THREE.BoxGeometry(11.6, 0.1, frontSlopeLen),
    roofSheetMat(),
    [0, (eaveY + ridgeY) / 2 + 0.06, (ridgeZ + frontEaveZ) / 2],
    0.8,
    [frontAngle, 0, 0]
  );
  registerSolidMesh(
    new THREE.BoxGeometry(11.6, 0.1, rearSlopeLen),
    roofSheetMat(),
    [0, (eaveY + ridgeY) / 2 + 0.06, (ridgeZ + rearEaveZ) / 2],
    0.84,
    [rearAngle, 0, 0]
  );
  // Crisp ridge cap & white fascia trim
  registerSolidMesh(new THREE.BoxGeometry(11.66, 0.14, 0.36), darkSteelMat(), [0, ridgeY + 0.1, ridgeZ], 0.88);
  registerSolidMesh(new THREE.BoxGeometry(11.66, 0.18, 0.08), fasciaMat(), [0, eaveY + 0.04, frontEaveZ + 0.04], 0.9);
  registerSolidMesh(new THREE.BoxGeometry(11.66, 0.18, 0.08), fasciaMat(), [0, eaveY + 0.04, rearEaveZ - 0.04], 0.91);

  // Integrated solar panel array flush on sunlit front roof pitch
  const createSolarMat = () =>
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.16,
      metalness: 0.88,
      emissive: 0x0369a1,
      emissiveIntensity: 0.15,
    });
  for (let sp = 0; sp < 3; sp++) {
    registerSolidMesh(
      new THREE.BoxGeometry(1.75, 0.05, 1.15),
      createSolarMat(),
      [1.4 + sp * 1.9, (eaveY + ridgeY) / 2 + 0.14, (ridgeZ + frontEaveZ) / 2 - 0.1],
      0.94 + sp * 0.015,
      [frontAngle, 0, 0]
    );
  }

  // =========================================================================
  // ARCHITECTURAL TRANSFORMATION SCAN SWEEP PLANE (Stage 4 effect)
  // =========================================================================
  const scanGeo = new THREE.PlaneGeometry(13.5, 9.6);
  const scanPlaneMaterial = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const scanPlane = new THREE.Mesh(scanGeo, scanPlaneMaterial);
  scanPlane.rotation.x = -Math.PI / 2;
  scanPlane.position.y = 0;
  root.add(scanPlane);
  disposables.geometries.push(scanGeo);
  disposables.materials.push(scanPlaneMaterial);

  return {
    root,
    stage1Group,
    stage2Group,
    stage3Group,
    stage4Group,
    stage1Materials,
    stage2LineMaterials,
    stage3Entries,
    stage4SolidEntries,
    scanPlane,
    scanPlaneMaterial,
    contactShadowMaterial: contactMat,
    interiorGlowLight,
    disposables,
  };
}
