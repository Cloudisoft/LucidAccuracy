// Site behaviour. Everything initialises on `astro:page-load` so it survives
// client-side page transitions, and is torn down through one AbortController.

import Lenis from 'lenis';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let teardown: AbortController | null = null;

// Smooth scrolling. Desktop wheel and trackpad input is eased by Lenis; touch
// devices keep the browser's native momentum scrolling, which is already smooth
// and stays in sync with the address bar and pull-to-refresh.
function initSmoothScroll(signal: AbortSignal) {
  if (reduceMotion()) return;
  const lenis = new Lenis({
    duration: 1.05,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
    syncTouch: false,
    anchors: { offset: -88 },
  });
  let id = requestAnimationFrame(function raf(time) {
    lenis.raf(time);
    id = requestAnimationFrame(raf);
  });
  // The open mobile menu and the call transcript scroll on their own.
  const menuWatcher = new MutationObserver(() =>
    document.documentElement.classList.contains('menu-open') ? lenis.stop() : lenis.start(),
  );
  menuWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  signal.addEventListener('abort', () => {
    cancelAnimationFrame(id);
    menuWatcher.disconnect();
    lenis.destroy();
  });
}

function initHeader(signal: AbortSignal) {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let last = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-stuck', y > 24);
    header.classList.toggle('is-hidden', y > 640 && y > last && !document.documentElement.classList.contains('menu-open'));
    last = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true, signal });

  // Solutions dropdown: hover and focus work in CSS; the chevron button covers touch and keyboard.
  document.querySelectorAll<HTMLElement>('[data-dropdown]').forEach((item) => {
    const toggle = item.querySelector<HTMLButtonElement>('[data-dropdown-toggle]');
    if (!toggle) return;
    const set = (open: boolean) => {
      item.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => set(!item.classList.contains('is-open')), { signal });
    item.addEventListener('keydown', (e) => e.key === 'Escape' && set(false), { signal });
    document.addEventListener('click', (e) => !item.contains(e.target as Node) && set(false), { signal });
  });

  // Mobile menu
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const button = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  if (!menu || !button) return;
  const setMenu = (open: boolean) => {
    button.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
    } else {
      menu.classList.remove('is-open');
      menu.hidden = true;
    }
  };
  setMenu(false);
  button.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') !== 'true'), { signal });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false), { signal });
  window.matchMedia('(min-width: 1240px)').addEventListener('change', () => setMenu(false), { signal });
}

function initReveal(signal: AbortSignal) {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!items.length) return;
  if (reduceMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );
  items.forEach((el) => io.observe(el));
  signal.addEventListener('abort', () => io.disconnect());
}

// One active item at a time: used by the industries index, the pillars and the world map.
function initSwitches(signal: AbortSignal) {
  document.querySelectorAll<HTMLElement>('[data-switch]').forEach((root) => {
    const triggers = root.querySelectorAll<HTMLElement>('[data-switch-to]');
    const panels = root.querySelectorAll<HTMLElement>('[data-switch-panel]');
    const activate = (id: string) => {
      triggers.forEach((t) => {
        const on = t.dataset.switchTo === id;
        t.classList.toggle('is-active', on);
        if (t.hasAttribute('aria-pressed')) t.setAttribute('aria-pressed', String(on));
      });
      panels.forEach((p) => p.classList.toggle('is-active', p.dataset.switchPanel === id));
    };
    const hover = root.dataset.switch !== 'click';
    triggers.forEach((t) => {
      const id = t.dataset.switchTo!;
      t.addEventListener('click', () => activate(id), { signal });
      t.addEventListener('focusin', () => activate(id), { signal });
      if (hover) t.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && activate(id), { signal });
    });
  });
}

// ---------- 3D globe (canvas 2D, own projection: no 3D library) ----------

type Vec = [number, number, number];
const RAD = Math.PI / 180;
const toVec = (lat: number, lon: number): Vec => {
  const c = Math.cos(lat * RAD);
  return [c * Math.sin(lon * RAD), Math.sin(lat * RAD), c * Math.cos(lon * RAD)];
};

