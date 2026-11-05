/* Dấu Đất – HIST 2026 · hiệu ứng trang */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';
  if (!hasGsap || reduce) document.documentElement.classList.add('no-motion');

  /* ---------- Nhân vật Mẹ Làng (SVG) ---------- */
  const body = (cx, fill, stroke) => `<circle cx="${cx}" cy="62" r="10" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><path d="M${cx-16},140 C${cx-14},100 ${cx-8},78 ${cx},76 C${cx+8},78 ${cx+14},100 ${cx+16},140 Z" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
  const C = '#B5562F', S = '#2A211B';
  const CHARS = [
    { id:'ganh', name:'Gánh đất', note:'Lấy đất ven sông Quao', svg:`<line x1="14" y1="80" x2="106" y2="80" stroke="${S}" stroke-width="2.5"/><line x1="20" y1="80" x2="20" y2="104" stroke="${S}"/><line x1="100" y1="80" x2="100" y2="104" stroke="${S}"/><path d="M8,104 L32,104 L28,122 L12,122 Z" fill="#8F6A52" stroke="${S}" stroke-width="1.5"/><path d="M88,104 L112,104 L108,122 L92,122 Z" fill="#8F6A52" stroke="${S}" stroke-width="1.5"/>${body(60,C,S)}` },
    { id:'nan', name:'Nặn đi vòng', note:'Không bàn xoay', svg:`${body(42,C,S)}<rect x="76" y="128" width="34" height="12" fill="#D2B8A2" stroke="${S}" stroke-width="1.5"/><path d="M82,128 C76,116 80,102 93,100 C106,102 110,116 104,128 Z" fill="#E7D3C2" stroke="${S}" stroke-width="1.5"/><path d="M70,96 C80,84 108,84 116,98" fill="none" stroke="#D9A441" stroke-width="1.5" stroke-dasharray="4 3"/>` },
    { id:'vuot', name:'Vuốt vỏ sò', note:'Làm láng mặt gốm', svg:`${body(42,C,S)}<path d="M84,140 C76,126 78,108 94,104 C110,108 112,126 104,140 Z" fill="#E7D3C2" stroke="${S}" stroke-width="1.5"/><path d="M66,100 C66,88 80,86 82,98 Z" fill="#F4EFE8" stroke="${S}" stroke-width="1.5"/>` },
    { id:'doi', name:'Đội gốm', note:'Mang gốm đi phơi', svg:`<path d="M52,52 C42,46 42,28 54,22 L56,14 L64,14 L66,22 C78,28 78,46 68,52 Z" fill="#3B3330" stroke="#D9A441" stroke-width="1.5"/>${body(60,C,S)}` },
    { id:'nung', name:'Nung rơm', note:'Nung lộ thiên', svg:`${body(40,C,S)}<path d="M66,140 C70,120 106,120 112,140 Z" fill="#C9A86A" stroke="${S}" stroke-width="1.5"/><path d="M78,118 C74,108 84,104 80,94 M90,116 C86,104 98,98 92,86 M102,118 C98,108 108,104 104,96" fill="none" stroke="#E07A4A" stroke-width="2"/>` },
    { id:'day', name:'Dạy con', note:'Nghề truyền cho con gái', svg:`${body(46,C,S)}<circle cx="88" cy="96" r="6" fill="#8F6A52" stroke="${S}" stroke-width="1.5"/><path d="M78,140 C79,118 84,104 88,103 C92,104 97,118 98,140 Z" fill="#8F6A52" stroke="${S}" stroke-width="1.5"/><path d="M58,96 C66,92 74,100 80,112" fill="none" stroke="${S}" stroke-width="1.5"/>` },
    { id:'hiem', rare:true, name:'Hiếm: Mẹ và con gái', note:'Cùng nâng một chiếc lu', svg:`<circle cx="36" cy="62" r="10" fill="#3B3330" stroke="#D9A441" stroke-width="1.5"/><path d="M20,140 C22,100 28,78 36,76 C44,78 50,100 52,140 Z" fill="#3B3330" stroke="#D9A441" stroke-width="1.5"/><circle cx="90" cy="88" r="7" fill="#3B3330" stroke="#D9A441" stroke-width="1.5"/><path d="M78,140 C79,116 85,98 90,97 C95,98 101,116 102,140 Z" fill="#3B3330" stroke="#D9A441" stroke-width="1.5"/><path d="M56,116 C50,106 54,94 64,92 L66,86 L72,86 L74,92 C84,94 88,106 82,116 Z" fill="#B5562F" stroke="#D9A441" stroke-width="1.5"/>` }
  ];
  const svgOf = (c, label) => `<svg viewBox="0 0 120 150" role="img" aria-label="${label || c.name}">${c.svg}</svg>`;
  const charsEl = document.getElementById('chars');
  if (charsEl) {
    charsEl.innerHTML = CHARS.map((c,i) => `<article class="char reveal${c.rare?' rare':''}">${svgOf(c)}<h3>${c.rare?'':(i+1)+'. '}${c.name}</h3><p>${c.note}</p></article>`).join('');
  }

  /* ---------- Reveal + counters + bars ---------- */
  if (hasGsap && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero h1 .line', { yPercent: 110, opacity: 0, duration: 1.1, stagger: .14, ease: 'power4.out', delay: .2 });
    gsap.from('.hero .lead, .hero .cta, .hero .eyebrow', { y: 24, opacity: 0, duration: .9, stagger: .1, delay: .7 });
    document.querySelectorAll('.reveal').forEach(el => {
      gsap.to(el, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    gsap.utils.toArray('.chars .char').forEach((el, i) => {
      gsap.fromTo(el, { y: 60, rotate: i % 2 ? 4 : -4 }, { y: 0, rotate: 0, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '#chars', start: 'top 85%' }, delay: i * .06 });
    });
    gsap.utils.toArray('.tier').forEach((el, i) => {
      gsap.fromTo(el, { y: 80 }, { y: 0, ease: 'none', scrollTrigger: { trigger: '.tiers', start: 'top bottom', end: 'center center', scrub: true }, delay: i * .1 });
    });
  }
  const fmt = n => Math.round(n).toLocaleString('vi-VN');
  document.querySelectorAll('[data-count]').forEach(el => {
    const to = +el.dataset.count, from = +(el.dataset.from || 0), suf = el.dataset.suffix || '';
    const run = () => {
      if (!hasGsap || reduce) { el.textContent = fmt(to) + suf; return; }
      const o = { v: from };
      gsap.to(o, { v: to, duration: 2, ease: 'power2.out', onUpdate: () => el.textContent = fmt(o.v) + suf });
    };
    if (hasGsap && !reduce) ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: run }); else run();
  });
  document.querySelectorAll('.track i').forEach(el => {
    const w = Math.max(1.2, +el.dataset.w) + '%';
    if (hasGsap && !reduce) gsap.to(el, { width: w, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
    else el.style.width = w;
  });

  /* ---------- Khói nền hero ---------- */
  const smoke = document.getElementById('smoke');
  if (smoke && !reduce) {
    const ctx = smoke.getContext('2d'); let W, H, parts = [];
    const size = () => { W = smoke.width = smoke.offsetWidth; H = smoke.height = smoke.offsetHeight; };
    size(); addEventListener('resize', size);
    for (let i = 0; i < 40; i++) parts.push({ x: Math.random(), y: Math.random(), r: 60 + Math.random() * 140, s: .0003 + Math.random() * .0006, a: Math.random() * 6.28 });
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.y -= p.s; p.a += .002; if (p.y < -.2) { p.y = 1.2; p.x = Math.random(); }
        const x = (p.x + Math.sin(p.a) * .03) * W, y = p.y * H;
        const g = ctx.createRadialGradient(x, y, 0, x, y, p.r);
        g.addColorStop(0, 'rgba(201,168,130,.10)'); g.addColorStop(1, 'rgba(201,168,130,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, p.r, 0, 6.28); ctx.fill();
      }
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* ---------- Hộp Đào Đất ---------- */
  const canvas = document.getElementById('digCanvas'), reveal = document.getElementById('digReveal'), result = document.getElementById('digResult');
  if (canvas) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let done = false, moves = 0, current;
    const pick = () => {
      const r = Math.random();
      if (r < 1 / 12) return CHARS[6];
      return CHARS[Math.floor(Math.random() * 6)];
    };
    const fillSand = () => {
      const rect = canvas.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
      canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      g.addColorStop(0, '#CDAE74'); g.addColorStop(1, '#B8955A');
      ctx.fillStyle = g; ctx.fillRect(0, 0, rect.width, rect.height);
      for (let i = 0; i < 2600; i++) {
        ctx.fillStyle = Math.random() > .5 ? 'rgba(120,90,50,.35)' : 'rgba(240,220,180,.35)';
        ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 1.6, 1.6);
      }
      ctx.fillStyle = 'rgba(42,33,27,.55)'; ctx.font = '600 15px Be Vietnam Pro, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Rê chuột hoặc vuốt để đào', rect.width / 2, rect.height / 2);
    };
    const reset = () => {
      done = false; moves = 0; current = pick();
      reveal.innerHTML = svgOf(current, 'Nhân vật vừa đào được') + `<p>${current.name}</p>`;
      reveal.style.visibility = 'hidden';
      result.textContent = 'Khối cát đang chờ bạn.';
      fillSand();
      requestAnimationFrame(() => { reveal.style.visibility = 'visible'; });
    };
    const cleared = () => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data; let c = 0, t = 0;
      for (let i = 3; i < d.length; i += 64) { t++; if (d[i] < 40) c++; }
      return c / t;
    };
    const dig = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      const g = ctx.createRadialGradient(x, y, 0, x, y, 28);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 28, 0, 6.28); ctx.fill();
      if (++moves % 12 === 0 && !done && cleared() > .5) finish();
    };
    const finish = () => {
      done = true;
      if (hasGsap && !reduce) gsap.to(canvas, { opacity: 0, duration: .6, onComplete: () => { canvas.style.pointerEvents = 'none'; } });
      else { canvas.style.opacity = 0; canvas.style.pointerEvents = 'none'; }
      result.textContent = current.rare ? 'Bạn đào được nhân vật HIẾM: Mẹ và con gái!' : `Bạn đào được: ${current.name}. Sưu tầm đủ 6 mẹ để hoàn thành bộ.`;
      if (hasGsap && !reduce) gsap.fromTo(reveal.querySelector('svg'), { scale: .6, rotate: -8 }, { scale: 1, rotate: 0, duration: .9, ease: 'elastic.out(1,.5)' });
    };
    let down = false;
    const pos = e => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    canvas.addEventListener('pointerdown', e => { down = true; canvas.setPointerCapture(e.pointerId); dig(...pos(e)); });
    canvas.addEventListener('pointermove', e => { if (down || e.pointerType === 'mouse') dig(...pos(e)); });
    canvas.addEventListener('pointerup', () => { down = false; });
    document.getElementById('digAgain').addEventListener('click', () => { canvas.style.opacity = 1; canvas.style.pointerEvents = 'auto'; reset(); });
    addEventListener('resize', () => { if (!done) fillSand(); });
    reset();
  }

  /* ---------- Lời gửi mẹ (ghi âm cục bộ) ---------- */
  const recBtn = document.getElementById('recBtn'), recAudio = document.getElementById('recAudio'), recStatus = document.getElementById('recStatus');
  if (recBtn) {
    let rec, chunks = [], timer;
    recBtn.addEventListener('click', async () => {
      if (rec && rec.state === 'recording') { rec.stop(); return; }
      if (!navigator.mediaDevices || !window.MediaRecorder) { recStatus.textContent = 'Trình duyệt này chưa hỗ trợ ghi âm.'; return; }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        rec = new MediaRecorder(stream); chunks = [];
        rec.ondataavailable = e => chunks.push(e.data);
        rec.onstop = () => {
          clearTimeout(timer); stream.getTracks().forEach(t => t.stop());
          recAudio.src = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType }));
          recAudio.hidden = false; recBtn.textContent = 'Ghi lại lời khác';
          recStatus.textContent = 'Người nhận quét thẻ sẽ nghe đúng lời này. (Bản demo không tải lên máy chủ.)';
        };
        rec.start(); recBtn.textContent = 'Dừng ghi';
        recStatus.textContent = 'Đang ghi… tối đa 60 giây.';
        timer = setTimeout(() => rec.state === 'recording' && rec.stop(), 60000);
      } catch (e) { recStatus.textContent = 'Chưa có quyền dùng micro.'; }
    });
  }

  /* ---------- Vòng hiệu ứng ---------- */
  const nodes = ['Thấy nhân vật', 'Mở hộp, đăng video', 'Sưu tầm đủ bộ', 'Tặng kèm lời nhắn', 'Gặp lại ở điểm đối tác'];
  const g = document.getElementById('flyNodes');
  if (g) {
    const NS = 'http://www.w3.org/2000/svg';
    nodes.forEach((t, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / nodes.length;
      const x = 300 + 200 * Math.cos(a), y = 300 + 200 * Math.sin(a);
      const grp = document.createElementNS(NS, 'g'); grp.setAttribute('class', 'fw-node');
      const w = t.length * 8.6 + 28;
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', x - w / 2); r.setAttribute('y', y - 20); r.setAttribute('width', w); r.setAttribute('height', 40); r.setAttribute('rx', 20);
      const tx = document.createElementNS(NS, 'text');
      tx.setAttribute('x', x); tx.setAttribute('y', y + 5); tx.setAttribute('text-anchor', 'middle'); tx.textContent = t;
      grp.append(r, tx); g.append(grp);
    });
    if (hasGsap && !reduce) gsap.to('#flyRing', { strokeDashoffset: -280, duration: 8, repeat: -1, ease: 'none' });
  }

  /* ---------- Biểu đồ vốn ---------- */
  const funds = [
    ['Sản phẩm và IP', 30, '#B5562F', 'Thiết kế series, mẫu thử với nghệ nhân, bao bì Hộp Đào Đất, đăng ký nhãn hiệu và kiểu dáng'],
    ['Vốn lưu động mẻ nung', 25, '#8F6A52', 'Tạm ứng nguyên liệu, tồn an toàn cho dòng có sẵn, bao bì chống vỡ'],
    ['Tăng trưởng', 25, '#D9A441', 'Nội dung TikTok, người sáng tạo nội dung, pop-up trường đại học và sự kiện, mở điểm collab'],
    ['Vận hành tại làng', 12, '#6E7F4E', 'Điều phối viên tại Bàu Trúc, kiểm hàng, đóng gói'],
    ['Công nghệ và pháp lý', 8, '#3B3330', 'Trang câu chuyện số, pháp nhân, kế toán']
  ];
  const donut = document.getElementById('donut'), legend = document.getElementById('legend');
  if (donut) {
    const NS = 'http://www.w3.org/2000/svg', R = 80, L = 2 * Math.PI * R; let off = 0;
    funds.forEach(([n, p, c]) => {
      const ci = document.createElementNS(NS, 'circle');
      ci.setAttribute('cx', 100); ci.setAttribute('cy', 100); ci.setAttribute('r', R);
      ci.setAttribute('fill', 'none'); ci.setAttribute('stroke', c); ci.setAttribute('stroke-width', 30);
      const len = L * p / 100 - 2;
      ci.setAttribute('stroke-dasharray', `${len} ${L}`); ci.setAttribute('stroke-dashoffset', -off);
      off += L * p / 100; donut.append(ci);
    });
    legend.innerHTML = funds.map(([n, p, c, d]) => `<li><i style="background:${c}"></i><b>${p}%</b><span><strong>${n}</strong> – ${d}</span></li>`).join('');
  }

  /* ---------- TikTok embed: tải khi tới gần ---------- */
  const tt = document.getElementById('tiktoks');
  if (tt) {
    const load = () => { if (document.getElementById('tt-js')) return; const s = document.createElement('script'); s.id = 'tt-js'; s.async = true; s.src = 'https://www.tiktok.com/embed.js'; document.body.append(s); };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { load(); io.disconnect(); } }, { rootMargin: '600px' });
      io.observe(tt);
    } else load();
  }
})();
