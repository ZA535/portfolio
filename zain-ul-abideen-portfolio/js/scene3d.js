import * as THREE from "three";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let bgParticleMat = null;
let bgWireMat = null;

function isLightTheme() {
  return document.documentElement.getAttribute("data-theme") === "light";
}

function applyBackgroundTheme() {
  const light = isLightTheme();
  if (bgParticleMat) {
    bgParticleMat.color.setHex(light ? 0x0369a1 : 0x7dd3fc);
    bgParticleMat.opacity = light ? 0.28 : 0.65;
  }
  if (bgWireMat) {
    bgWireMat.opacity = light ? 0.12 : 0.22;
  }
}

function initBackground() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return null;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 28;

  const group = new THREE.Group();
  scene.add(group);

  const coreGeo = new THREE.IcosahedronGeometry(4.2, 1);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    metalness: 0.35,
    roughness: 0.15,
    transmission: 0.55,
    thickness: 1.2,
    transparent: true,
    opacity: 0.85,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  bgWireMat = new THREE.MeshBasicMaterial({
    color: 0xa78bfa,
    wireframe: true,
    transparent: true,
    opacity: 0.22,
  });
  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(4.6, 2), bgWireMat);
  group.add(wire);

  const ringGeo = new THREE.TorusGeometry(9, 0.08, 16, 120);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.5 });
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  const ring2 = new THREE.Mesh(ringGeo, ringMat.clone());
  ring2.rotation.x = Math.PI / 2.4;
  ring2.material.opacity = 0.35;
  group.add(ring1, ring2);

  const particleCount = prefersReducedMotion ? 400 : 1200;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 12 + Math.random() * 18;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const particles = new THREE.BufferGeometry();
  particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  bgParticleMat = new THREE.PointsMaterial({
    color: 0x7dd3fc,
    size: 0.06,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });
  const points = new THREE.Points(particles, bgParticleMat);
  scene.add(points);

  const ambient = new THREE.AmbientLight(0xffffff, 0.45);
  const key = new THREE.DirectionalLight(0x38bdf8, 1.1);
  key.position.set(8, 12, 10);
  const fill = new THREE.DirectionalLight(0xa78bfa, 0.55);
  fill.position.set(-10, -4, 6);
  scene.add(ambient, key, fill);

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("pointermove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    if (!prefersReducedMotion) {
      core.rotation.y = t * 0.22;
      core.rotation.x = t * 0.08;
      wire.rotation.y = -t * 0.15;
      ring1.rotation.z = t * 0.12;
      ring2.rotation.x = t * 0.1;
      points.rotation.y = t * 0.02;
    }
    group.rotation.y += (mouseX * 0.15 - group.rotation.y) * 0.03;
    group.rotation.x += (-mouseY * 0.1 - group.rotation.x) * 0.03;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  applyBackgroundTheme();
  return { renderer, scene, camera };
}

function initMiniScene(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const w = container.clientWidth;
  const h = container.clientHeight || 200;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.z = 6;

  const colors = [0x38bdf8, 0xa78bfa, 0x34d399, 0xf472b6];
  const orbit = new THREE.Group();
  colors.forEach((color, i) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 24, 24),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35, metalness: 0.4, roughness: 0.3 })
    );
    const angle = (i / colors.length) * Math.PI * 2;
    mesh.position.set(Math.cos(angle) * 2.2, Math.sin(angle * 0.5) * 0.8, Math.sin(angle) * 2.2);
    orbit.add(mesh);
  });
  scene.add(orbit);

  const light = new THREE.PointLight(0xffffff, 2, 20);
  light.position.set(3, 4, 5);
  scene.add(light, new THREE.AmbientLight(0x404060, 0.8));

  const clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    if (!prefersReducedMotion) orbit.rotation.y = t * 0.5;
    renderer.render(scene, camera);
  }
  tick();
}

function initProjectCube(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const w = container.clientWidth;
  const h = container.clientHeight || 220;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
  camera.position.z = 5;

  const geometry = new THREE.BoxGeometry(2.2, 2.2, 2.2);
  const materials = [
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.5, roughness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: 0xa78bfa, metalness: 0.5, roughness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: 0x34d399, metalness: 0.5, roughness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.5, roughness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: 0xa78bfa, metalness: 0.5, roughness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: 0x34d399, metalness: 0.5, roughness: 0.2 }),
  ];
  const cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })
  );
  scene.add(edges);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const spot = new THREE.SpotLight(0x38bdf8, 2);
  spot.position.set(4, 6, 5);
  scene.add(spot);

  const clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    if (!prefersReducedMotion) {
      cube.rotation.x = t * 0.35;
      cube.rotation.y = t * 0.5;
      edges.rotation.copy(cube.rotation);
    }
    renderer.render(scene, camera);
  }
  tick();
}

initBackground();
initMiniScene("mini-orbit");
initProjectCube("project-cube");

window.addEventListener("themechange", () => {
  applyBackgroundTheme();
});
