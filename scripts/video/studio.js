/* LucidAccuracy explainer videos: five 30-second motion-graphics pieces.
 * Each video is a list of scenes [start, end, html, update?]. Elements carry
 * animation classes with --t (seconds from the start of the video). seek(t)
 * positions every CSS animation and runs each scene's update(t).
 */
(() => {
  const ICON = (n, cls = 'ico', style = '') => `<span class="${cls}" style="${style}">${window.ICONS[n] || ''}</span>`;
  const A = (cls, t, html, tag = 'div', style = '') => `<${tag} class="a ${cls}" style="--t:${t};${style}">${html}</${tag}>`;
  const FLAGS = [
    ['us', 'USA'],
    ['ca', 'Canada'],
    ['gb', 'UK'],
    ['eu', 'Europe'],
    ['in', 'India'],
    ['au', 'Australia'],
  ];
  const flags = (t) =>
    `<div class="flags">${FLAGS.map(([c, n], i) => A('pop', t + i * 0.12, `<img src="../../public/flags/${c}.svg" alt="">${n}`, 'span')).join('')}</div>`;
  const step = (n, label, t) => A('up', t, `<b>${n}</b>${label}`, 'div', '').replace('class="a up"', 'class="a up step"');
  const end = (t, line, cta) => `
    <div class="end">
      ${A('focus', t, 'Lucid<b>Accuracy</b>', 'div').replace('class="a focus"', 'class="a focus word"')}
      ${A('growx', t + 0.4, '', 'div').replace('class="a growx"', 'class="a growx rule"')}
      ${A('up', t + 0.6, line, 'div').replace('class="a up"', 'class="a up line"')}
      ${A('pop', t + 1.1, `${cta} ${ICON('arrow-right', 'ico', 'color:#10221f;width:22px;height:22px')}`, 'div').replace('class="a pop"', 'class="a pop cta"')}
      ${A('fade', t + 1.5, 'lucidaccuracy.com', 'div').replace('class="a fade"', 'class="a fade url"')}
    </div>`;
  const headline = (t, kicker, h, lead) => `
    ${A('up', t, kicker, 'div').replace('class="a up"', 'class="a up kicker"')}
    ${A('focus', t + 0.25, h, 'h1')}
    ${lead ? A('up', t + 0.7, lead, 'p').replace('class="a up"', 'class="a up lead"') : ''}`;
  const sub = (t, n, label, h) => `${step(n, label, t)}${A('focus', t + 0.2, h, 'h2')}`;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);

  // Typewriter for [data-type] elements: data-t start, data-cps characters/s.
  const typeAll = (root, t) =>
    root.querySelectorAll('[data-type]').forEach((el) => {
      const full = el.dataset.type;
      const n = Math.floor(clamp((t - Number(el.dataset.t)) * Number(el.dataset.cps || 28), 0, full.length));
      el.textContent = full.slice(0, n);
      el.classList.toggle('caret', n > 0 && n < full.length);
    });
  const countAll = (root, t) =>
    root.querySelectorAll('[data-count]').forEach((el) => {
      const k = ease((t - Number(el.dataset.t)) / Number(el.dataset.d || 1.2));
      const v = Number(el.dataset.count) * k;
      const dec = Number(el.dataset.dec || 0);
      el.textContent = (el.dataset.pre || '') + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (el.dataset.suf || '');
    });

  const style = document.createElement('style');
  style.textContent = `
    .caret::after{content:'';display:inline-block;width:2px;height:1em;margin-left:2px;background:var(--teal-bright);vertical-align:-0.15em}
    .orbit{position:relative;width:440px;height:440px;margin:auto}
    .orbit .core{position:absolute;left:50%;top:50%;width:150px;height:150px;transform:translate(-50%,-50%)}
    .orbit .av{position:absolute;left:50%;top:50%;width:64px;height:64px;margin:-32px;border-radius:50%;display:grid;place-items:center;font:700 20px 'Body';color:var(--night);}
    .orbit .track{position:absolute;inset:40px;border-radius:50%;border:1px dashed rgba(63,208,174,.35)}
    .brief{width:520px;padding:30px}
    .brief .hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;font:600 15px 'Body';color:var(--muted);letter-spacing:.08em;text-transform:uppercase}
    .field-row{display:flex;justify-content:space-between;padding:14px 0;border-top:1px solid var(--line);font-size:20px}
    .field-row span:first-child{color:var(--muted)}
    .field-row span:last-child{font-weight:600}
    .ok{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:var(--teal-bright);color:var(--night);font:700 15px 'Body'}
    .ok .ico{width:18px;height:18px;color:var(--night)}
    .pipe{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:40px;position:relative}
    .pipe .colm{padding:20px;border-radius:18px;background:var(--night-2);border:1px solid var(--line);min-height:250px}
    .pipe .colm b{display:block;font:700 46px 'Display';letter-spacing:-.03em}
    .pipe .colm span{font:600 16px 'Body';color:var(--muted);letter-spacing:.06em;text-transform:uppercase}
    .mover{position:absolute;top:150px;width:200px;padding:12px 14px;border-radius:14px;background:var(--amber);color:#10221f;font:700 16px 'Body';display:flex;gap:10px;align-items:center;box-shadow:0 20px 40px -16px rgba(236,160,29,.6)}
    .mover i{width:32px;height:32px;border-radius:50%;background:#10221f;color:var(--amber);display:grid;place-items:center;font:700 13px 'Body';font-style:normal}
    .tiles .tile{font-size:17px}
    .duo{display:grid;grid-template-columns:repeat(2,170px);gap:18px}
    .duo .card{height:170px;display:grid;place-items:center}
    .duo .card .ico{width:64px;height:64px}
    .editor{width:600px;overflow:hidden}
    .editor .top{display:flex;gap:8px;padding:14px 18px;border-bottom:1px solid var(--line)}
    .editor .top i{width:12px;height:12px;border-radius:50%;background:#2b4146}
    .editor pre{margin:0;padding:22px;font:500 18px/1.65 ui-monospace,Menlo,monospace;color:#cfe6de;min-height:230px;white-space:pre}
    .editor pre .k{color:var(--amber)}
    .stages{display:flex;gap:10px;padding:16px 18px;border-top:1px solid var(--line)}
    .stages span{flex:1;text-align:center;padding:10px;border-radius:10px;font:700 15px 'Body';background:rgba(255,255,255,.05);color:var(--muted);transition:none}
    .stages span.on{background:var(--teal);color:#fff}
    .diagram{position:relative;width:640px;height:420px}
    .diagram .node{position:absolute;display:flex;flex-direction:column;align-items:center;gap:10px;font:600 17px 'Body'}
    .diagram .node .box{width:92px;height:92px;border-radius:24px;display:grid;place-items:center;background:var(--night-2);border:1px solid var(--line)}
    .diagram .node .box .ico{width:42px;height:42px}
    .diagram svg{position:absolute;inset:0;overflow:visible}
    .dash{width:620px;padding:26px}
    .kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px}
    .kpis div{padding:16px;border-radius:14px;background:rgba(255,255,255,.04)}
    .kpis span{display:block;font:600 14px 'Body';color:var(--muted);letter-spacing:.04em;text-transform:uppercase}
    .kpis b{font:700 34px 'Display';letter-spacing:-.02em}
    .bars{display:flex;align-items:flex-end;gap:12px;height:170px}
    .bars i{flex:1;border-radius:8px 8px 3px 3px;background:linear-gradient(var(--teal-bright),var(--teal))}
    .bars i:nth-child(odd){background:linear-gradient(#f3b84a,var(--amber))}
    .phone{position:relative;width:300px;height:300px;margin:auto}
    .phone .big-ico{position:absolute;inset:80px}
    .pill{display:inline-flex;align-items:center;gap:10px;padding:12px 18px;border-radius:999px;background:var(--night-2);border:1px solid var(--line);font:600 18px 'Body'}
    .callcard{width:560px;padding:24px}
    .wave{display:flex;gap:4px;align-items:center;height:80px;margin:6px 0 18px}
    .wave i{flex:1;border-radius:3px;background:var(--teal-bright);height:100%}
    .bub{max-width:82%;padding:12px 16px;border-radius:18px 18px 18px 6px;background:rgba(63,208,174,.14);font-size:18px;line-height:1.4;margin-top:10px}
    .bub.me{margin-left:auto;border-radius:18px 18px 6px 18px;background:rgba(236,160,29,.18)}
    .cal{width:560px;padding:24px}
    .cal .days{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
    .cal .days div{font:700 15px 'Body';color:var(--muted);text-align:center;letter-spacing:.06em}
    .cal .slot{height:44px;border-radius:10px;background:rgba(255,255,255,.05)}
    .cal .slot.hit{background:var(--amber);color:#10221f;display:grid;place-items:center;font:700 15px 'Body'}
    .sms{margin-top:18px;padding:14px 18px;border-radius:16px;background:var(--teal-bright);color:var(--night);font:600 17px 'Body';display:inline-block}
    .rep{width:560px;padding:26px}
    .rep .r{display:grid;grid-template-columns:200px 1fr 50px;align-items:center;gap:14px;margin:12px 0;font:600 17px 'Body'}
    .rep .r i{display:block;height:14px;border-radius:7px;background:var(--teal-bright)}
    .rep .r:first-child i{background:var(--amber)}
    .crm{margin-top:20px;padding:16px 18px;border-radius:14px;background:rgba(255,255,255,.05);display:flex;justify-content:space-between;align-items:center;font:600 17px 'Body'}
    .cvgrid{display:grid;grid-template-columns:repeat(4,120px);gap:14px;position:relative}
    .cv{height:150px;border-radius:14px;background:var(--night-2);border:1px solid var(--line);padding:14px;position:relative}
    .cv i{display:block;height:8px;border-radius:4px;background:rgba(255,255,255,.12);margin:8px 0}
    .cv i:first-child{width:50%;height:10px;background:rgba(255,255,255,.25)}
    .cv .m{position:absolute;left:10px;right:10px;bottom:10px;padding:5px 8px;border-radius:8px;background:var(--teal-bright);color:var(--night);font:700 12px 'Body';text-align:center;opacity:0}
    .scan{position:absolute;left:-10px;right:-10px;height:3px;background:var(--amber);box-shadow:0 0 24px 6px rgba(236,160,29,.5)}
    .people{width:560px;padding:20px}
    .person{display:flex;align-items:center;gap:16px;padding:14px;border-radius:14px;margin:8px 0;background:rgba(255,255,255,.04)}
    .person .av2{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font:700 16px 'Body';color:var(--night)}
    .person b{display:block;font-size:19px}
    .person span{color:var(--muted);font-size:16px}
    .person .st{margin-left:auto;font:700 15px 'Body';padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.07);white-space:nowrap}
    .person .st.done{background:var(--teal-bright);color:var(--night)}
    .cloud{position:relative;width:560px;height:400px}
    .cloud .chip{position:absolute;font-size:20px}
    .profile{width:540px;padding:26px}
    .meter{display:grid;grid-template-columns:150px 1fr;gap:14px;align-items:center;margin:14px 0;font:600 17px 'Body'}
    .meter span{display:block;height:12px;border-radius:6px;background:rgba(255,255,255,.08);overflow:hidden}
    .meter span i{display:block;height:100%;background:linear-gradient(90deg,var(--teal-bright),var(--amber));transform-origin:left}
    .path{display:flex;align-items:center;gap:0;margin-top:46px}
    .path .pn{display:flex;flex-direction:column;align-items:center;gap:12px;width:150px;font:700 18px 'Body'}
    .path .pn i{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:var(--night-2);border:2px solid var(--line);font:700 20px 'Display';font-style:normal}
    .path .pn.on i{background:var(--teal-bright);color:var(--night);border-color:var(--teal-bright)}
    .path .ln{flex:1;height:4px;border-radius:2px;background:rgba(255,255,255,.1);position:relative;overflow:hidden}
    .path .ln b{position:absolute;inset:0;background:var(--teal-bright);transform-origin:left}
    .prog{margin-top:44px;width:760px}
    .prog .t{display:flex;justify-content:space-between;font:600 18px 'Body';margin-bottom:10px}
    .prog .track{height:14px;border-radius:7px;background:rgba(255,255,255,.08);overflow:hidden}
    .prog .track i{display:block;height:100%;background:linear-gradient(90deg,var(--teal-bright),var(--amber));transform-origin:left}
  `;
  document.head.append(style);

  const avatar = (txt, bg) => `<div class="av" style="background:${bg}">${txt}</div>`;

  const VIDEOS = {
    /* ---------------- 1. Recruitment & Workforce ---------------- */
    people: {
      tag: 'Recruitment & Workforce',
      scenes: [
        [0, 6.2, `<div class="row"><div class="col">
            ${headline(0.2, 'Recruitment <i>&amp;</i> Workforce', 'The right people,<br>in <em>six markets</em>.', 'Permanent, contract and flexible hiring across eleven industries.')}
            ${flags(1.8)}
          </div><div class="col">
            <div class="orbit a pop" style="--t:0.5">
              <div class="track"></div>
              <div class="core big-ico">${window.ICONS.users}</div>
              ${['PR', 'DM', 'AK', 'JL', 'SN', 'RT', 'MV', 'LC'].map((x, i) => avatar(x, i % 2 ? 'var(--amber)' : 'var(--teal-bright)')).join('')}
            </div>
          </div></div>`,
          (t, el) => el.querySelectorAll('.av').forEach((a, i) => {
            const ang = t * 0.35 + (i / 8) * Math.PI * 2;
            a.style.transform = `translate(${Math.cos(ang) * 180}px, ${Math.sin(ang) * 180}px)`;
          })],
        [6.2, 12.4, `<div class="row"><div class="col">
            ${sub(6.5, 1, 'Brief', 'We agree the role, the skills and the <em>budget</em>.')}
          </div><div class="col">
            <div class="card brief a right" style="--t:6.8">
              <div class="hd">New role brief ${A('pop', 10.6, `${ICON('check')} Brief approved`, 'span').replace('class="a pop"', 'class="a pop ok"')}</div>
              <div class="field-row"><span>Role</span><span data-type="Cloud Engineer" data-t="7.4"></span></div>
              <div class="field-row"><span>Location</span><span data-type="Toronto, Canada" data-t="8.0"></span></div>
              <div class="field-row"><span>Engagement</span><span data-type="Permanent" data-t="8.6"></span></div>
              <div class="chips" style="margin-top:20px">${['AWS', 'Kubernetes', 'Terraform', 'Python', '5+ years'].map((c, i) => A('pop', 9.1 + i * 0.2, c, 'span').replace('class="a pop"', 'class="a pop chip"')).join('')}</div>
            </div>
          </div></div>`],
        [12.4, 18.8, `${sub(12.7, 2, 'Source &amp; screen', 'Recruiters find, screen and <em>shortlist</em>.')}
            <div class="pipe">
              ${[['Sourced', 48], ['Screened', 16], ['Shortlisted', 5], ['Interview', 3], ['Offer', 1]].map(([n, c], i) =>
                A('up', 13.1 + i * 0.12, `<b data-count="${c}" data-t="${13.4 + i * 0.6}" data-d="1">0</b><span>${n}</span>`, 'div').replace('class="a up"', 'class="a up colm"')).join('')}
              <div class="mover"><i>PR</i>Priya · Cloud</div>
            </div>`,
          (t, el) => {
            const m = el.querySelector('.mover');
            const k = clamp((t - 14) / 3.6);
            const col = (1162 - 4 * 14) / 5 + 14;
            const x = 12 + ease(k) * col * 4;
            m.style.transform = `translateX(${x}px)`;
            m.style.opacity = t < 13.8 ? 0 : 1;
          }],
        [18.8, 24.4, `${sub(19.0, 3, 'Every sector', 'Across <em>eleven</em> industries.')}
            <div class="tiles">${[
              ['cpu', 'Technology & IT'], ['heart-pulse', 'Healthcare'], ['drafting-compass', 'Engineering'], ['landmark', 'Finance'],
              ['flask-conical', 'Life Sciences'], ['factory', 'Manufacturing'], ['truck', 'Logistics'], ['radio-tower', 'Telecoms'],
              ['shopping-bag', 'Retail'], ['zap', 'Energy'], ['briefcase', 'Professional services'], ['globe', 'Six markets'],
            ].map(([i, n], k) => A('pop', 19.5 + k * 0.1, `${ICON(i)}${n}`, 'div').replace('class="a pop"', 'class="a pop tile"')).join('')}</div>`],
        [24.4, 30, end(24.7, 'Recruitment &amp; Workforce Solutions', 'Talk to our team')],
      ],
    },

    /* ---------------- 2. Technology Solutions ---------------- */
    technology: {
      tag: 'Technology Solutions',
      scenes: [
        [0, 6.2, `<div class="row"><div class="col">
            ${headline(0.2, 'Technology Solutions', 'Software, cloud and data, <em>built by our engineers</em>.', 'From a single application to a full digital transformation.')}
          </div><div class="col" style="display:grid;place-items:center">
            <div class="duo">${['code', 'cloud', 'database', 'shield-check'].map((i, k) => A('pop', 0.8 + k * 0.18, ICON(i), 'div').replace('class="a pop"', 'class="a pop card"')).join('')}</div>
          </div></div>`,
          (t, el) => el.querySelectorAll('.duo .card').forEach((c, i) => (c.style.translate = `0 ${Math.sin(t * 1.4 + i) * 8}px`))],
        [6.2, 12.6, `<div class="row"><div class="col">
            ${sub(6.5, 1, 'Build &amp; release', 'Short cycles. Working software at <em>every milestone</em>.')}
          </div><div class="col">
            <div class="card editor a right" style="--t:6.8">
              <div class="top"><i></i><i></i><i></i></div>
              <pre><span data-type="export async function bookShift(req) {" data-t="7.3" data-cps="40"></span>
<span data-type="  const slot = await schedule.find(req);" data-t="8.2" data-cps="40"></span>
<span data-type="  await notify(req.team, slot);" data-t="9.1" data-cps="40"></span>
<span data-type="  return { status: 'booked', slot };" data-t="9.8" data-cps="40"></span>
<span data-type="}" data-t="10.6" data-cps="40"></span></pre>
              <div class="stages"><span>Design</span><span>Build</span><span>Test</span><span>Release</span></div>
            </div>
          </div></div>`,
          (t, el) => el.querySelectorAll('.stages span').forEach((s, i) => s.classList.toggle('on', t > 7.4 + i * 1.15))],
        [12.6, 18.8, `<div class="row"><div class="col" style="flex:.8">
            ${sub(12.9, 2, 'Cloud architecture', 'Secure systems that <em>scale</em>.')}
          </div><div class="col">
            <div class="diagram">
              <svg viewBox="0 0 640 420">
                ${[[95, 210, 245, 210], [325, 210, 475, 210], [285, 170, 285, 85], [285, 250, 285, 335]].map(([x1, y1, x2, y2], i) =>
                  `<path class="a draw" style="--t:${13.6 + i * 0.3}" pathLength="1" d="M${x1} ${y1} L${x2} ${y2}" stroke="rgba(63,208,174,.6)" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}
                <circle class="pkt" r="7" fill="#eca01d"/><circle class="pkt2" r="7" fill="#3fd0ae"/>
              </svg>
              ${[['monitor', 'Users', 0, 160], ['server', 'Application', 240, 160], ['database', 'Data', 480, 160], ['shield-check', 'Security', 240, 0], ['chart-column', 'Analytics', 240, 320]].map(([i, n, x, y], k) =>
                A('pop', 13.3 + k * 0.2, `<div class="box">${ICON(i, 'ico', 'width:42px;height:42px')}</div>${n}`, 'div', `left:${x}px;top:${y}px`).replace('class="a pop"', 'class="a pop node"')).join('')}
            </div>
          </div></div>`,
          (t, el) => {
            const a = ((t - 14.6) * 0.5) % 1;
            const b = ((t - 14.9) * 0.5 + 0.5) % 1;
            const p1 = el.querySelector('.pkt');
            const p2 = el.querySelector('.pkt2');
            const vis = t > 14.6 ? 1 : 0;
            p1.setAttribute('cx', 95 + Math.max(0, a) * 380);
            p1.setAttribute('cy', 210);
            p2.setAttribute('cx', 285);
            p2.setAttribute('cy', 85 + Math.max(0, b) * 250);
            p1.style.opacity = p2.style.opacity = vis;
          }],
        [18.8, 24.4, `<div class="row"><div class="col" style="flex:.8">
            ${sub(19.1, 3, 'Data &amp; analytics', 'Numbers your team can <em>trust</em>.')}
          </div><div class="col">
            <div class="card dash a right" style="--t:19.4">
              <div class="kpis">
                <div><span>Orders</span><b data-count="12480" data-t="19.9" data-d="1.6">0</b></div>
                <div><span>On time</span><b data-count="98.2" data-dec="1" data-suf="%" data-t="20.1" data-d="1.6">0</b></div>
                <div><span>Systems</span><b data-count="1" data-t="20.3" data-d="0.8">0</b></div>
              </div>
              <div class="bars">${[38, 52, 46, 64, 58, 72, 68, 84, 79, 92].map((h, i) => `<i class="a growy" style="--t:${20.2 + i * 0.12};height:${h}%"></i>`).join('')}</div>
            </div>
          </div></div>`],
        [24.4, 30, end(24.7, 'Technology Solutions', 'Start a project')],
      ],
    },

    /* ---------------- 3. LucidAI Calling Agent ---------------- */
    ai: {
      tag: 'LucidAI Calling Agent',
      scenes: [
        [0, 6.2, `<div class="row"><div class="col">
            ${headline(0.2, 'LucidAI Calling Agent', 'Every call answered.<br><em>Day and night.</em>', 'An AI voice agent for inbound and outbound business calls.')}
          </div><div class="col">
            <div class="phone a pop" style="--t:0.6">
              <div class="ring"></div><div class="ring"></div><div class="ring"></div>
              <div class="big-ico">${window.ICONS['phone-call']}</div>
            </div>
            <div style="text-align:center;margin-top:10px">${A('up', 1.6, `${ICON('clock')} Incoming call · <span data-type="02:14 AM" data-t="2.0" data-cps="12"></span>`, 'span').replace('class="a up"', 'class="a up pill"')}</div>
          </div></div>`,
          (t, el) => el.querySelectorAll('.ring').forEach((r, i) => {
            const k = ((t * 0.7 + i / 3) % 1);
            r.style.transform = `scale(${0.75 + k * 0.7})`;
            r.style.opacity = (1 - k) * 0.8;
          })],
        [6.2, 13.2, `<div class="row"><div class="col" style="flex:.85">
            ${sub(6.5, 1, 'Talks naturally', 'Human-like <em>conversations</em>.')}
          </div><div class="col">
            <div class="card callcard a right" style="--t:6.8">
              <div style="display:flex;justify-content:space-between;font:600 18px 'Body'"><span>Riverside Family Clinic</span><span style="color:var(--muted)">Appointment reminder</span></div>
              <div class="wave">${Array.from({ length: 46 }, () => '<i></i>').join('')}</div>
              ${A('up', 7.4, 'You have a check-up on Thursday at 10:30. Would you like to keep that time?', 'div').replace('class="a up"', 'class="a up bub"')}
              ${A('up', 9.2, 'Could we move it to the afternoon?', 'div').replace('class="a up"', 'class="a up bub me"')}
              ${A('up', 10.6, 'Of course. I have 2:15 or 4:00 on Thursday.', 'div').replace('class="a up"', 'class="a up bub"')}
              ${A('up', 12.1, '2:15 works.', 'div').replace('class="a up"', 'class="a up bub me"')}
            </div>
          </div></div>`,
          (t, el) => {
            const speaker = t < 9.1 ? 'a' : t < 10.5 ? 'c' : t < 12 ? 'a' : 'c';
            el.querySelectorAll('.wave i').forEach((b, i) => {
              const v = 0.18 + 0.82 * Math.abs(Math.sin(t * 9 + i * 0.7) * Math.sin(t * 3.3 + i * 0.29));
              b.style.transform = `scaleY(${v})`;
              b.style.background = speaker === 'a' ? 'var(--teal-bright)' : 'var(--amber)';
            });
          }],
        [13.2, 19.2, `<div class="row"><div class="col" style="flex:.85">
            ${sub(13.5, 2, 'Books the slot', 'Appointments scheduled <em>during the call</em>.')}
          </div><div class="col">
            <div class="card cal a right" style="--t:13.8">
              <div class="days">${['MON', 'TUE', 'WED', 'THU', 'FRI'].map((d) => `<div>${d}</div>`).join('')}
                ${Array.from({ length: 20 }, (_, i) => i === 13 ? A('pop', 15.4, '2:15 PM', 'div').replace('class="a pop"', 'class="a pop slot hit"') : `<div class="slot"></div>`).join('')}
              </div>
              <div style="margin-top:18px;display:flex;gap:12px;align-items:center">${A('pop', 16.2, `${ICON('calendar-check')} Appointment booked`, 'span').replace('class="a pop"', 'class="a pop ok"')}</div>
              ${A('up', 17.0, 'Confirmed: Thursday 2:15 PM, Riverside Family Clinic.', 'div').replace('class="a up"', 'class="a up sms"')}
            </div>
          </div></div>`],
        [19.2, 24.6, `<div class="row"><div class="col" style="flex:.85">
            ${sub(19.5, 3, 'Reports every call', 'Outcomes sent to your team and <em>CRM</em>.')}
          </div><div class="col">
            <div class="card rep a right" style="--t:19.8">
              ${[['Appointment booked', 46], ['Lead qualified', 27], ['Question answered', 18], ['Passed to staff', 9]].map(([n, v], i) =>
                `<div class="r"><span>${n}</span><i class="a growx" style="--t:${20.3 + i * 0.2};width:${v * 2}%"></i><span data-count="${v}" data-suf="%" data-t="${20.3 + i * 0.2}">0</span></div>`).join('')}
              ${A('up', 22.0, `<span>${ICON('database', 'ico', 'vertical-align:-5px;margin-right:8px')}CRM record · Daniel R.</span>${A('pop', 22.6, `${ICON('check')} Updated`, 'span').replace('class="a pop"', 'class="a pop ok"')}`, 'div').replace('class="a up"', 'class="a up crm"')}
            </div>
          </div></div>`],
        [24.6, 30, end(24.9, 'LucidAI Calling Agent', 'Book a demo')],
      ],
    },

    /* ---------------- 4. Trend: AI-assisted hiring ---------------- */
    'ai-hiring': {
      tag: 'Trend · AI in hiring',
      scenes: [
        [0, 6.2, `<div class="row"><div class="col">
            ${headline(0.2, 'Trend <i>·</i> AI-assisted hiring', 'AI is taking on the <em>busy work</em> of hiring.', 'Screening and scheduling move faster. People still decide.')}
          </div><div class="col">
            <div class="orbit a pop" style="--t:0.5">
              <div class="track"></div>
              <div class="core big-ico" style="background:var(--amber)">${window.ICONS.sparkles}</div>
              ${['file-user', 'calendar-check', 'message-square', 'user-check', 'search', 'phone'].map((i, k) => `<div class="av" style="background:${k % 2 ? 'var(--night-3)' : 'var(--night-2)'};border:1px solid var(--line);color:var(--teal-bright);padding:16px">${window.ICONS[i]}</div>`).join('')}
            </div>
          </div></div>`,
          (t, el) => el.querySelectorAll('.av').forEach((a, i) => {
            const ang = -t * 0.3 + (i / 6) * Math.PI * 2;
            a.style.transform = `translate(${Math.cos(ang) * 180}px, ${Math.sin(ang) * 180}px)`;
          })],
        [6.2, 12.6, `<div class="row"><div class="col" style="flex:.85">
            ${sub(6.5, 1, 'Faster screening', 'Applications sorted by <em>skills</em> in minutes.')}
          </div><div class="col">
            <div class="cvgrid a right" style="--t:6.8">
              ${Array.from({ length: 12 }, (_, i) => `<div class="cv"><i></i><i style="width:${60 + (i * 13) % 35}%"></i><i style="width:${40 + (i * 29) % 50}%"></i><i style="width:${55 + (i * 17) % 40}%"></i><div class="m">Skills match</div></div>`).join('')}
              <div class="scan"></div>
            </div>
          </div></div>`,
          (t, el) => {
            const k = clamp((t - 7.6) / 2.6);
            const scan = el.querySelector('.scan');
            scan.style.top = `${k * 470}px`;
            scan.style.opacity = k > 0 && k < 1 ? 1 : 0;
            const hits = [1, 6, 10];
            el.querySelectorAll('.cv').forEach((c, i) => {
              const done = t > 10.4;
              const hit = hits.includes(i);
              c.style.opacity = done && !hit ? 0.3 : 1;
              c.style.borderColor = done && hit ? 'var(--teal-bright)' : '';
              c.querySelector('.m').style.opacity = done && hit ? 1 : 0;
            });
          }],
        [12.6, 18.8, `<div class="row"><div class="col" style="flex:.85">
            ${sub(12.9, 2, 'Instant scheduling', 'AI calls the shortlist to <em>book interviews</em>.')}
          </div><div class="col">
            <div class="card people a right" style="--t:13.2">
              ${[['PR', 'Priya R.', 'Data Analyst', 'Tue 11:00'], ['DM', 'Daniel M.', 'Data Analyst', 'Wed 14:30'], ['AK', 'Aisha K.', 'Data Analyst', 'Thu 10:00']].map(([a, n, r, s], i) =>
                `<div class="person"><div class="av2" style="background:${i % 2 ? 'var(--amber)' : 'var(--teal-bright)'}">${a}</div><div><b>${n}</b><span>${r}</span></div><div class="st" data-st="${s}" data-t="${14.2 + i * 1.3}">Queued</div></div>`).join('')}
            </div>
          </div></div>`,
          (t, el) => el.querySelectorAll('.st').forEach((s) => {
            const t0 = Number(s.dataset.t);
            const done = t > t0 + 0.9;
            s.textContent = t < t0 ? 'Queued' : done ? `Interview ${s.dataset.st}` : 'Calling…';
            s.classList.toggle('done', done);
          })],
        [18.8, 24.4, `<div class="row"><div class="col" style="flex:.85">
            ${sub(19.1, 3, 'Human judgement', 'Recruiters interview and <em>decide</em>.')}
          </div><div class="col">
            <div class="card people a right" style="--t:19.4">
              <div style="display:flex;align-items:center;gap:14px;margin:4px 4px 12px;font:600 18px 'Body'">${ICON('user-round', 'ico', 'width:30px;height:30px')} Recruiter review</div>
              ${[['PR', 'Priya R.', 'Strong SQL and Power BI'], ['AK', 'Aisha K.', 'Clear communicator']].map(([a, n, r], i) =>
                `<div class="person"><div class="av2" style="background:var(--teal-bright)">${a}</div><div><b>${n}</b><span>${r}</span></div>${A('pop', 20.4 + i * 0.6, `${ICON('check')} Approved`, 'span', 'margin-left:auto').replace('class="a pop"', 'class="a pop ok"')}</div>`).join('')}
              <div style="margin-top:14px;text-align:right">${A('pop', 22.2, `${ICON('badge-check')} Offer sent`, 'span').replace('class="a pop"', 'class="a pop ok"')}</div>
            </div>
          </div></div>`],
        [24.4, 30, end(24.7, 'AI speed. <span style="color:var(--text)">Human judgement.</span>', 'Talk to our team')],
      ],
    },

    /* ---------------- 5. Trend: skills-first workforce ---------------- */
    skills: {
      tag: 'Trend · Skills-first hiring',
      scenes: [
        [0, 6.2, `<div class="row"><div class="col">
            ${headline(0.2, 'Trend <i>·</i> Skills-first workforce', 'Hiring for <em>skills</em>, not just job titles.', 'And growing those skills inside the team.')}
          </div><div class="col">
            <div class="cloud">${[
              ['Python', 40, 30], ['Cloud', 300, 10], ['Communication', 120, 120], ['Data analysis', 330, 150], ['Leadership', 30, 230],
              ['Cybersecurity', 260, 270], ['Project delivery', 90, 330], ['AI tools', 380, 360],
            ].map(([n, x, y], i) => A('pop', 0.9 + i * 0.15, `${ICON('sparkles')}${n}`, 'span', `left:${x}px;top:${y}px`).replace('class="a pop"', 'class="a pop chip"')).join('')}</div>
          </div></div>`,
          (t, el) => el.querySelectorAll('.cloud .chip').forEach((c, i) => (c.style.translate = `0 ${Math.sin(t * 1.2 + i * 0.9) * 9}px`))],
        [6.2, 12.6, `<div class="row"><div class="col" style="flex:.85">
            ${sub(6.5, 1, 'Skills profile', 'See what people can <em>actually do</em>.')}
          </div><div class="col">
            <div class="card profile a right" style="--t:6.8">
              <div style="display:flex;align-items:center;gap:16px;margin-bottom:10px">
                <div class="av2" style="width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:var(--amber);color:var(--night);font:700 20px 'Body'">SN</div>
                <div><b style="font:600 22px 'Display'">Sam N.</b><div style="color:var(--muted)">Operations Analyst</div></div>
              </div>
              ${[['Data analysis', 86], ['SQL', 72], ['Process design', 80], ['Cloud basics', 48], ['Communication', 90]].map(([n, v], i) =>
                `<div class="meter">${n}<span><i class="a growx" style="--t:${7.6 + i * 0.3};width:${v}%"></i></span></div>`).join('')}
            </div>
          </div></div>`],
        [12.6, 18.8, `${sub(12.9, 2, 'Upskilling path', 'Training <em>closes the gap</em>.')}
            <div class="path">${['Assess', 'Plan', 'Train', 'Apply'].map((n, i) =>
              `${i ? '<div class="ln"><b></b></div>' : ''}<div class="pn"><i>${i + 1}</i>${n}</div>`).join('')}</div>
            <div class="prog a up" style="--t:13.6"><div class="t"><span>Cloud basics</span><span data-count="92" data-suf="%" data-t="14" data-d="4">0</span></div><div class="track"><i></i></div></div>`,
          (t, el) => {
            const k = clamp((t - 13.8) / 4);
            el.querySelectorAll('.pn').forEach((p, i) => p.classList.toggle('on', k >= i / 3 - 0.001 && t > 13.8));
            el.querySelectorAll('.ln b').forEach((b, i) => (b.style.transform = `scaleX(${clamp(k * 3 - i)})`));
            el.querySelector('.prog .track i').style.transform = `scaleX(${0.48 + 0.44 * ease(k)})`;
          }],
        [18.8, 24.4, `<div class="row"><div class="col" style="flex:.8">
            ${sub(19.1, 3, 'Talent without borders', 'Skilled teams across <em>six markets</em>.')}
            ${flags(19.9)}
          </div><div class="col" style="flex:1.15"><canvas id="map" width="1320" height="760" style="width:100%;height:auto"></canvas></div></div>`,
          (t, el) => drawMap(el.querySelector('#map'), t - 19.2)],
        [24.4, 30, end(24.7, 'Train, hire and grow skilled teams.', 'See our solutions')],
      ],
    },
  };

  // Flat dot map for the skills video.
  let land = null;
  fetch('../../src/data/land.json').then((r) => r.json()).then((d) => (land = d.flat));
  const MARKETS = [[39.5, -98.5], [55, -106], [53.5, -1.8], [49.5, 11], [21.5, 79], [-25, 134]];
  function drawMap(c, t) {
    const ctx = c.getContext('2d');
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.clearRect(0, 0, 660, 380);
    if (!land) return;
    const X = (lon) => ((lon + 170) / 350) * 660;
    const Y = (lat) => ((78 - lat) / 134) * 380;
    const k = clamp(t / 1.2);
    ctx.fillStyle = 'rgba(63,208,174,0.45)';
    ctx.globalAlpha = k;
    for (const [lat, lon] of land) {
      ctx.beginPath();
      ctx.arc(X(lon), Y(lat), 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    const [ula, ulo] = MARKETS[0];
    MARKETS.slice(1).forEach(([la, lo], i) => {
      const p = clamp((t - 0.8 - i * 0.35) / 1.1);
      if (p <= 0) return;
      const x0 = X(ulo), y0 = Y(ula), x1 = X(lo), y1 = Y(la);
      const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 60 - Math.abs(x1 - x0) * 0.12;
      ctx.strokeStyle = '#eca01d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let s = 0; s <= 40 * p; s++) {
        const u = s / 40;
        const x = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * mx + u * u * x1;
        const y = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * my + u * u * y1;
        s ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    });
    MARKETS.forEach(([la, lo], i) => {
      const x = X(lo), y = Y(la);
      const pulse = ((t * 0.8 + i * 0.2) % 1);
      ctx.strokeStyle = `rgba(236,160,29,${(1 - pulse) * 0.8})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 6 + pulse * 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#eca01d';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ---------- Mount ----------
  const id = new URLSearchParams(location.search).get('v') || 'people';
  const video = VIDEOS[id];
  document.getElementById('tag').textContent = video.tag;
  const host = document.getElementById('scenes');
  const scenes = video.scenes.map(([s, e, html, update]) => {
    const el = document.createElement('section');
    el.className = 'scene';
    el.innerHTML = html;
    host.append(el);
    return { s, e, el, update };
  });
  const DURATION = 30;

  window.seek = (t) => {
    document.getAnimations().forEach((a) => {
      a.pause();
      a.currentTime = t * 1000;
    });
    scenes.forEach(({ s, e, el, update }, i) => {
      const fadeIn = i === 0 ? 1 : clamp((t - s) / 0.5);
      const fadeOut = i === scenes.length - 1 ? 1 : clamp((e - t) / 0.5);
      const v = Math.min(fadeIn, fadeOut);
      el.style.opacity = v;
      el.style.visibility = v > 0 ? 'visible' : 'hidden';
      el.style.transform = fadeOut < 1 ? `scale(${0.985 + 0.015 * fadeOut})` : '';
      el.style.filter = fadeOut < 1 ? `blur(${(1 - fadeOut) * 8}px)` : '';
      if (v > 0) {
        typeAll(el, t);
        countAll(el, t);
        if (update) update(t, el);
      }
    });
    document.getElementById('grid').style.transform = `translate(${(t * 6) % 64}px, ${(t * 3) % 64}px)`;
    document.getElementById('bar').style.transform = `scaleX(${t / DURATION})`;
  };
  window.ready = Promise.all([document.fonts.ready, new Promise((r) => setTimeout(r, 400))]).then(() => {
    window.seek(0);
    return true;
  });
  window.DURATION = DURATION;
})();
