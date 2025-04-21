import * as THREE        from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r150/three.module.min.js';
import { OrbitControls } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r150/examples/jsm/controls/OrbitControls.js';


// Сцена, камера и рендерер
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Управление камерой
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Свет
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Данные по планетам (цвет, радиус, радиус орбиты, скорость)
const planetData = [
  { color: 0xff5555, radius: 2, orbitRadius: 20, speed: 0.02 },
  { color: 0x55ff55, radius: 1.5, orbitRadius: 30, speed: 0.015 },
  { color: 0x5555ff, radius: 1, orbitRadius: 40, speed: 0.01 },
];

// Создание планет
const planets = [];
planetData.forEach((d) => {
  const geometry = new THREE.SphereGeometry(d.radius, 16, 16);
  const material = new THREE.MeshStandardMaterial({ color: d.color });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  planets.push({ mesh, ...d, angle: Math.random() * Math.PI * 2 });
});

// Анимация: вращение и орбита
function animate() {
  requestAnimationFrame(animate);
  planets.forEach((p) => {
    p.angle += p.speed;
    p.mesh.position.x = p.orbitRadius * Math.cos(p.angle);
    p.mesh.position.z = p.orbitRadius * Math.sin(p.angle);
  });
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Поддержка ресайза окна
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
