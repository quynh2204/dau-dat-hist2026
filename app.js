/* Dấu Đất – HIST 2026 · hiệu ứng trang */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';
  if (!hasGsap || reduce) document.documentElement.classList.add('no-motion');

  /* ---------- Nhân vật Mẹ Làng (SVG) ---------- */
  const CHARS = window.DD.CHARS, svgOf = window.DD.svgOf;
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

  /* ---------- Thẻ sưu tầm sau khi đào ---------- */
  const cardEl = document.getElementById('digCard'), cardFrame = document.getElementById('cardFrame');
  const hideCard = () => { if (cardEl) cardEl.hidden = true; };
  const showCard = ch => {
    if (!cardEl) return;
    const max = window.DD.EDITION[ch.id] || 12, sn = 1 + Math.floor(Math.random() * max);
    const path = 'the?m=001&c=' + ch.id + '&s=' + sn;
    document.getElementById('digCardName').textContent = ch.name;
    document.getElementById('digCardNo').textContent = 'Bản ' + window.DD.pad(sn) + '/' + window.DD.pad(max) + ' · ' + window.DD.code('001', ch.id, sn);
    document.getElementById('digCardLink').href = path;
    const qrBox = document.getElementById('digQR');
    if (window.qrcode) { const qr = window.qrcode(0, 'M'); qr.addData(location.origin + '/' + path); qr.make(); qrBox.innerHTML = qr.createSvgTag({ cellSize: 3, margin: 2, scalable: true }); }
    cardEl.hidden = false;
    if (cardFrame) cardFrame.src = path + '&embed=1';
    if (hasGsap && !reduce) gsap.fromTo(cardEl, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out' });
  };

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
      hideCard();
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
      showCard(current);
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

  /* ---------- Google Trends trực tiếp: tải khi tới gần ---------- */
  const tw = document.getElementById('trendsWidget');
  if (tw) {
    const kw = ['labubu', 'blind box', 'gốm bàu trúc'];
    const draw = () => {
      if (!window.trends || !window.trends.embed) return;
      tw.innerHTML = '';
      window.trends.embed.renderExploreWidgetTo(tw, 'TIMESERIES', { comparisonItem: kw.map(k => ({ keyword: k, geo: 'VN', time: 'today 12-m' })), category: 0, property: '' }, { exploreQuery: 'geo=VN&q=' + kw.map(encodeURIComponent).join(',') + '&date=today%2012-m', guestPath: 'https://trends.google.com:443/trends/embed/' });
    };
    const load = () => { const sc = document.createElement('script'); sc.src = 'https://ssl.gstatic.com/trends_nrtr/4630_RC01/embed_loader.js'; sc.onload = draw; document.body.append(sc); };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { load(); io.disconnect(); } }, { rootMargin: '500px' });
      io.observe(tw);
    } else load();
  }
})();
