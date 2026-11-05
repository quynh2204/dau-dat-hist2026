/* Bình gốm Bàu Trúc 3D
   Dáng bình dựng theo ảnh gốm Bàu Trúc thật (ảnh: Liftold, CC BY-SA 3.0, Wikimedia Commons):
   bình cổ cao, miệng loe dẹt, ba dải bện thừng trên cổ, dải vòm tim trên thân.
   Có file quét 3D thật (.glb)? Đặt vào assets/ và ghi đường dẫn vào data-model của #vase3d. */
import * as THREE from 'three';

const host = document.getElementById('vase3d');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const H = 1.6;

function webglOk() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }

/* Hoạ tiết khắc chìm vẽ lên canvas: v = chiều cao (0 đáy, 1 miệng), u = vòng quanh bình */
function patternCanvas() {
  const W = 1024, Hc = 2048, cv = document.createElement('canvas');
  cv.width = W; cv.height = Hc;
  const g = cv.getContext('2d');
  const Y = h => Hc * (1 - h / H);
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, Hc);
  for (let i = 0; i < 9000; i++) { g.fillStyle = Math.random() > .5 ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.06)'; g.fillRect(Math.random() * W, Math.random() * Hc, 2, 2); }
  const ink = 'rgba(48,26,14,.62)';
  const ring = (h, w) => { g.fillStyle = ink; g.fillRect(0, Y(h) - w / 2, W, w); };
  const braid = (h, n) => {
    const top = Y(h + 0.016), bot = Y(h - 0.016), mid = (top + bot) / 2, step = W / n;
    g.fillStyle = ink; g.fillRect(0, top - 2, W, 4); g.fillRect(0, bot - 2, W, 4);
    g.strokeStyle = ink; g.lineWidth = 5; g.lineCap = 'round';
    for (let k = 0; k < n; k++) {
      const x = k * step;
      g.beginPath(); g.moveTo(x, top + 4); g.lineTo(x + step * .7, mid); g.lineTo(x, bot - 4); g.stroke();
    }
  };
  const hearts = (hTop, hTip, n) => {
    const y0 = Y(hTop), y1 = Y(hTip), w = W / n;
    g.strokeStyle = ink; g.lineWidth = 5;
    for (let k = 0; k < n; k++) {
      const x0 = k * w;
      for (const inset of [0, 16]) {
        const a = x0 + inset * 1.2, b = x0 + w - inset * 1.2, cx = x0 + w / 2, yt = y1 - inset * 2.2;
        g.beginPath();
        g.moveTo(a, y0);
        g.bezierCurveTo(a, (y0 + yt) / 2 + 40, cx - w * .18, yt - 30, cx, yt);
        g.bezierCurveTo(cx + w * .18, yt - 30, b, (y0 + yt) / 2 + 40, b, y0);
        g.stroke();
      }
      g.fillStyle = 'rgba(48,26,14,.35)';
      for (let d = 0; d < 46; d++) {
        const t = Math.random(), yy = y0 + 14 + t * (y1 - y0 - 70), half = (1 - t) * w * .3;
        g.fillRect(x0 + w / 2 + (Math.random() * 2 - 1) * half, yy, 3, 3);
      }
    }
  };
  braid(1.30, 30); braid(1.175, 30); braid(0.995, 30);
  ring(0.952, 5); ring(0.86, 3); ring(0.845, 3); ring(0.83, 3);
  ring(0.715, 4); ring(0.70, 4);
  hearts(0.70, 0.48, 8);
  ring(0.465, 3);
  return cv;
}