async function initGlobe(signal: AbortSignal) {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-globe]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { default: land } = await import('../data/land.json');
  if (signal.aborted) return;

  const dots = (land.globe as number[][]).map(([lat, lon]) => toVec(lat, lon));
  const markets: { name: string; lat: number; lon: number; side?: string }[] = JSON.parse(canvas.dataset.markets || '[]');
  const offices: { lat: number; lon: number }[] = JSON.parse(canvas.dataset.offices || '[]');
  const marketVecs = markets.map((m) => toVec(m.lat, m.lon));
  const officeVecs = offices.map((o) => toVec(o.lat, o.lon));

  // Great-circle arcs from the United States to every other market.
  const arcs = marketVecs.slice(1).map((to) => {
    const from = marketVecs[0];
    const dot = from[0] * to[0] + from[1] * to[1] + from[2] * to[2];
    const omega = Math.acos(Math.max(-1, Math.min(1, dot)));
    const lift = 0.1 + omega * 0.11;
    const pts: Vec[] = [];
    for (let i = 0; i <= 56; i++) {
      const t = i / 56;
      const a = Math.sin((1 - t) * omega) / Math.sin(omega);
      const b = Math.sin(t * omega) / Math.sin(omega);
      const r = 1 + lift * Math.sin(Math.PI * t);
      pts.push([(a * from[0] + b * to[0]) * r, (a * from[1] + b * to[1]) * r, (a * from[2] + b * to[2]) * r]);
    }
    return pts;
  });

  let w = 0;
  let h = 0;
  let dpr = 1;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  };
  resize();
  const ro = new ResizeObserver(() => {
    resize();
    if (!running) draw(performance.now());
  });
  ro.observe(canvas);

  let rot = 48 * RAD; // start with the Atlantic facing the viewer
  let tilt = 20 * RAD;
  let velocity = 0;
  let dragging = false;
  let lastX = 0;
  let lastInteraction = -1e9;

  const project = (v: Vec, out: Vec) => {
    const cr = Math.cos(rot);
    const sr = Math.sin(rot);
    const x = v[0] * cr + v[2] * sr;
    const z1 = -v[0] * sr + v[2] * cr;
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);
    out[0] = x;
    out[1] = v[1] * ct - z1 * st;
    out[2] = v[1] * st + z1 * ct;
  };

  const p: Vec = [0, 0, 0];
  const draw = (now: number) => {
    const R = Math.min(w, h) * 0.39;
    const cx = w / 2;
    const cy = h / 2;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Atmosphere and body
    const halo = ctx.createRadialGradient(cx, cy, R * 0.97, cx, cy, R * 1.22);
    halo.addColorStop(0, 'hsla(166, 58%, 52%, 0.26)');
    halo.addColorStop(0.35, 'hsla(166, 58%, 52%, 0.09)');
    halo.addColorStop(1, 'hsla(166, 58%, 52%, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.22, 0, Math.PI * 2);
    ctx.fill();

    const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.45, R * 0.1, cx, cy, R);
    body.addColorStop(0, 'hsl(180, 30%, 15%)');
    body.addColorStop(1, 'hsl(188, 42%, 8%)');
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'hsla(166, 58%, 52%, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Land
    const base = Math.max(1, R * 0.0062);
    for (let i = 0; i < dots.length; i++) {
      project(dots[i], p);
      if (p[2] <= 0) continue;
      ctx.globalAlpha = 0.18 + 0.72 * p[2];
      ctx.fillStyle = 'hsl(166, 52%, 56%)';
      ctx.beginPath();
      ctx.arc(cx + p[0] * R, cy - p[1] * R, base * (0.55 + 0.45 * p[2]), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Arcs with a travelling pulse
    const time = now / 1000;
    ctx.lineCap = 'round';
    arcs.forEach((pts, a) => {
      const head = (time * 0.22 + a * 0.27) % 1.35;
      for (let i = 1; i < pts.length; i++) {
        project(pts[i - 1], p);
        const x0 = p[0];
        const y0 = p[1];
        const z0 = p[2];
        project(pts[i], p);
        if (z0 < 0 && Math.hypot(x0, y0) < 1) continue;
        if (p[2] < 0 && Math.hypot(p[0], p[1]) < 1) continue;
        const t = i / pts.length;
        const d = head - t;
        const lit = d > 0 && d < 0.28 ? 1 - d / 0.28 : 0;
        ctx.strokeStyle = `hsla(38, 90%, 58%, ${0.16 + lit * 0.84})`;
        ctx.lineWidth = 1 + lit * 1.4;
        ctx.beginPath();
        ctx.moveTo(cx + x0 * R, cy - y0 * R);
        ctx.lineTo(cx + p[0] * R, cy - p[1] * R);
        ctx.stroke();
      }
    });

    // Offices
    officeVecs.forEach((v) => {
      project(v, p);
      if (p[2] <= 0.05) return;
      ctx.globalAlpha = Math.min(1, p[2] * 2);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(cx + p[0] * R, cy - p[1] * R, Math.max(1.6, R * 0.007), 0, Math.PI * 2);
      ctx.fill();
    });

    // Markets
    ctx.font = `600 ${Math.max(11, Math.min(14, R * 0.045))}px "Inter Variable", Inter, system-ui, sans-serif`;
    ctx.textBaseline = 'middle';
    marketVecs.forEach((v, i) => {
      project(v, p);
      if (p[2] <= 0.08) return;
      const x = cx + p[0] * R;
      const y = cy - p[1] * R;
      const vis = Math.min(1, (p[2] - 0.08) * 3);
      const pulse = (time * 0.6 + i * 0.37) % 1;
      ctx.globalAlpha = vis * (1 - pulse) * 0.7;
      ctx.strokeStyle = 'hsl(38, 90%, 58%)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, 5 + pulse * 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = vis;
      ctx.fillStyle = 'hsl(38, 90%, 58%)';
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      const label = markets[i].name;
      const tw = ctx.measureText(label).width;
      const left = markets[i].side ? markets[i].side === 'left' : p[0] < -0.2;
      const lx = left ? x - 14 - tw : x + 14;
      ctx.fillStyle = 'hsla(188, 42%, 7%, 0.78)';
      ctx.beginPath();
      ctx.roundRect(lx - 8, y - 12, tw + 16, 24, 12);
      ctx.fill();
      ctx.fillStyle = 'hsl(150, 22%, 95%)';
      ctx.fillText(label, lx, y + 0.5);
    });
    ctx.globalAlpha = 1;
  };

  let running = false;
  let visible = true;
  let prev = performance.now();
  const frame = (now: number) => {
    if (!running) return;
    const dt = Math.min(48, now - prev);
    prev = now;
    if (!dragging) {
      const idle = now - lastInteraction > 1800;
      rot += velocity;
      velocity *= 0.94;
      if (idle) rot += dt * 0.00009; // one turn in about 70 seconds
    }
    draw(now);
    requestAnimationFrame(frame);
  };
  const start = () => {
    if (running || reduceMotion()) return;
    running = true;
    prev = performance.now();
    requestAnimationFrame(frame);
  };
  const stop = () => (running = false);

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible && !document.hidden ? start() : stop();
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => (visible && !document.hidden ? start() : stop()), { signal });

  canvas.addEventListener(
    'pointerdown',
    (e) => {
      dragging = true;
      lastX = e.clientX;
      velocity = 0;
      canvas.setPointerCapture(e.pointerId);
    },
    { signal },
  );
  canvas.addEventListener(
    'pointermove',
    (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      velocity = dx * 0.005;
      rot += velocity;
      lastInteraction = performance.now();
      if (!running) draw(performance.now());
    },
    { signal },
  );
  const release = () => {
    dragging = false;
    lastInteraction = performance.now();
  };
  canvas.addEventListener('pointerup', release, { signal });
  canvas.addEventListener('pointercancel', release, { signal });
  canvas.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      rot += e.key === 'ArrowLeft' ? -0.18 : 0.18;
      lastInteraction = performance.now();
      if (!running) draw(performance.now());
    },
    { signal },
  );

  signal.addEventListener('abort', () => {
    stop();
    io.disconnect();
    ro.disconnect();
  });

  draw(performance.now());
  canvas.classList.add('is-ready');
}

