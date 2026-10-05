// boot.js — 建立場景並曝光 ready
(function () {
  const timeline = window.__TIMELINE__;
  const stage = document.getElementById('stage');
  const tl = gsap.timeline({ paused: true });
  window.__tl = tl;
  timeline.scenes.forEach((sc) => {
    const fn = window.SCENES[sc.id];
    if (typeof fn === 'function') fn(stage, tl, sc.start, sc.end);
  });
  window.__ready = true;
})();
