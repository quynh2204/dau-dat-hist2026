/* Dấu Đất · nhân vật Mẹ Làng dùng chung cho trang chủ và trang thẻ */
(function(){
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

  /* Số bản mỗi nhân vật trong một mẻ */
  const EDITION = { ganh: 12, nan: 12, vuot: 12, doi: 12, nung: 12, day: 12, hiem: 3 };
  const NAME_EN = { ganh: 'Carrying the clay', nan: 'Shaping by walking around', vuot: 'Polishing with a shell', doi: 'Carrying pots on the head', nung: 'Open-air straw firing', day: 'Teaching her daughter', hiem: 'Rare: Mother and daughter' };
  const pad = n => String(n).padStart(2, '0');
  const code = (m, c, s) => 'DD-' + m + '-' + c.toUpperCase() + '-' + pad(s);
  const hash = str => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = seed => { let a = seed; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  /* Vân khói minh hoạ: mỗi mã cho ra một hình khác nhau */
  const smoke = key => {
    const r = rng(hash(key)), id = 'k' + hash(key).toString(36);
    let blobs = '';
    const n = 6 + Math.floor(r() * 5);
    for (let i = 0; i < n; i++) {
      const dark = r() > .35;
      blobs += '<ellipse cx="' + (20 + r() * 160).toFixed(1) + '" cy="' + (20 + r() * 160).toFixed(1) + '" rx="' + (14 + r() * 46).toFixed(1) + '" ry="' + (10 + r() * 34).toFixed(1) + '" transform="rotate(' + Math.round(r() * 180) + ' 100 100)" fill="' + (dark ? '#2E2621' : '#E09A62') + '" opacity="' + (dark ? .35 + r() * .45 : .25 + r() * .3).toFixed(2) + '"/>';
    }
    return '<svg viewBox="0 0 200 200" role="img" aria-label="Vân khói của bản này"><defs><filter id="f' + id + '" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter><clipPath id="c' + id + '"><circle cx="100" cy="100" r="96"/></clipPath></defs><circle cx="100" cy="100" r="96" fill="#B5562F"/><g clip-path="url(#c' + id + ')" filter="url(#f' + id + ')">' + blobs + '</g><circle cx="100" cy="100" r="96" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="2"/></svg>';
  };
  window.DD = { CHARS, svgOf, EDITION, NAME_EN, code, pad, smoke, find: id => CHARS.find(c => c.id === id) };
})();
