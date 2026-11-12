// Production server: serves the built site from dist/ and receives contact
// form submissions at POST /api/contact.
//
// Each submission is
//   1. written to the log (always visible in the Railway dashboard),
//   2. appended to $DATA_DIR/submissions.jsonl when DATA_DIR is set (a Railway volume),
//   3. emailed to $NOTIFY_TO when SMTP_HOST, SMTP_USER and SMTP_PASS are set.
//
// Environment: PORT, DATA_DIR, NOTIFY_TO, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM.

import express from 'express';
import compression from 'compression';
import nodemailer from 'nodemailer';
import { appendFile, mkdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

const root = resolve(new URL('..', import.meta.url).pathname);
const dist = join(root, 'dist');
const port = Number(process.env.PORT || 8080);
const dataDir = process.env.DATA_DIR;
const notifyTo = process.env.NOTIFY_TO || 'Info@lucidaccuracy.com';

export const SERVICES = JSON.parse(readFileSync(join(root, 'src/data/contact-services.json'), 'utf8')).map((s) => s.value);

const mailer =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: Number(process.env.SMTP_PORT || 465) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
    : null;

// ---------- validation ----------
const clean = (v, max) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max) : '');
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export function validate(body) {
  const data = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40),
    company: clean(body.company, 160),
    country: clean(body.country, 80),
    services: (Array.isArray(body.services) ? body.services : [body.services]).map((s) => clean(s, 80)).filter((s) => SERVICES.includes(s)),
    message: typeof body.message === 'string' ? body.message.trim().slice(0, 4000) : '',
    consent: body.consent === true || body.consent === 'on' || body.consent === 'true',
  };
  const errors = {};
  if (data.name.length < 2) errors.name = 'Enter your name.';
  if (!emailOk(data.email)) errors.email = 'Enter an email address like name@company.com.';
  if (data.phone && !/^[+()\d\s.-]{6,}$/.test(data.phone)) errors.phone = 'Enter a phone number using digits, spaces or +.';
  if (!data.services.length) errors.services = 'Choose at least one service you are interested in.';
  if (data.message.length < 10) errors.message = 'Tell us a little more: at least 10 characters.';
  if (!data.consent) errors.consent = 'Please agree to the privacy policy so we can reply.';
  return { data, errors };
}

// ---------- simple per-IP rate limit ----------
const hits = new Map();
const limited = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
};
setInterval(() => hits.clear(), 60 * 60 * 1000).unref();

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

async function deliver(sub) {
  console.log('[contact] submission', JSON.stringify(sub));
  if (dataDir) {
    await mkdir(dataDir, { recursive: true });
    await appendFile(join(dataDir, 'submissions.jsonl'), JSON.stringify(sub) + '\n');
  }
  if (mailer) {
    const rows = [
      ['Name', sub.name],
      ['Email', sub.email],
      ['Phone', sub.phone || '—'],
      ['Company', sub.company || '—'],
      ['Country', sub.country || '—'],
      ['Interested in', sub.services.join(', ')],
      ['Received', sub.receivedAt],
      ['Reference', sub.id],
    ];
    await mailer.sendMail({
      from: process.env.MAIL_FROM || `LucidAccuracy Website <${process.env.SMTP_USER}>`,
      to: notifyTo,
      replyTo: `${sub.name} <${sub.email}>`,
      subject: `New enquiry: ${sub.services.join(', ')} — ${sub.name}${sub.company ? `, ${sub.company}` : ''}`,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${sub.message}`,
      html: `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
        .map(([k, v]) => `<tr><td style="color:#555"><b>${k}</b></td><td>${escape(v)}</td></tr>`)
        .join('')}</table><p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escape(sub.message)}</p>`,
    });
  }
}

// ---------- app ----------
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(compression());

app.post('/api/contact', express.json({ limit: '20kb' }), express.urlencoded({ extended: false, limit: '20kb' }), async (req, res) => {
  const body = req.body || {};
  // Honeypot: real visitors never see or fill this field.
  if (body.website) return res.json({ ok: true, id: randomUUID() });
  if (limited(req.ip)) return res.status(429).json({ ok: false, error: 'Too many requests. Please try again in a few minutes, or email Info@lucidaccuracy.com.' });
  const { data, errors } = validate(body);
  if (Object.keys(errors).length) return res.status(422).json({ ok: false, errors });
  const sub = { id: randomUUID(), receivedAt: new Date().toISOString(), page: clean(body.page, 200), ...data };
  try {
    await deliver(sub);
    res.json({ ok: true, id: sub.id });
  } catch (err) {
    console.error('[contact] delivery failed', err);
    // The submission is already in the log; tell the visitor it was received.
    res.json({ ok: true, id: sub.id });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true, email: Boolean(mailer), storage: Boolean(dataDir) }));

app.use(
  express.static(dist, {
    extensions: ['html'],
    setHeaders(res, path) {
      if (/\/(_astro|og|audio|flags|video|images)\//.test(path)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      else if (path.endsWith('.html')) res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    },
  }),
);

// Folder URLs without a trailing slash redirect, as the static host did.
app.use((req, res, next) => {
  if (!req.path.endsWith('/') && existsSync(join(dist, req.path, 'index.html'))) return res.redirect(308, req.path + '/');
  next();
});

app.use((_req, res) => res.status(404).sendFile(join(dist, '404.html')));

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  app.listen(port, () => console.log(`LucidAccuracy listening on ${port} (email ${mailer ? 'on' : 'off'}, storage ${dataDir || 'off'})`));
}

export default app;
