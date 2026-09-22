import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Scene, Camera, Renderer
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
// Ensures correct resolution rendering on mobile high-DPI screens
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// 2. Add Orbit Controls (Works with Touch/Mobile Gestures)
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// 3. Simple Test Mesh (Cube)
const geometry = new THREE.BoxGeometry();   // box
const material = new THREE.MeshBasicMaterial({ color: 0x00ff99, wireframe: false });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 4. Handle Mobile Resizing & Orientation Changes
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// 5. Animation Loop
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.03;
  cube.rotation.y += 0.09;

//   controls.update();
  renderer.render(scene, camera);
}

animate();