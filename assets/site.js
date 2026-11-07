/* Visual Rocket Flyer Games — efectos del sitio */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (isIOS) document.documentElement.classList.add('is-ios');

  /* ---------- Campo de estrellas ---------- */
  var cv = document.getElementById('space');
  if (cv && cv.getContext) {
    var ctx = cv.getContext('2d'), W, H, DPR, stars = [], shoots = [], mx = 0, my = 0, t0 = performance.now();
    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.width = innerWidth * DPR; H = cv.height = innerHeight * DPR;
      var n = Math.round((innerWidth * innerHeight) / 2600);
      stars = [];
      for (var i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, z: Math.random() * .9 + .1, tw: Math.random() * 6.28, c: Math.random() < .12 ? '#7fc3ff' : (Math.random() < .05 ? '#ffd27a' : '#ffffff') });
    }
    resize(); addEventListener('resize', resize);
    addEventListener('mousemove', function (e) { mx = (e.clientX / innerWidth - .5); my = (e.clientY / innerHeight - .5); });
    var scrollY0 = 0; addEventListener('scroll', function () { scrollY0 = scrollY; }, { passive: true });
    function frame(now) {
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var px = (s.x + mx * 40 * s.z * DPR) % W, py = (s.y - scrollY0 * .15 * s.z * DPR + my * 30 * s.z * DPR) % H;
        if (py < 0) py += H; if (px < 0) px += W;
        var a = .35 + .65 * s.z * (.6 + .4 * Math.sin(t * 2 + s.tw));
        ctx.globalAlpha = a; ctx.fillStyle = s.c;
        var r = s.z * 1.5 * DPR; ctx.fillRect(px, py, r, r);
      }
      if (!reduce && Math.random() < .012 && shoots.length < 2) shoots.push({ x: Math.random() * W * .8, y: Math.random() * H * .4, vx: (6 + Math.random() * 6) * DPR, vy: (2 + Math.random() * 3) * DPR, life: 1 });
      for (var j = shoots.length - 1; j >= 0; j--) {
        var sh = shoots[j]; sh.x += sh.vx; sh.y += sh.vy; sh.life -= .018;
        var g = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 14, sh.y - sh.vy * 14);
        g.addColorStop(0, 'rgba(180,225,255,' + sh.life + ')'); g.addColorStop(1, 'rgba(180,225,255,0)');
        ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 2 * DPR; ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(sh.x - sh.vx * 14, sh.y - sh.vy * 14); ctx.stroke();
        if (sh.life <= 0) shoots.splice(j, 1);
      }
      ctx.globalAlpha = 1;
      if (!reduce) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Aliens dibujados ---------- */
  // Familia de aliens de Visual Rocket Flyer: cabeza gris-azulada, ojos negros
  // grandes y antenas con punta luminosa, como la mascota.
  function alien(o) {
    o = o || {};
    var skin = o.skin || '#8d9bb0', shade = o.shade || '#6b7890', tip = o.tip || '#4da3ff';
    var acc = '';
    if (o.glasses) acc += '<path d="M28 58 h64 v6 c0 10 -10 14 -18 12 c-6 -2 -8 -8 -10 -10 h-8 c-2 2 -4 8 -10 10 c-8 2 -18 -2 -18 -12z" fill="#05070d"/><path d="M36 62 l10 0" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>';
    if (o.chain) acc += '<path d="M47 113 q13 18 26 0" fill="none" stroke="#ffc83d" stroke-width="2.5"/><rect x="56.5" y="128" width="7" height="10" rx="2" fill="#ffc83d"/>';
    if (o.visor) acc += '<rect x="26" y="54" width="68" height="22" rx="11" fill="#1e7bff" fill-opacity=".85"/><rect x="30" y="58" width="60" height="5" rx="2.5" fill="#bfe4ff" fill-opacity=".7"/>';
    if (o.wave) acc += '<g class="wave"><path d="M86 124 q20 -4 24 -32" stroke="#0b1020" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M106 100 q4 -8 4 -12" stroke="' + skin + '" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="110" cy="86" r="6.5" fill="' + skin + '"/></g>';
    var eyes = (o.glasses || o.visor) ? '' :
      '<g class="eyes"><ellipse cx="44" cy="64" rx="15" ry="10" transform="rotate(20 44 64)" fill="#05070d"/><ellipse cx="76" cy="64" rx="15" ry="10" transform="rotate(-20 76 64)" fill="#05070d"/>' +
      '<circle cx="40" cy="60" r="3" fill="#fff" fill-opacity=".8"/><circle cx="72" cy="60" r="3" fill="#fff" fill-opacity=".8"/></g>';
    var torso = '<path d="M26 160 C26 128 40 114 60 114 C80 114 94 128 94 160z" fill="#0b1020" stroke="#4da3ff" stroke-opacity=".55" stroke-width="2"/>' +
      '<path d="M60 128 l6 9 -6 13 -6 -13z" fill="#1e7bff"/><path d="M60 131 l2.5 5 -2.5 6 -2.5 -6z" fill="#e9eefb"/>';
    return '<svg viewBox="-8 -16 136 176" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + torso +
      '<path d="M44 20 Q36 6 30 2" stroke="' + shade + '" stroke-width="4" stroke-linecap="round" fill="none"/>' +
      '<path d="M76 20 Q84 6 90 2" stroke="' + shade + '" stroke-width="4" stroke-linecap="round" fill="none"/>' +
      '<circle class="antenna-glow" cx="30" cy="2" r="6" fill="' + tip + '"/><circle class="antenna-glow" cx="90" cy="2" r="6" fill="' + tip + '"/>' +
      '<circle cx="30" cy="2" r="12" fill="' + tip + '" fill-opacity=".25"/><circle cx="90" cy="2" r="12" fill="' + tip + '" fill-opacity=".25"/>' +
      '<path d="M51 96 h18 l3 20 h-24z" fill="' + shade + '"/>' +
      '<path d="M18 52 l-12 -10 l16 2z M102 52 l12 -10 l-16 2z" fill="' + shade + '"/>' +
      '<path d="M60 14 C22 14 14 46 20 66 C26 88 46 102 60 102 C74 102 94 88 100 66 C106 46 98 14 60 14z" fill="' + skin + '"/>' +
      '<path d="M40 26 q20 -8 40 0" stroke="' + shade + '" stroke-width="2" fill="none" opacity=".6"/>' +
      '<path d="M44 34 q16 -5 32 0" stroke="' + shade + '" stroke-width="2" fill="none" opacity=".45"/>' +
      eyes +
      '<path d="M50 86 q10 8 20 0" stroke="#3a4152" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      acc + '</svg>';
  }
  window.vrfAlien = alien;

  var layer = document.querySelector('.aliens');
  if (layer && !reduce) {
    var cast = [
      { skin: '#8d9bb0', shade: '#66748c', tip: '#4da3ff', glasses: true, chain: true },
      { skin: '#7fb3a8', shade: '#5c8a80', tip: '#46e3ff', wave: true },
      { skin: '#a596c9', shade: '#7c6ea6', tip: '#ffc83d', visor: true },
      { skin: '#8fa6c4', shade: '#6a7f9f', tip: '#8a5cff' }
    ];
    var floaters = [];
    var spots = innerWidth < 700 ? [[4, 70], [80, 82]] : [[3, 62], [90, 24], [86, 78], [12, 16]];
    spots.forEach(function (p, i) {
      var d = document.createElement('div');
      d.className = 'floater';
      var size = (innerWidth < 700 ? 54 : 70) + (i % 2) * 18;
      d.style.width = size + 'px'; d.style.left = p[0] + '%'; d.style.top = p[1] + '%';
      d.innerHTML = alien(cast[i % cast.length]);
      layer.appendChild(d);
      floaters.push({ el: d, ph: Math.random() * 6.28, sp: .4 + Math.random() * .4, rot: (Math.random() - .5) * 30 });
    });
    (function fl(now) {
      var t = now / 1000;
      floaters.forEach(function (f, i) {
        var y = Math.sin(t * f.sp + f.ph) * 18 - scrollY * (.05 + i * .02);
        var x = Math.cos(t * f.sp * .7 + f.ph) * 12;
        f.el.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + (f.rot + Math.sin(t * .8 + f.ph) * 8) + 'deg)';
      });
      requestAnimationFrame(fl);
    })(0);
    // Ovni con rayo tractor
    var u = document.createElement('div');
    u.className = 'ufo';
    u.innerHTML = '<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><linearGradient id="bm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#46e3ff" stop-opacity=".55"/><stop offset="1" stop-color="#46e3ff" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd8ee"/><stop offset="1" stop-color="#55607a"/></linearGradient>' +
      '<radialGradient id="dome" cx=".4" cy=".3"><stop offset="0" stop-color="#bfe8ff" stop-opacity=".9"/><stop offset="1" stop-color="#1e7bff" stop-opacity=".35"/></radialGradient></defs>' +
      '<path class="beam" d="M80 62 L120 62 L170 250 L30 250z" fill="url(#bm)"/>' +
      '<ellipse cx="100" cy="40" rx="34" ry="30" fill="url(#dome)"/>' +
      '<g transform="translate(78 16) scale(.33)">' + alien({ skin: '#8d9bb0', shade: '#66748c', tip: '#4da3ff' }).replace(/<\/?svg[^>]*>/g, '') + '</g>' +
      '<ellipse cx="100" cy="52" rx="92" ry="20" fill="url(#hull)"/>' +
      '<ellipse cx="100" cy="47" rx="92" ry="9" fill="#e9eefb" fill-opacity=".55"/>' +
      '<g class="lights"><circle cx="30" cy="55" r="4" fill="#46e3ff"/><circle cx="62" cy="62" r="4" fill="#ffc83d"/><circle cx="100" cy="65" r="4" fill="#46e3ff"/><circle cx="138" cy="62" r="4" fill="#ffc83d"/><circle cx="170" cy="55" r="4" fill="#46e3ff"/></g>' +
      '</svg>';
    layer.appendChild(u);
  }

  /* ---------- Navegación ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onS = function () { nav.classList.toggle('scrolled', scrollY > 20); };
    onS(); addEventListener('scroll', onS, { passive: true });
    var mb = nav.querySelector('.menu-btn');
    if (mb) mb.addEventListener('click', function () { var o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); mb.textContent = o ? '✕' : '☰'; });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 }) : null;
  document.querySelectorAll('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  /* ---------- Contadores ---------- */
  var cio = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      var el = e.target, to = +el.dataset.count, suf = el.dataset.suffix || '', st = performance.now();
      (function step(n) { var p = Math.min(1, (n - st) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(step); })(st);
    });
  }) : null;
  document.querySelectorAll('[data-count]').forEach(function (el) { cio ? cio.observe(el) : (el.textContent = el.dataset.count + (el.dataset.suffix || '')); });

  /* ---------- Tarjetas con inclinación 3D ---------- */
  if (!reduce && matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card, .tilt').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.transform = 'perspective(900px) rotateX(' + ((.5 - y) * 8) + 'deg) rotateY(' + ((x - .5) * 10) + 'deg) translateY(-4px)';
        c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
    var glow = document.querySelector('.cursor-glow');
    if (glow) addEventListener('mousemove', function (e) { glow.style.display = 'block'; glow.style.opacity = 1; glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });
  }

  /* ---------- Texto que se escribe solo ---------- */
  var ty = document.querySelector('.typed');
  if (ty) {
    var words = JSON.parse(ty.dataset.words || '[]'), wi = 0, ci = 0, del = false;
    (function tick() {
      var w = words[wi] || ''; ci += del ? -1 : 1; ty.textContent = w.slice(0, ci);
      var d = del ? 45 : 90;
      if (!del && ci === w.length) { del = true; d = 1600; }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; d = 300; }
      setTimeout(tick, d);
    })();
  }

  /* ---------- Teléfono con capturas que rotan ---------- */
  document.querySelectorAll('.phone .screen').forEach(function (s) {
    var items = s.children, i = 0; if (items.length < 2) return;
    setInterval(function () { items[i].classList.remove('on'); i = (i + 1) % items.length; items[i].classList.add('on'); }, 2600);
  });

  /* ---------- Alien que se asoma al final ---------- */
  var peek = document.querySelector('.peek');
  if (peek) {
    peek.innerHTML = alien({ skin: '#8d9bb0', shade: '#66748c', tip: '#4da3ff', glasses: true, chain: true, wave: true });
    var pio = new IntersectionObserver(function (es) { es.forEach(function (e) { peek.classList.toggle('up', e.isIntersecting); }); }, { threshold: .4 });
    pio.observe(peek.parentElement);
  }

  /* ---------- Aliens alrededor de las fotos ---------- */
  var presets = {
    wave: { skin: '#7fb3a8', shade: '#5c8a80', tip: '#46e3ff', wave: true },
    visor: { skin: '#a596c9', shade: '#7c6ea6', tip: '#ffc83d', visor: true },
    glasses: { skin: '#8d9bb0', shade: '#66748c', tip: '#4da3ff', glasses: true, chain: true }
  };
  document.querySelectorAll('[data-alien]').forEach(function (el) { el.innerHTML = alien(presets[el.dataset.alien] || {}); });

  /* ---------- Idioma elegido a mano: se recuerda ---------- */
  document.querySelectorAll('.lang a').forEach(function (a) {
    a.addEventListener('click', function () { try { localStorage.setItem('vrf_lang', a.dataset.lang); } catch (e) {} });
  });

  var yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();
})();