if (host && webglOk()) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.18, 3.75); camera.lookAt(0, 0, 0);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);

  const holder = new THREE.Group();
  scene.add(holder);

  // Biên dáng (bán kính, chiều cao) đo từ ảnh bình thật, từ đáy lên miệng rồi vào trong lòng miệng
  const prof = [[0,0],[0.16,0],[0.2,0.008],[0.26,0.05],[0.32,0.14],[0.36,0.23],[0.384,0.33],[0.392,0.43],[0.386,0.53],[0.362,0.63],[0.322,0.73],[0.27,0.81],[0.222,0.87],[0.19,0.91],[0.176,0.935],[0.178,0.958],[0.16,0.975],[0.128,0.995],[0.116,1.04],[0.108,1.18],[0.104,1.33],[0.108,1.43],[0.116,1.49],[0.15,1.515],[0.196,1.54],[0.205,1.565],[0.198,1.592],[0.17,1.6],[0.095,1.598],[0.09,1.52],[0.088,1.4]];
  const RIM = 27, P = prof.length, SEG = 160;
  const geo = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y - H / 2)), SEG);
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setY(i, (pos.getY(i) + H / 2) / H);
  uv.needsUpdate = true;

  // màu đất nung + vệt khói lửa rơm
  const colors = new Float32Array(pos.count * 3);
  const clay = new THREE.Color('#B9603A'), dark = new THREE.Color('#2E2621'), warm = new THREE.Color('#DB9566'), inner = new THREE.Color('#3A2A22');
  const noise = (x, y, z) => Math.sin(x * 3.1 + Math.sin(y * 5.3)) * Math.cos(z * 2.7 + y * 1.9) + Math.sin(y * 7.0 + x * 1.3) * 0.5;
  const baseColors = [];
  for (let i = 0; i < pos.count; i++) {
    const j = i % P;
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const n = noise(x * 2.4, y * 2, z * 2.4);
    let c = clay.clone().lerp(warm, Math.max(0, n) * 0.35).lerp(dark, Math.max(0, -n - 0.15) * 0.75);
    if (j > RIM) c = inner.clone();
    baseColors.push(c); colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const tex = new THREE.CanvasTexture(patternCanvas());
  tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = THREE.RepeatWrapping;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, map: tex, bumpMap: tex, bumpScale: 1.2, roughness: 0.9, metalness: 0, side: THREE.DoubleSide });
  const vase = new THREE.Mesh(geo, mat);
  holder.add(vase);

  scene.add(new THREE.HemisphereLight('#FFE9D2', '#2A211B', 0.9));
  const key = new THREE.DirectionalLight('#FFD2A6', 2.3); key.position.set(2.5, 3, 2.5); scene.add(key);
  const rim = new THREE.DirectionalLight('#E07A4A', 1.4); rim.position.set(-3, 1, -2); scene.add(rim);
  const fire = new THREE.PointLight('#FF7A30', 0, 3); fire.position.set(0, -0.9, 0.6); scene.add(fire);

  // tuỳ chọn: nạp file quét 3D thật nếu có
  let glbMats = null;
  const modelUrl = host.dataset.model;
  if (modelUrl) {
    import('three/addons/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
      new GLTFLoader().load(modelUrl, g => {
        const obj = g.scene, box = new THREE.Box3().setFromObject(obj), size = new THREE.Vector3(), mid = new THREE.Vector3();
        box.getSize(size); box.getCenter(mid);
        const k = H / size.y; obj.scale.setScalar(k); obj.position.set(-mid.x * k, -mid.y * k, -mid.z * k);
        glbMats = [];
        obj.traverse(o => { if (o.isMesh && o.material && o.material.color) { glbMats.push([o.material, o.material.color.clone()]); } });
        vase.visible = false; holder.add(obj);
      });
    }).catch(() => {});
  }

  const resize = () => { const w = host.clientWidth, h = host.clientHeight || w; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  resize(); addEventListener('resize', resize);

  let handActive = false;
  let targetRot = 0, rot = 0, tilt = 0, dragging = false, lastX = 0, firing = 0;
  host.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; host.setPointerCapture(e.pointerId); });
  host.addEventListener('pointermove', e => { if (dragging) { targetRot += (e.clientX - lastX) * 0.01; lastX = e.clientX; } });
  host.addEventListener('pointerup', () => { dragging = false; });

  // "nung": khói phủ tối dần rồi trở lại
  const colAttr = geo.attributes.color;
  const applyFire = f => {
    for (let i = 0; i < pos.count; i++) {
      const c = baseColors[i].clone().lerp(dark, f * 0.55 * (0.5 + 0.5 * Math.sin(i * 0.37)));
      colAttr.setXYZ(i, c.r, c.g, c.b);
    }
    colAttr.needsUpdate = true; fire.intensity = f * 6;
    if (glbMats) glbMats.forEach(([m, c0]) => m.color.copy(c0).lerp(dark, f * 0.5));
  };

  let visible = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(host);
  const clock = new THREE.Clock();
  const loop = () => {
    const t = clock.getElapsedTime();
    if (!dragging && !handActive && !reduce) targetRot += 0.004;
    rot += (targetRot - rot) * 0.08;
    holder.rotation.y = rot;
    holder.rotation.x = tilt + (reduce ? 0 : Math.sin(t * 0.6) * 0.03);
    holder.position.y = reduce ? 0 : Math.sin(t * 0.9) * 0.025;
    if (firing > 0) { firing = Math.max(0, firing - 0.006); applyFire(Math.sin(Math.min(1, firing) * Math.PI)); }
    if (visible) renderer.render(scene, camera);
    requestAnimationFrame(loop);
  };
  loop();

  /* ---------- Cử chỉ tay (MediaPipe HandLandmarker, xử lý trên máy người xem) ---------- */
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
  host.innerHTML = '<svg viewBox="0 0 200 260" role="img" aria-label="Bình gốm Bàu Trúc cổ cao"><path d="M78,250 C40,236 30,190 36,160 C42,128 66,112 84,104 L88,96 L90,40 L74,34 L74,26 L126,26 L126,34 L110,40 L112,96 L116,104 C134,112 158,128 164,160 C170,190 160,236 122,250 Z" fill="#B5562F" stroke="#F4EFE8" stroke-width="3"/></svg>';
}
