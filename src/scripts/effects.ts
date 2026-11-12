// Ambient motion: count-up numbers and the scroll progress bar. Each init returns nothing and cleans up through `signal`.

// Numbers marked data-count animate up from zero the first time they appear.
export function initCounters(signal: AbortSignal) {
  const items = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!items.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        const el = e.target as HTMLElement;
        const end = Number(el.dataset.count);
        const t0 = performance.now();
        const dur = 1400;
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / dur);
          el.textContent = String(Math.round(end * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(step);
        };
        el.textContent = '0';
        requestAnimationFrame(step);
      }
    },
    { threshold: 0.6 },
  );
  items.forEach((el) => io.observe(el));
  signal.addEventListener('abort', () => io.disconnect());
}

export function initProgress(signal: AbortSignal) {
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', String(max > 0 ? scrollY / max : 0));
  };
  update();
  window.addEventListener('scroll', update, { passive: true, signal });
  window.addEventListener('resize', update, { passive: true, signal });
}

// Buttons: a gentle magnetic pull towards the cursor (mouse only) and a ripple
// from the exact point that was pressed.
export function initButtons(signal: AbortSignal) {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.querySelectorAll<HTMLElement>('.btn').forEach((btn) => {
    if (fine) {
      btn.addEventListener(
        'pointermove',
        (e) => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
          const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
          btn.style.setProperty('--mx', `${(x * 6).toFixed(1)}px`);
          btn.style.setProperty('--my', `${(y * 5).toFixed(1)}px`);
        },
        { signal },
      );
      btn.addEventListener('pointerleave', () => btn.style.removeProperty('--mx') || btn.style.removeProperty('--my'), { signal });
    }
    btn.addEventListener(
      'pointerdown',
      (e) => {
        const r = btn.getBoundingClientRect();
        const dot = document.createElement('span');
        dot.className = 'btn__ripple';
        const size = Math.max(r.width, r.height) * 2.2;
        dot.style.width = dot.style.height = `${size}px`;
        dot.style.left = `${e.clientX - r.left - size / 2}px`;
        dot.style.top = `${e.clientY - r.top - size / 2}px`;
        btn.append(dot);
        dot.addEventListener('animationend', () => dot.remove());
      },
      { signal },
    );
  });
}

// Decorative loops run only while on screen.
export function initLiveLoops(signal: AbortSignal) {
  const els = document.querySelectorAll<HTMLElement>('[data-field], .marquee');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('is-live', e.isIntersecting)), {
    rootMargin: '120px 0px',
  });
  els.forEach((el) => io.observe(el));
  signal.addEventListener('abort', () => io.disconnect());
}
