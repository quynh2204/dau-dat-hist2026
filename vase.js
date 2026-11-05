/* Lu gốm 3D: Three.js LatheGeometry + màu khói nung lộ thiên; xoay bằng chuột/cảm ứng hoặc cử chỉ tay (MediaPipe) */
import * as THREE from 'three';

const host = document.getElementById('vase3d');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function webglOk() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }

if (host && webglOk()) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.55, 4.2);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);

  // Dáng lu Chăm: bụng tròn, cổ ngắn, miệng loe nhẹ
  const prof = [[0.0,0],[0.36,0],[0.5,0.04],[0.6,0.18],[0.64,0.38],[0.6,0.6],[0.46,0.8],[0.27,0.95],[0.22,1.03],[0.25,1.12],[0.3,1.18],[0.27,1.19],[0.2,1.1],[0.17,1.0]];
  const pts = prof.map(([r, y]) => new THREE.Vector2(r, y - 0.6));
  const geo = new THREE.LatheGeometry(pts, 160);

  // màu đất + vệt khói (nhiễu đơn giản)
  const pos = geo.attributes.position, colors = new Float32Array(pos.count * 3);
  const clay = new THREE.Color('#B5562F'), dark = new THREE.Color('#2E2621'), warm = new THREE.Color('#D58A5A');
  const noise = (x, y, z) => Math.sin(x * 3.1 + Math.sin(y * 5.3)) * Math.cos(z * 2.7 + y * 1.9) + Math.sin(y * 7.0 + x * 1.3) * 0.5;
  const baseColors = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const n = noise(x * 2, y * 2, z * 2);
    const c = clay.clone().lerp(warm, Math.max(0, n) * 0.35).lerp(dark, Math.max(0, -n - 0.1) * 0.8);
    baseColors.push(c);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0.0, side: THREE.DoubleSide });
  const vase = new THREE.Mesh(geo, mat);
  scene.add(vase);

  // vạch hoa văn quanh vai (3 vạch = thế hệ Bà)
  for (let k = 0; k < 3; k++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.585 - k * 0.025, 0.006, 8, 160), new THREE.MeshStandardMaterial({ color: '#2A211B', roughness: 1 }));
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.05 + k * 0.045; vase.add(ring);
  }

  scene.add(new THREE.HemisphereLight('#FFE9D2', '#2A211B', 0.9));
  const key = new THREE.DirectionalLight('#FFD2A6', 2.2); key.position.set(2.5, 3, 2.5); scene.add(key);
  const rim = new THREE.DirectionalLight('#E07A4A', 1.4); rim.position.set(-3, 1, -2); scene.add(rim);
  const fire = new THREE.PointLight('#FF7A30', 0, 3); fire.position.set(0, -0.9, 0.6); scene.add(fire);

  const resize = () => { const w = host.clientWidth, h = host.clientHeight || w; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  resize(); addEventListener('resize', resize);

  let handActive = false;
  let targetRot = 0, rot = 0, tilt = 0, dragging = false, lastX = 0, firing = 0;
  host.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; host.setPointerCapture(e.pointerId); });
  host.addEventListener('pointermove', e => { if (dragging) { targetRot += (e.clientX - lastX) * 0.01; lastX = e.clientX; } });
  host.addEventListener('pointerup', () => { dragging = false; });

  // "nung": tối dần màu khói rồi trở lại
  const colAttr = geo.attributes.color;
  const applyFire = (f) => {
    for (let i = 0; i < pos.count; i++) {
      const c = baseColors[i].clone().lerp(dark, f * 0.55 * (0.5 + 0.5 * Math.sin(i * 0.37)));
      colAttr.setXYZ(i, c.r, c.g, c.b);
    }
    colAttr.needsUpdate = true; fire.intensity = f * 6;
  };

  let visible = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(host);
  const clock = new THREE.Clock();
  const loop = () => {
    const t = clock.getElapsedTime();
    if (!dragging && !handActive && !reduce) targetRot += 0.004;
    rot += (targetRot - rot) * 0.08;
    vase.rotation.y = rot;
    vase.rotation.x = tilt + (reduce ? 0 : Math.sin(t * 0.6) * 0.03);
    vase.position.y = reduce ? 0 : Math.sin(t * 0.9) * 0.03;
    if (firing > 0) { firing = Math.max(0, firing - 0.006); applyFire(Math.sin(Math.min(1, firing) * Math.PI)); }
    if (visible) renderer.render(scene, camera);
    requestAnimationFrame(loop);
  };
  loop();

  /* ---------- Cử chỉ tay (giống cách HIST dùng MediaPipe HandLandmarker) ---------- */
  const btn = document.getElementById('gestureBtn'), status = document.getElementById('gestureStatus'), video = document.getElementById('cam');
  btn?.addEventListener('click', async () => {
    if (handActive) return;
    status.textContent = 'Đang tải mô hình nhận diện bàn tay…';
    try {
      const vision = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs');
      const fileset = await vision.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
      const lm = await vision.HandLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task', delegate: 'GPU' },
        runningMode: 'VIDEO', numHands: 1
      });
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' } });
      video.srcObject = stream; await video.play(); video.classList.add('on');
      handActive = true; btn.textContent = 'Đang nhận diện cử chỉ';
      status.textContent = 'Xoè tay và di chuyển để xoay bình. Nắm tay để "nung" bằng lửa rơm.';
      let lastTs = -1, wasFist = false;
      const step = () => {
        if (video.readyState >= 2 && video.currentTime !== lastTs) {
          lastTs = video.currentTime;
          const r = lm.detectForVideo(video, performance.now());
          const hand = r.landmarks && r.landmarks[0];
          if (hand) {
            const wrist = hand[0], tips = [8, 12, 16, 20].map(i => hand[i]), mcp = hand[9];
            const palm = Math.hypot(mcp.x - wrist.x, mcp.y - wrist.y);
            const ext = tips.reduce((s, p) => s + Math.hypot(p.x - wrist.x, p.y - wrist.y), 0) / 4;
            const fist = ext < palm * 1.25;
            if (!fist) { targetRot = (0.5 - hand[9].x) * 8; tilt = (hand[9].y - 0.5) * 0.6; }
            if (fist && !wasFist) firing = 1;
            wasFist = fist;
          }
        }
        requestAnimationFrame(step);
      };
      step();
    } catch (e) {
      status.textContent = 'Không bật được camera hoặc mô hình. Bạn vẫn có thể kéo để xoay bình.';
    }
  });
} else if (host) {
  host.innerHTML = '<svg viewBox="0 0 200 220" role="img" aria-label="Lu gốm Bàu Trúc"><path d="M70,210 C30,190 28,120 60,90 L66,40 L134,40 L140,90 C172,120 170,190 130,210 Z" fill="#B5562F" stroke="#F4EFE8" stroke-width="3"/></svg>';
}
