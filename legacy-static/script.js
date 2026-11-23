// 3D tilt on hover
for (const el of document.querySelectorAll('[data-tilt]')) {
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    el.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(10px)`;
  });
  el.addEventListener('pointerleave', () => (el.style.transform = ''));
}

// Hero parallax follows the mouse
const hero = document.querySelector('.hero');
const heroImg = document.querySelector('[data-parallax]');
hero.addEventListener('pointermove', e => {
  const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
  heroImg.style.transform = `rotateY(${x * -10}deg) rotateX(${y * 8}deg) scale(1.03)`;
});
hero.addEventListener('pointerleave', () => (heroImg.style.transform = ''));

// Scroll reveal (staggered cards)
document.querySelectorAll('.card').forEach((c, i) => c.style.setProperty('--i', i));
const io = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { threshold: .2 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Count-up stats
const counter = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    counter.unobserve(e.target);
    const end = +e.target.dataset.count, suf = e.target.dataset.suffix || '';
    const t0 = performance.now();
    const tick = t => {
      const p = Math.min((t - t0) / 1600, 1);
      e.target.textContent = Math.round(end * (1 - (1 - p) ** 3)).toLocaleString() + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
});
document.querySelectorAll('[data-count]').forEach(el => counter.observe(el));