// ---------- AI Calling Agent demo ----------

type Scenario = {
  key: string;
  label: string;
  business: string;
  task: string;
  outcome: string;
  lines: [string, string][];
  audio: (string | null)[];
};

// The demo plays silently (animated transcript) when it scrolls into view,
// because browsers block sound until the visitor interacts. "Play with voice"
// restarts the call with the recorded voices, and each line is transcribed
// into the log as it is spoken.
function initCallDemo(signal: AbortSignal) {
  document.querySelectorAll<HTMLElement>('[data-call]').forEach((root) => {
    const scenarios: Scenario[] = JSON.parse(root.querySelector('[data-call-data]')!.textContent || '[]');
    const log = root.querySelector<HTMLElement>('[data-call-log]')!;
    const business = root.querySelector<HTMLElement>('[data-call-business]')!;
    const task = root.querySelector<HTMLElement>('[data-call-task]')!;
    const outcome = root.querySelector<HTMLElement>('[data-call-outcome]')!;
    const outcomeText = root.querySelector<HTMLElement>('[data-call-outcome-text]')!;
    const timer = root.querySelector<HTMLElement>('[data-call-timer]')!;
    const control = root.querySelector<HTMLButtonElement>('[data-call-control]')!;
    const controlLabel = root.querySelector<HTMLElement>('[data-call-control-label]')!;
    const voice = root.querySelector<HTMLButtonElement>('[data-call-voice]')!;
    const voiceLabel = root.querySelector<HTMLElement>('[data-call-voice-label]')!;
    const tabs = root.querySelectorAll<HTMLButtonElement>('[data-call-tab]');
    const audio = new Audio();
    audio.preload = 'auto';

    let scenario = scenarios[0];
    let index = 0; // line being spoken
    let shown = 0; // lines already in the transcript
    let seconds = 0;
    let playing = false;
    let finished = false;
    let sound = false;
    let timeout = 0;
    let tick = 0;

    const setState = (state: string) => {
      root.dataset.state = state;
      controlLabel.textContent = finished ? 'Replay' : playing ? 'Pause' : 'Play';
      control.dataset.mode = finished ? 'replay' : playing ? 'pause' : 'play';
      voice.setAttribute('aria-pressed', String(sound));
      voiceLabel.textContent = sound ? 'Voice on' : 'Play with voice';
    };
    const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const addLine = ([who, text]: [string, string], animate: boolean) => {
      const row = document.createElement('p');
      row.className = `call__line call__line--${who}${animate ? ' is-new' : ''}`;
      const name = document.createElement('span');
      name.className = 'sr-only';
      name.textContent = who === 'agent' ? 'AI agent: ' : 'Caller: ';
      row.append(name, text);
      log.append(row);
      log.scrollTo({ top: log.scrollHeight, behavior: animate ? 'smooth' : 'auto' });
    };

    const silence = () => {
      audio.pause();
      audio.onended = null;
      audio.onerror = null;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };

    const finish = () => {
      playing = false;
      finished = true;
      clearInterval(tick);
      outcome.hidden = false;
      setState('done');
      requestAnimationFrame(() => log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' }));
    };

    const advance = () => {
      if (!playing) return;
      index++;
      root.dataset.state = 'idle';
      timeout = window.setTimeout(speak, sound ? 380 : 520);
    };

    const timed = (text: string) => (timeout = window.setTimeout(advance, 900 + text.length * 30));

    // Speaks the current line: recorded clip first, then the browser's own
    // speech voice if a clip is missing, then silent timing.
    const speak = () => {
      if (!playing) return;
      if (index >= scenario.lines.length) return finish();
      const line = scenario.lines[index];
      setState(line[0]);
      if (shown <= index) {
        addLine(line, true);
        shown = index + 1;
      }
      const src = scenario.audio[index];
      if (sound && src) {
        const resume = audio.dataset.line === `${scenario.key}-${index}` && audio.currentTime > 0 && !audio.ended;
        if (!resume) {
          audio.src = src;
          audio.dataset.line = `${scenario.key}-${index}`;
        }
        audio.onended = advance;
        audio.onerror = () => timed(line[1]);
        audio.play().catch(() => timed(line[1]));
      } else if (sound && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(line[1]);
        utterance.rate = 1.02;
        utterance.onend = advance;
        utterance.onerror = () => timed(line[1]);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } else {
        timed(line[1]);
      }
    };

    const reset = () => {
      clearTimeout(timeout);
      clearInterval(tick);
      silence();
      audio.removeAttribute('src');
      delete audio.dataset.line;
      index = 0;
      shown = 0;
      seconds = 0;
      finished = false;
      playing = false;
      log.replaceChildren();
      outcome.hidden = true;
      timer.textContent = fmt(0);
      business.textContent = scenario.business;
      task.textContent = scenario.task;
      outcomeText.textContent = scenario.outcome;
      setState('idle');
    };

    const play = () => {
      if (finished) reset();
      if (reduceMotion() && !sound) {
        scenario.lines.slice(shown).forEach((l) => addLine(l, false));
        index = shown = scenario.lines.length;
        return finish();
      }
      playing = true;
      clearInterval(tick);
      tick = window.setInterval(() => (timer.textContent = fmt(++seconds)), 1000);
      speak();
    };

    const pause = () => {
      playing = false;
      clearTimeout(timeout);
      clearInterval(tick);
      audio.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setState('idle');
    };

    control.addEventListener('click', () => (playing ? pause() : play()), { signal });
    voice.addEventListener(
      'click',
      () => {
        sound = !sound;
        reset();
        play();
      },
      { signal },
    );
    tabs.forEach((tab) =>
      tab.addEventListener(
        'click',
        () => {
          scenario = scenarios.find((s) => s.key === tab.dataset.callTab) || scenarios[0];
          tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
          reset();
          play();
        },
        { signal },
      ),
    );

    reset();
    // Start the first time the console is on screen; stop the voice when it leaves.
    let started = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45 && !started) {
          started = true;
          play();
        } else if (!entry.isIntersecting && sound && playing) {
          pause();
        }
      },
      { threshold: [0, 0.45] },
    );
    io.observe(root);
    signal.addEventListener('abort', () => {
      io.disconnect();
      clearTimeout(timeout);
      clearInterval(tick);
      silence();
    });
  });
}

