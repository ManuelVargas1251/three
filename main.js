import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Configuration & Constants
const REVEAL_SPEED = 0.03; // Drag sensitivity
const DECAY_SPEED = 0.016; // Speed at which wireframe fades back to solid
let MATERIAL_COLOR = 0x00ff99;

// Scene, Camera, Renderer
const container = document.getElementById('canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,   // field of view in degrees 75
  window.innerWidth / window.innerHeight,   // aspect ratio
  0.1,  // near clipping plane
  1000  // far clipping plane
);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// resolution rendering on mobile high-DPI screens
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Add Orbit Controls (Works with Touch/Mobile Gestures)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Meshes (Solid Base + Wireframe Overlay)
const geometry = new THREE.IcosahedronGeometry(1.1, 2);

const solidMaterial = new THREE.MeshBasicMaterial({
  color: MATERIAL_COLOR,
  transparent: true,
  opacity: 1.0,
  depthWrite: false // so solid mesh doesn't occlude the wireframe
});
const solidMesh = new THREE.Mesh(geometry, solidMaterial);

const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: MATERIAL_COLOR,
  wireframe: true,
  transparent: true,
  opacity: 0.0
});
const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);

const icosahedronGroup = new THREE.Group();
icosahedronGroup.add(solidMesh);
icosahedronGroup.add(wireframeMesh);
scene.add(icosahedronGroup);

// Drag Interaction Tracker: State Variables
let isDragging = false;
let dragProgress = 0; // 0 = Solid, 1 = Full Wireframe

renderer.domElement.addEventListener('pointerdown', () => {
  isDragging = true;
});

const stopDragging = () => {
  isDragging = false;
};

window.addEventListener('pointerup', stopDragging);
window.addEventListener('pointercancel', stopDragging);

renderer.domElement.addEventListener('pointermove', (event) => {
  if (isDragging && event.buttons !== 0) {
    dragProgress = Math.min(1, dragProgress + REVEAL_SPEED);
  }
});

// Mobile Resizing & Orientation Changes
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  if (!isDragging && dragProgress > 0) {
    dragProgress = Math.max(0, dragProgress - DECAY_SPEED);
  }

  solidMaterial.opacity = 1 - dragProgress;
  wireframeMaterial.opacity = Math.max(0.2, dragProgress);
  solidMesh.visible = solidMaterial.opacity > 0.01;

  icosahedronGroup.rotation.x += 0.03;
  icosahedronGroup.rotation.y += 0.06;

  controls.update();
  renderer.render(scene, camera);
}

animate();