// script.js (UMD‑style, без import)
window.addEventListener('DOMContentLoaded', () => {
  // 1) Сцена, камера, рендерер
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 2) Контролы
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  // 3) Свет
  const ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);
  const point = new THREE.PointLight(0xffffff, 1);
  point.position.set(5, 5, 5);
  scene.add(point);

  // 4) Простая «планета»
  const geo = new THREE.SphereGeometry(1, 16, 16);
  const mat = new THREE.MeshStandardMaterial({ color: 0x3399ff });
  const planet = new THREE.Mesh(geo, mat);
  scene.add(planet);

  // 5) Анимация
  function animate() {
    requestAnimationFrame(animate);
    planet.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // 6) Поддержка ресайза
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
