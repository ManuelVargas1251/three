import * as THREE from 'three';

export function createStarfield(randomDirection) {
  const group = new THREE.Group();
  const positions = [];
  const colors = [];
  const palette = [new THREE.Color(0xb9e8ff), new THREE.Color(0xfff5df), new THREE.Color(0xffda92)];
  for (let i = 0; i < 6000; i++) {
    const position = randomDirection().multiplyScalar(400 + Math.random() * 400);
    positions.push(position.x, position.y, position.z);
    const color = palette[Math.floor(Math.random() * palette.length)];
    colors.push(color.r, color.g, color.b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 2,
    sizeAttenuation: false,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const stars = new THREE.Points(geometry, material);
  stars.renderOrder = -2;
  group.add(stars);
  return group;
}
