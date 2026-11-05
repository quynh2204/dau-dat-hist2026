/* Dấu Đất · trang thẻ sưu tầm: một trang mẫu dùng chung cho mọi thẻ */
(function () {
  const DD = window.DD;
  const q = new URLSearchParams(location.search);
  const m = (q.get('m') || '001').replace(/[^0-9]/g, '').slice(0, 4) || '001';
  const cid = q.get('c') || '';
  const s = parseInt(q.get('s') || '0', 10);
  const embed = q.get('embed') === '1';
  if (embed) document.documentElement.classList.add('embed');
  let lang = q.get('lang') === 'en' ? 'en' : 'vi';
  try { const saved = localStorage.getItem('dd-lang'); if (!q.get('lang') && saved) lang = saved === 'en' ? 'en' : 'vi'; } catch (e) {}

  const L = {
    vi: { found: 'Bạn đã khai quật', edition: 'Bản', of: 'của Mẻ', unique: 'Độc bản', valid: 'Mã hợp lệ', smokeNote: 'Vân khói minh hoạ. Bản thật được chụp khi ra lò và gắn vào mã này.', maker: 'Người nặn', sampleTag: 'Hồ sơ mẫu', sampleNote: 'Tên và ảnh nghệ nhân thật hiển thị khi mẻ này ra lò.', batch: 'Mẻ nung', place: 'Nơi làm', firing: 'Cách nung', status: 'Trạng thái', collection: 'Bộ sưu tập Mẹ Làng', have: 'Bạn đã có', mothers: 'mẹ', rare: 'nhân vật hiếm', complete: 'Bạn đã sưu tầm đủ 6 mẹ!', cta: 'Xem câu chuyện Dấu Đất', invalidT: 'Không tìm thấy bản này', invalidP: 'Mã thẻ không đúng hoặc chưa được phát hành. Kiểm tra lại mã in trên thẻ.' },
    en: { found: 'You unearthed', edition: 'Piece', of: 'of Batch', unique: 'One of a kind', valid: 'Verified code', smokeNote: 'Illustrative smoke pattern. The real piece is photographed out of the kiln and linked to this code.', maker: 'Made by', sampleTag: 'Sample profile', sampleNote: 'The real artisan name and photo appear when this batch leaves the kiln.', batch: 'Firing batch', place: 'Made in', firing: 'Firing', status: 'Status', collection: 'Village Mothers collection', have: 'You have', mothers: 'mothers', rare: 'rare figure', complete: 'You have collected all 6 mothers!', cta: 'Discover Dấu Đất', invalidT: 'Piece not found', invalidP: 'This card code is wrong or not yet issued. Please check the code printed on your card.' }
  };

  const root = document.getElementById('card');
  const nameOf = c => lang === 'en' ? DD.NAME_EN[c.id] : c.name;
  let data = null;

  const invalid = () => {
    const t = L[lang];
    root.innerHTML = '<section class="cp-block cp-invalid"><h1>' + t.invalidT + '</h1><p>' + t.invalidP + '</p>' + (embed ? '' : '<a class="btn primary" href="/">' + t.cta + '</a>') + '</section>';
  };

  const render = d => {
    const ch = DD.find(cid), max = d && d.pieces && d.pieces[cid];
    if (!ch || !max || !(s >= 1 && s <= max)) return invalid();
    const t = L[lang], key = DD.code(d.batch, ch.id, s), a = d.artisans[d.maker[ch.id]];
    let got = [];
    try { got = JSON.parse(localStorage.getItem('dd-got') || '[]'); if (!Array.isArray(got)) got = []; } catch (e) { got = []; }
    if (!embed && got.indexOf(ch.id) < 0) { got.push(ch.id); try { localStorage.setItem('dd-got', JSON.stringify(got)); } catch (e) {} }
    if (got.indexOf(ch.id) < 0) got = got.concat([ch.id]);
    const nMain = got.filter(id => id !== 'hiem' && DD.find(id)).length;
    const slots = DD.CHARS.map(c => '<li class="' + (got.indexOf(c.id) >= 0 ? 'on' : '') + (c.rare ? ' rare' : '') + (c.id === ch.id ? ' me' : '') + '" title="' + nameOf(c) + '">' + DD.svgOf(c, nameOf(c)) + '</li>').join('');
    root.innerHTML =
      '<header class="cp-hero' + (ch.rare ? ' rare' : '') + '">' +
        '<p class="cp-eyebrow">' + t.found + '</p>' +
        '<div class="cp-art">' + DD.svgOf(ch, nameOf(ch)) + '</div>' +
        '<h1>' + nameOf(ch) + '</h1>' +
        '<p class="cp-no">' + t.edition + ' <b>' + DD.pad(s) + '/' + DD.pad(max) + '</b> ' + t.of + ' ' + d.batch + '</p>' +
        '<p class="cp-story">' + d.story[ch.id][lang] + '</p>' +
      '</header>' +
      '<section class="cp-block cp-unique"><div class="cp-smoke">' + DD.smoke(key) + '</div><div><h2>' + t.unique + '</h2><p class="cp-code">' + key + '</p><p><span class="cp-valid">' + t.valid + '</span></p><p class="cp-note">' + t.smokeNote + '</p></div></section>' +
      '<section class="cp-block cp-maker"><div class="cp-portrait" aria-hidden="true"><span>' + a.name[lang].slice(-1) + '</span></div><div><h2>' + t.maker + '</h2><p class="cp-name">' + a.name[lang] + (d.sample ? ' <span class="tag">' + t.sampleTag + '</span>' : '') + '</p><p>' + a.line[lang] + '</p>' + (d.sample ? '<p class="cp-note">' + t.sampleNote + '</p>' : '') + '</div></section>' +
      '<section class="cp-block"><h2>' + t.batch + ' ' + d.batch + '</h2><dl class="cp-dl"><dt>' + t.place + '</dt><dd>' + d.place[lang] + '</dd><dt>' + t.firing + '</dt><dd>' + d.firing[lang] + '</dd><dt>' + t.status + '</dt><dd>' + d.status[lang] + '</dd></dl></section>' +
      '<section class="cp-block"><h2>' + t.collection + '</h2><p>' + (nMain >= 6 ? t.complete : t.have + ' <b>' + nMain + '/6</b> ' + t.mothers) + (got.indexOf('hiem') >= 0 ? ' + 1 ' + t.rare : '') + '</p><ul class="cp-slots">' + slots + '</ul></section>' +
      (embed ? '' : '<a class="btn primary cp-cta" href="/">' + t.cta + '</a>');
    document.title = nameOf(ch) + ' · ' + key + ' – Dấu Đất';
  };

  const draw = () => { document.documentElement.lang = lang; if (data) render(data); else invalid(); };
  fetch('data/me-' + m + '.json').then(r => r.ok ? r.json() : null).then(d => { data = d; draw(); }).catch(draw);

  const btn = document.getElementById('langBtn');
  if (btn) {
    btn.textContent = lang === 'vi' ? 'EN' : 'VI';
    btn.addEventListener('click', () => {
      lang = lang === 'vi' ? 'en' : 'vi';
      btn.textContent = lang === 'vi' ? 'EN' : 'VI';
      try { localStorage.setItem('dd-lang', lang); } catch (e) {}
      draw();
    });
  }
})();
