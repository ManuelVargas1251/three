// Imports
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

// Configuration & Constants
const REVEAL_SPEED = 0.03;  // Drag sensitivity
const DECAY_SPEED = 0.016;  // Speed at which wireframe fades back to solid
const MATERIAL_COLOR = 0x00ff99;

// Scene, Camera, Renderers
const container = document.getElementById('canvas') || document.body;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,   // field of view in degrees 75
  window.innerWidth / window.innerHeight,   // aspect ratio
  0.1,  // near clipping plane
  1000  // far clipping plane
);
camera.position.z = 4;

// Renderer 1. WebGL Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// resolution rendering on mobile high-DPI screens
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Renderer 2. CSS3D Renderer (Overlay)
const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
cssRenderer.domElement.style.left = '0';
cssRenderer.domElement.style.pointerEvents = 'none'; // Pass touch/click through to WebGL
document.body.appendChild(cssRenderer.domElement);

// add Orbit Controls (Works with Touch/Mobile Gestures)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Enable smooth damping (inertia) for orbit controls

// Geometry & Meshes
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

// Dynamic Text Element Setup
const textDiv = document.createElement('div');
textDiv.className = 'text-object';
const releaseText = `
  <div style="font-size: 22px; font-weight: 900; letter-spacing: 3px;">SUELTA</div>
  <div style="font-size: 22px; font-weight: 900; letter-spacing: 3px;">ME</div>
  <div style="font-size: 28px; line-height: 1.1;">🌌</div>
`;

const thanksText = `
  <div style="font-size: 22px; font-weight: 900; letter-spacing: 3px; display: inline-block;">
    <span style="letter-spacing: 0px; margin-right: 2px;">¡</span>GRACIAS!
  </div>
  <div style="font-size: 28px; line-height: 1.1;">🙏</div>
`;

let activeText = 'release';

const setText = (textState) => {
  if (textState === activeText) return;
  activeText = textState;
  textDiv.innerHTML = textState === 'thanks' ? thanksText : releaseText;
};

textDiv.innerHTML = releaseText;
textDiv.style.textAlign = 'center';
textDiv.style.textShadow = '0 0 10px #00ff99, 0 0 20px #00ff99, 0 0 40px #00ff99';
textDiv.style.letterSpacing = '2px';
textDiv.style.textTransform = 'uppercase';
textDiv.style.color = '#00ff99';
textDiv.style.fontSize = '24px';
textDiv.style.fontWeight = 'bold';
textDiv.style.fontFamily = 'sans-serif';

const TextObject = new CSS3DObject(textDiv);
TextObject.position.set(0, 0, 0);
TextObject.scale.set(0.01, 0.01, 0.01);
icosahedronGroup.add(TextObject);

// Drag Tracking
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
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Decay progress back to solid when user isn't dragging
  if (!isDragging && dragProgress > 0) {
    dragProgress = Math.max(0, dragProgress - DECAY_SPEED);
  }

  // Update Text & Opacity
  setText(!isDragging && dragProgress > 0 ? 'thanks' : 'release');
  textDiv.style.opacity = dragProgress.toString();
  TextObject.visible = dragProgress > 0.01;

  solidMaterial.opacity = 1 - dragProgress;
  wireframeMaterial.opacity = Math.max(0.2, dragProgress);
  solidMesh.visible = solidMaterial.opacity > 0.01;

  // Direct Rotations
  solidMesh.rotation.x += 0.03;
  solidMesh.rotation.y += 0.06;

  wireframeMesh.rotation.x += 0.03;
  wireframeMesh.rotation.y += 0.06;

  TextObject.rotation.y += 0.02;

  controls.update();

  renderer.render(scene, camera);
  cssRenderer.render(scene, camera);
}

animate();