// ---------- Contact form ----------
// No backend is connected yet: the form composes an email to the company address.

function initContactForm(signal: AbortSignal) {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const params = new URLSearchParams(location.search);
  const topic = params.get('topic');
  const select = form.querySelector<HTMLSelectElement>('select[name="topic"]');
  if (topic && select) {
    const match = Array.from(select.options).find((o) => o.value === topic);
    if (match) select.value = match.value;
  }
  form.addEventListener(
    'submit',
    (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const get = (k: string) => String(data.get(k) || '').trim();
      const subject = `${get('topic')} enquiry from ${get('name')}${get('company') ? `, ${get('company')}` : ''}`;
      const body = [
        get('message'),
        '',
        `Name: ${get('name')}`,
        get('company') && `Company: ${get('company')}`,
        `Email: ${get('email')}`,
        get('phone') && `Phone: ${get('phone')}`,
        get('country') && `Country: ${get('country')}`,
      ]
        .filter((l) => l !== false && l !== '')
        .join('\n');
      location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.hidden = false;
      status.focus();
    },
    { signal },
  );
}

function init() {
  teardown?.abort();
  teardown = new AbortController();
  const { signal } = teardown;
  document.documentElement.classList.add('js');
  initSmoothScroll(signal);
  initHeader(signal);
  initReveal(signal);
  initSwitches(signal);
  initCallDemo(signal);
  initContactForm(signal);
  initGlobe(signal);
}

document.addEventListener('astro:after-swap', () => document.documentElement.classList.add('js'));
document.addEventListener('astro:page-load', init);
