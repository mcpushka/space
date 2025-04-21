// script.js — без import’ов, всё через глобальный THREE
window.addEventListener('DOMContentLoaded', () => {
  // --- Сцена, камера, рендерер ---
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 150;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('scene').appendChild(renderer.domElement);

  // --- Контролы ---
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // --- Свет ---
  scene.add(new THREE.AmbientLight(0x222222));
  const point = new THREE.PointLight(0xffffff, 1);
  point.position.set(0, 0, 0);
  scene.add(point);

  // --- Данные по планетам ---
  const planetData = [
    { name: 'Mercury', color: 0x909090, radius: 2, orbit: 30, speed: 0.02 },
    { name: 'Venus',   color: 0xd4af37, radius: 4, orbit: 45, speed: 0.015 },
    { name: 'Earth',   color: 0x2266ff, radius: 4.2, orbit: 60, speed: 0.012 },
    { name: 'Mars',    color: 0xff4411, radius: 3.5, orbit: 75, speed: 0.010 },
    { name: 'Jupiter', color: 0xffaa33, radius: 10, orbit: 95, speed: 0.008 },
    { name: 'Saturn',  color: 0xffdd88, radius: 8, orbit: 115, speed: 0.006 },
    { name: 'Uranus',  color: 0x88eeff, radius: 6, orbit: 135, speed: 0.004 },
    { name: 'Neptune', color: 0x3366ff, radius: 6, orbit: 155, speed: 0.003 }
  ];

  // --- Создаем меши планет ---
  const planets = planetData.map(pd => {
    const geo = new THREE.SphereGeometry(pd.radius, 16, 16);
    const mat = new THREE.MeshStandardMaterial({ color: pd.color });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    return { ...pd, mesh, angle: Math.random() * Math.PI * 2 };
  });

  // --- Анимация орбит и вращения ---
  function animate() {
    requestAnimationFrame(animate);
    planets.forEach(p => {
      p.angle += p.speed;
      p.mesh.position.x = p.orbit * Math.cos(p.angle);
      p.mesh.position.z = p.orbit * Math.sin(p.angle);
      p.mesh.rotation.y += 0.005;
    });
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // --- Ресайз ---
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
