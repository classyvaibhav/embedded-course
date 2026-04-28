// 3D Hero Scene - Floating Circuit Board with Particles
(function() {
  'use strict';
  
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / 500, 0.1, 1000);
  camera.position.set(0, 2, 6);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, 500);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  const ambient = new THREE.AmbientLight(0x4466ff, 0.4);
  scene.add(ambient);
  const point1 = new THREE.PointLight(0x0ea5e9, 2, 20);
  point1.position.set(3, 3, 3);
  scene.add(point1);
  const point2 = new THREE.PointLight(0x8b5cf6, 1.5, 20);
  point2.position.set(-3, 2, -2);
  scene.add(point2);
  const point3 = new THREE.PointLight(0x10b981, 1.2, 20);
  point3.position.set(0, -2, 4);
  scene.add(point3);

  // PCB Board
  const boardGeo = new THREE.BoxGeometry(4, 0.12, 3);
  const boardMat = new THREE.MeshPhongMaterial({ color: 0x065f46, transparent: true, opacity: 0.85, shininess: 80 });
  const board = new THREE.Mesh(boardGeo, boardMat);
  scene.add(board);

  // Circuit traces on board
  const traceMat = new THREE.MeshPhongMaterial({ color: 0xfbbf24, emissive: 0x92400e, emissiveIntensity: 0.3 });
  for (let i = 0; i < 8; i++) {
    const w = 0.03 + Math.random() * 0.02;
    const l = 0.5 + Math.random() * 2.5;
    const traceGeo = new THREE.BoxGeometry(l, 0.02, w);
    const trace = new THREE.Mesh(traceGeo, traceMat);
    trace.position.set((Math.random() - 0.5) * 3, 0.07, (Math.random() - 0.5) * 2.2);
    trace.rotation.y = Math.random() > 0.5 ? 0 : Math.PI / 2;
    board.add(trace);
  }

  // Chip (IC)
  const chipGeo = new THREE.BoxGeometry(0.8, 0.15, 0.6);
  const chipMat = new THREE.MeshPhongMaterial({ color: 0x1e293b, shininess: 120 });
  const chip = new THREE.Mesh(chipGeo, chipMat);
  chip.position.set(-0.5, 0.14, 0);
  board.add(chip);
  // Chip label
  const labelGeo = new THREE.PlaneGeometry(0.5, 0.15);
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 128; labelCanvas.height = 40;
  const ctx = labelCanvas.getContext('2d');
  ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 22px monospace';
  ctx.fillText('ESP32', 10, 28);
  const labelTex = new THREE.CanvasTexture(labelCanvas);
  const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true });
  const label = new THREE.Mesh(labelGeo, labelMat);
  label.rotation.x = -Math.PI / 2;
  label.position.set(-0.5, 0.225, 0);
  board.add(label);

  // IC Pins
  for (let i = 0; i < 8; i++) {
    const pinGeo = new THREE.BoxGeometry(0.12, 0.02, 0.04);
    const pinMat = new THREE.MeshPhongMaterial({ color: 0x9ca3af });
    const pin1 = new THREE.Mesh(pinGeo, pinMat);
    pin1.position.set(-0.5 - 0.35 + i * 0.1, 0.14, 0.32);
    board.add(pin1);
    const pin2 = pin1.clone();
    pin2.position.z = -0.32;
    board.add(pin2);
  }

  // Components on board
  function addCapacitor(x, z, color) {
    const geo = new THREE.CylinderGeometry(0.1, 0.1, 0.25, 12);
    const mat = new THREE.MeshPhongMaterial({ color, shininess: 60 });
    const cap = new THREE.Mesh(geo, mat);
    cap.position.set(x, 0.19, z);
    board.add(cap);
  }
  addCapacitor(1.2, 0.5, 0x3b82f6);
  addCapacitor(1.2, -0.5, 0x1d4ed8);
  addCapacitor(-1.5, 0.8, 0x6366f1);

  // Resistors
  function addResistor(x, z) {
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8),
      new THREE.MeshPhongMaterial({ color: 0xd4a373 })
    );
    body.rotation.z = Math.PI / 2;
    body.position.set(x, 0.12, z);
    board.add(body);
    // Color bands
    const colors = [0xef4444, 0x8b5cf6, 0xf59e0b, 0xfbbf24];
    colors.forEach((c, i) => {
      const band = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.02, 8),
        new THREE.MeshPhongMaterial({ color: c })
      );
      band.rotation.z = Math.PI / 2;
      band.position.set(x - 0.1 + i * 0.06, 0.12, z);
      board.add(band);
    });
  }
  addResistor(0.6, -0.8);
  addResistor(0.6, 0.8);

  // LED
  const ledGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const ledMat = new THREE.MeshPhongMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.8, transparent: true, opacity: 0.9 });
  const led = new THREE.Mesh(ledGeo, ledMat);
  led.position.set(1.5, 0.15, 0);
  board.add(led);

  // Floating particles
  const particleCount = 300;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const speeds = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    const palette = [[0.05, 0.65, 0.91], [0.55, 0.36, 0.96], [0.06, 0.73, 0.51]];
    const c = palette[Math.floor(Math.random() * 3)];
    colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2];
    speeds[i] = 0.2 + Math.random() * 0.8;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const particleMat = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.7 });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Connection lines (data flow visualization)
  const lineMat = new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.3 });
  for (let i = 0; i < 5; i++) {
    const points = [];
    const startX = (Math.random() - 0.5) * 8;
    const startY = (Math.random() - 0.5) * 6;
    for (let j = 0; j < 6; j++) {
      points.push(new THREE.Vector3(startX + j * 0.8, startY + Math.sin(j) * 0.3, -2 - Math.random() * 3));
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    scene.add(new THREE.Line(lineGeo, lineMat));
  }

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Board gentle float
    board.rotation.x = Math.sin(time * 0.5) * 0.08 + mouseY * 0.1;
    board.rotation.y = Math.sin(time * 0.3) * 0.15 + mouseX * 0.15;
    board.position.y = Math.sin(time * 0.7) * 0.15;

    // LED pulse
    ledMat.emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.5;

    // Particle animation
    const pos = particleGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 1] += Math.sin(time + i) * 0.002 * speeds[i];
      pos[i * 3] += Math.cos(time * 0.5 + i) * 0.001 * speeds[i];
    }
    particleGeo.attributes.position.needsUpdate = true;
    particles.rotation.y = time * 0.02;

    // Light orbit
    point1.position.x = Math.cos(time) * 4;
    point1.position.z = Math.sin(time) * 4;
    point2.position.x = Math.cos(time * 0.7 + 2) * 3;

    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (2 - mouseY * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, 500);
    camera.aspect = window.innerWidth / 500;
    camera.updateProjectionMatrix();
  });
})();
