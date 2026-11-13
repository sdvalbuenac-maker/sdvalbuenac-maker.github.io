// Anuncios web de Visual Rocket Flyer Games (AdSense para juegos HTML5, Ad Placement API).
// Mientras el sitio no esté aprobado, VRF_ADSENSE_CLIENT queda vacío y todo responde
// "unavailable": el juego entrega la recompensa con su tarjeta propia (sin anuncios de nadie).
// No se usan IDs de AdMob en la web.
// Durante un anuncio real se disparan los eventos 'vrf-ad-start' y 'vrf-ad-end' en window
// para que el juego silencie su audio.
(function () {
  var CLIENT = window.VRF_ADSENSE_CLIENT || '';
  var TEST = !!window.VRF_ADSENSE_TEST;
  if (CLIENT) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + CLIENT;
    s.crossOrigin = 'anonymous';
    if (TEST) s.setAttribute('data-adbreak-test', 'on');
    document.head.appendChild(s);
    window.adsbygoogle = window.adsbygoogle || [];
    window.adBreak = window.adConfig = function (o) { window.adsbygoogle.push(o); };
    window.adConfig({ preloadAdBreaks: 'on', sound: 'on' });
  }
  function emit(name) { try { window.dispatchEvent(new Event(name)); } catch (e) {} }
  function run(type, name) {
    return new Promise(function (resolve) {
      if (!CLIENT || typeof window.adBreak !== 'function') return resolve('unavailable');
      var done = false, shown = false;
      function end(r) { if (!done) { done = true; resolve(r); } }
      var o = {
        type: type, name: name,
        beforeAd: function () { shown = true; emit('vrf-ad-start'); },
        afterAd: function () { emit('vrf-ad-end'); },
        adBreakDone: function () {
          if (type === 'reward') { if (!shown) end('unavailable'); }
          else end(shown ? 'viewed' : 'unavailable');
        }
      };
      if (type === 'reward') {
        o.beforeReward = function (showAdFn) { showAdFn(); };
        o.adViewed = function () { end('viewed'); };
        o.adDismissed = function () { end('dismissed'); };
      }
      window.adBreak(o);
      setTimeout(function () { if (!shown) end('unavailable'); }, 4000);
    });
  }
  window.vrfAds = {
    enabled: !!CLIENT,
    reward: function (name) { return run('reward', name); },
    next: function (name) { return run('next', name); }
  };
})();
