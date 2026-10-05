// boot_v2.js
(function () {
  const timeline = window.__TIMELINE__;
  const stage = document.getElementById('stage');
  const tl = gsap.timeline({ paused: true });
  window.__tl = tl;
  timeline.scenes.forEach((sc) => {
    const fn = window.SCENES[sc.id];
    if (typeof fn === 'function') fn(stage, tl, sc.start, sc.end);
    else console.warn('missing scene fn:', sc.id);
  });
  window.__ready = true;
})();
