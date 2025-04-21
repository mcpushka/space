// script.js
// 1) Импорт ES‑модулей прямо с CDN:
import * as THREE        from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/controls/OrbitControls.js';

// 2) Настраиваем менеджер загрузки, чтобы прятать оверлей и обновлять прогресс‐бар
const overlay = document.getElementById('loader-overlay');
const bar     = document.getElementById('progress-bar');
const manager = new THREE.LoadingManager(
  // onLoad
  () => overlay.style.display = 'none',
  // onProgress
  (url, loaded, total) => {
    bar.style.width = `${ Math.round((loaded/total)*100) }%`;
  }
);

// 3) Сцена, камера, рендерер
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// 4) Контролы
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
camera.position.z = 50;

// 5) Загрузчик текстур через того же менеджера
const loader = new THREE.TextureLoader(manager);
loader.load('textures/galaxy.jpg',
  tex => scene.background = tex,
  undefined,
  err => console.error('bg load error', err)
);

// 6) Tooltip, Raycaster и массивы планет
const tooltip   = document.getElementById('tooltip');
const raycaster = new THREE.Raycaster();
const mouse     = new THREE.Vector2();
const planets   = [];
const names     = [];
const orbits    = [];

// 7) Функция создания планеты
function createPlanet(data) {
  const geo = new THREE.SphereGeometry(data.radius, 16, 16);
  const mat = new THREE.MeshStandardMaterial({
    map: data.texture ? loader.load(data.texture) : null,
    emissive: data.famous ? 0xffffff : 0x000000,
    emissiveIntensity: data.famous ? 0.5 : 0.1,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(...data.position);
  scene.add(mesh);

  planets.push(mesh);
  names.push(data.name);
  orbits.push({
    center: data.orbitCenter,
    radius: data.orbitRadius,
    speed: data.orbitSpeed,
    angle: Math.random()*Math.PI*2
  });
}

// 8) Загружаем JSON
fetch('info.json')
  .then(r => { if(!r.ok) throw r; return r.json(); })
  .then(data => data.forEach(obj => {
    const pos = [Math.random()*50-25,0,Math.random()*50-25];
    createPlanet({
      name: obj.planet_name,
      radius: (obj.physical_characteristics.radius_km||1000)/1000,
      position: pos,
      orbitCenter: [0,0,0],
      orbitRadius: Math.hypot(pos[0], pos[2]),
      orbitSpeed: 0.005 + Math.random()*0.01,
      texture: obj.texture_path ? 'textures/'+obj.texture_path : null,
      famous: ['Earth','Mars','Jupiter','Saturn'].includes(obj.planet_name),
    });
  }))
  .catch(e => console.error('info.json load err', e));

// 9) Свет и Солнце
const light = new THREE.PointLight(0xffffff,2);
light.position.set(0,0,0);
scene.add(light);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshBasicMaterial({color:0xffcc00, transparent:true, opacity:0.8})
);
scene.add(sun);

// 10) Анимация
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  planets.forEach((p,i) => {
    p.rotation.y += 0.005;
    const o = orbits[i];
    o.angle += o.speed;
    p.position.x = o.center[0] + o.radius*Math.cos(o.angle);
    p.position.z = o.center[2] + o.radius*Math.sin(o.angle);
  });

  renderer.render(scene, camera);
}

// 11) Hover‐tooltips
window.addEventListener('mousemove', e => {
  mouse.x = (e.clientX/innerWidth)*2 - 1;
  mouse.y = -(e.clientY/innerHeight)*2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const ints = raycaster.intersectObjects(planets);
  if(ints.length) {
    const idx = planets.indexOf(ints[0].object);
    tooltip.style.left    = e.clientX+5+'px';
    tooltip.style.top     = e.clientY+5+'px';
    tooltip.innerText     = names[idx];
    tooltip.style.display = 'block';
  } else {
    tooltip.style.display = 'none';
  }
});

// Ничего не запускаем до полной загрузки менеджером,
// animate() вызовется автоматически из onLoad у LoadingManager.
