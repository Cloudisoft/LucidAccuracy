// Ambient motion: the connecting-dots network, count-up numbers and the
// scroll progress bar. Each init returns nothing and cleans up through `signal`.

type Dot = { x: number; y: number; vx: number; vy: number; r: number; hub: boolean; phase: number };

// Drifting dots that join with lines when they pass close to each other, plus a
// few brighter "hub" nodes that pulse. Lines also reach towards the cursor.
// Every <canvas data-net> on the page gets one; it pauses when off screen.
export function initNetworks(signal: AbortSignal) {
  document.querySelectorAll<HTMLCanvasElement>('canvas[data-net]').forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const tone = canvas.dataset.net === 'light' ? 'light' : 'dark';
    const line = tone === 'dark' ? '94, 214, 186' : '30, 143, 121';
    const dotColour = tone === 'dark' ? 'rgba(170, 236, 220, 0.75)' : 'rgba(30, 143, 121, 0.55)';
    const hubColour = '236, 160, 29';

    let w = 0;
    let h = 0;
    let dpr = 1;
    let dots: Dot[] = [];
    const mouse = { x: -9999, y: -9999 };

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const density = w < 700 ? 15000 : 11000;
      const count = Math.max(24, Math.min(110, Math.round((w * h) / density)));
      dots = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: 1 + Math.random() * 1.3,
        hub: i % 13 === 0,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const LINK = 130;
    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -20) d.x = w + 20;
        else if (d.x > w + 20) d.x = -20;
        if (d.y < -20) d.y = h + 20;
        else if (d.y > h + 20) d.y = -20;
        // the cursor gently pulls nearby dots
        const mx = mouse.x - d.x;
        const my = mouse.y - d.y;
        const md = Math.hypot(mx, my);
        if (md < 180 && md > 1) {
          d.x += (mx / md) * 0.35;
          d.y += (my / md) * 0.35;
        }
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const alpha = (1 - Math.sqrt(d2) / LINK) * (tone === 'dark' ? 0.24 : 0.2);
          ctx.strokeStyle = `rgba(${line}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        const md = Math.hypot(mouse.x - a.x, mouse.y - a.y);
        if (md < 170) {
          ctx.strokeStyle = `rgba(${hubColour}, ${(1 - md / 170) * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      for (const d of dots) {
        if (d.hub) {
          const pulse = (Math.sin(t / 700 + d.phase) + 1) / 2;
          ctx.fillStyle = `rgba(${hubColour}, ${0.18 * (1 - pulse)})`;
          ctx.beginPath();
          ctx.arc(d.x, d.y, 4 + pulse * 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgb(${hubColour})`;
          ctx.beginPath();
          ctx.arc(d.x, d.y, 2.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = dotColour;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    let running = false;
    let id = 0;
    const frame = (t: number) => {
      if (!running) return;
      draw(t);
      id = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running) return;
      running = true;
      id = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(id);
    };

    seed();
    const ro = new ResizeObserver(() => seed());
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()));
    io.observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()), { signal });

    const host = canvas.parentElement!;
    host.addEventListener(
      'pointermove',
      (e) => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      },
      { signal, passive: true },
    );
    host.addEventListener('pointerleave', () => ((mouse.x = -9999), (mouse.y = -9999)), { signal });

    signal.addEventListener('abort', () => {
      stop();
      ro.disconnect();
      io.disconnect();
    });
    canvas.classList.add('is-ready');
  });
}

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
