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

// Video players: muted autoplay while on screen, sound toggle, playlist switching.
export function initVideos(signal: AbortSignal) {
  document.querySelectorAll<HTMLElement>('[data-video]').forEach((root) => {
    const video = root.querySelector('video')!;
    const play = root.querySelector<HTMLButtonElement>('[data-video-play]')!;
    const sound = root.querySelector<HTMLButtonElement>('[data-video-sound]')!;
    const soundLabel = root.querySelector<HTMLElement>('[data-video-sound-label]')!;
    const bar = root.querySelector<HTMLElement>('[data-video-progress]')!;
    let userPaused = false;
    let visible = false;

    const sync = () => {
      root.classList.toggle('is-paused', video.paused);
      play.setAttribute('aria-label', video.paused ? 'Play video' : 'Pause video');
      sound.setAttribute('aria-pressed', String(!video.muted));
      soundLabel.textContent = video.muted ? 'Sound on' : 'Sound off';
    };
    const tryPlay = () => video.play().catch(() => sync());
    ['play', 'pause', 'volumechange'].forEach((e) => video.addEventListener(e, sync, { signal }));
    video.addEventListener('timeupdate', () => (bar.style.transform = `scaleX(${video.duration ? video.currentTime / video.duration : 0})`), { signal });
    play.addEventListener(
      'click',
      () => {
        if (video.paused) {
          userPaused = false;
          tryPlay();
        } else {
          userPaused = true;
          video.pause();
        }
      },
      { signal },
    );
    sound.addEventListener(
      'click',
      () => {
        video.muted = !video.muted;
        if (video.paused) {
          userPaused = false;
          tryPlay();
        }
      },
      { signal },
    );
    video.addEventListener('click', () => play.click(), { signal });

    root.querySelectorAll<HTMLButtonElement>('[data-video-src]').forEach((item) =>
      item.addEventListener(
        'click',
        () => {
          const id = item.dataset.videoSrc!;
          root.querySelectorAll('[data-video-src]').forEach((b) => {
            b.classList.toggle('is-active', b === item);
            b.setAttribute('aria-pressed', String(b === item));
          });
          const muted = video.muted;
          video.poster = `/video/${id}.jpg`;
          video.src = `/video/${id}.mp4`;
          video.setAttribute('aria-label', `${item.dataset.videoTitle} video`);
          video.muted = muted;
          userPaused = false;
          tryPlay();
        },
        { signal },
      ),
    );

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !userPaused) tryPlay();
        if (!visible && !video.paused) video.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(video);
    signal.addEventListener('abort', () => {
      io.disconnect();
      video.pause();
    });
    sync();
  });
}
