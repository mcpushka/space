// script.js — без import’ов, всё через глобальный THREE
window.addEventListener('DOMContentLoaded', () => {
  // 1) Сцена и камера
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // 2) Рендерер
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(renderer.domElement);

  // 3) Орбитальные контролы
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // 4) Простая сфера (без текстур)
  const geometry = new THREE.SphereGeometry(1, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0x3399ff });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // 5) Анимация
  function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // 6) Поддержка ресайза окна
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
