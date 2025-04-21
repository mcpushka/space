// script.js
window.addEventListener('DOMContentLoaded', () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 300;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('scene').appendChild(renderer.domElement);

  
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  scene.add(new THREE.AmbientLight(0x333333));
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(0, 0, 0);
  scene.add(light);

  // Цвета по названиям планет
  const colorMap = {
    Mercury: 0xaaaaaa,
    Venus: 0xffcc66,
    Earth: 0x3399ff,
    Mars: 0xcc3300,
    Jupiter: 0xff9933,
    Saturn: 0xffff99,
    Uranus: 0x66ffff,
    Neptune: 0x3366ff,
    Pluto: 0xbbbbcc,
    Ceres: 0x999999,
    "Hale-Bopp": 0xffffff
  };

  fetch('info.json')
    .then(res => res.json())
    .then(data => {
      const planets = data.map((planet, i) => {
        const radius = (planet.physical_characteristics?.radius_km || 1000) / 1000;
        const color = colorMap[planet.planet_name] || 0xffffff;
        const orbit = 30 + i * 20;
        const speed = 0.003 + i * 0.001;
        const geometry = new THREE.SphereGeometry(radius, 16, 16);
        const material = new THREE.MeshStandardMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        return { mesh, angle: Math.random() * Math.PI * 2, orbit, speed };
      });

      function animate() {
        requestAnimationFrame(animate);
        planets.forEach(p => {
          p.angle += p.speed;
          p.mesh.position.x = p.orbit * Math.cos(p.angle);
          p.mesh.position.z = p.orbit * Math.sin(p.angle);
        });
        controls.update();
        renderer.render(scene, camera);
      }

      animate();
    });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
