"""Background music for the LucidAccuracy explainer videos.

Every track is synthesised here from scratch (pads, plucked arpeggio, bass,
soft drums), so there is no third-party music licence to manage.

usage: python3 scripts/video/music.py <out.wav> <preset>
"""
import sys
import wave

import numpy as np

SR = 44100
DUR = 30.0

# name: tempo, chords (MIDI root, quality), arpeggio pattern, brightness
PRESETS = {
    'people': dict(bpm=100, chords=[(57, 'm'), (53, 'M'), (48, 'M'), (55, 'M')], arp=[0, 1, 2, 3, 2, 1, 2, 3], bright=0.55),
    'technology': dict(bpm=112, chords=[(50, 'm'), (58, 'M'), (53, 'M'), (57, 'm')], arp=[0, 2, 1, 3, 0, 2, 1, 3], bright=0.7),
    'ai': dict(bpm=108, chords=[(52, 'm'), (48, 'M'), (55, 'M'), (50, 'M')], arp=[0, 3, 2, 3, 1, 3, 2, 3], bright=0.8),
    'ai-hiring': dict(bpm=104, chords=[(53, 'M'), (57, 'm'), (55, 'M'), (48, 'M')], arp=[0, 1, 2, 1, 3, 1, 2, 1], bright=0.6),
    'skills': dict(bpm=96, chords=[(48, 'M'), (55, 'M'), (57, 'm'), (53, 'M')], arp=[0, 2, 3, 2, 1, 2, 3, 2], bright=0.5),
}

QUAL = {'M': [0, 4, 7, 11], 'm': [0, 3, 7, 10]}


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def env(n, a, r, sustain=1.0):
    """Attack/release envelope over n samples (a, r in seconds)."""
    e = np.full(n, sustain, dtype=np.float64)
    na, nr = min(n, int(a * SR)), min(n, int(r * SR))
    if na:
        e[:na] = np.linspace(0, sustain, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def place(buf, start, sig):
    i = int(start * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def pad(freq, length, bright):
    t = np.arange(int(length * SR)) / SR
    out = np.zeros_like(t)
    for det in (-0.12, 0.0, 0.11):
        f = freq * 2 ** (det / 12)
        for h in range(1, 6):
            out += np.sin(2 * np.pi * f * h * t + h) * (bright ** (h - 1)) / h
    lfo = 0.85 + 0.15 * np.sin(2 * np.pi * 0.2 * t)
    return out * lfo * env(len(t), 0.9, 1.2) / 9


def pluck(freq, bright):
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.35 * bright * np.sin(2 * np.pi * freq * 2 * t) + 0.12 * np.sin(2 * np.pi * freq * 3 * t)
    return s * np.exp(-t * 7.5) * env(n, 0.003, 0.05)


def kick():
    n = int(0.32 * SR)
    t = np.arange(n) / SR
    f = 45 + 85 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)


def hat(rng):
    n = int(0.05 * SR)
    noise = rng.standard_normal(n)
    noise = np.diff(noise, prepend=0)  # crude high-pass
    return noise * np.exp(-np.arange(n) / SR * 90) * 0.12


def render(preset):
    p = PRESETS[preset]
    rng = np.random.default_rng(7)
    beat = 60.0 / p['bpm']
    bar = beat * 4
    n = int(DUR * SR)
    L = np.zeros(n)
    R = np.zeros(n)
    t0 = 0.0
    i = 0
    while t0 < DUR:
        root, q = p['chords'][i % len(p['chords'])]
        tones = [root + x for x in QUAL[q]]
        # pads: whole bar, slightly wide
        for k, m in enumerate(tones):
            s = pad(hz(m), bar + 1.2, p['bright'])
            place(L, t0 + (0.004 if k % 2 else 0), s * (0.9 if k % 2 else 1.0))
            place(R, t0 + (0 if k % 2 else 0.004), s * (1.0 if k % 2 else 0.9))
        # bass on beats 1 and 3
        for b in (0, 2):
            m = root - 12
            ln = beat * 1.8
            tt = np.arange(int(ln * SR)) / SR
            s = np.sin(2 * np.pi * hz(m) * tt) * env(len(tt), 0.01, 0.4) * 0.32
            place(L, t0 + b * beat, s)
            place(R, t0 + b * beat, s)
        # arpeggio enters after the first bar, 8th notes, ping-pong echo
        if t0 >= bar - 0.01:
            for s8 in range(8):
                m = tones[p['arp'][s8] % 4] + 12
                pl = pluck(hz(m), p['bright']) * 0.16
                st = t0 + s8 * beat / 2
                place(L if s8 % 2 == 0 else R, st, pl)
                place(R if s8 % 2 == 0 else L, st + beat * 0.75, pl * 0.35)
        # drums from bar 3: soft four-on-the-floor kick, off-beat hats
        if t0 >= bar * 2 - 0.01 and t0 < DUR - bar:
            for b in range(4):
                k = kick() * 0.5
                place(L, t0 + b * beat, k)
                place(R, t0 + b * beat, k)
                h = hat(rng)
                place(L, t0 + b * beat + beat / 2, h)
                place(R, t0 + b * beat + beat / 2, h * 0.8)
        t0 += bar
        i += 1

    mix = np.stack([L, R], axis=1)
    fade_in, fade_out = int(0.8 * SR), int(2.5 * SR)
    mix[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]
    mix[-fade_out:] *= np.linspace(1, 0, fade_out)[:, None]
    mix = np.tanh(mix * 1.4)
    mix *= 0.82 / max(1e-9, np.abs(mix).max())
    return mix


def main():
    out, preset = sys.argv[1], sys.argv[2]
    data = (render(preset) * 32767).astype('<i2')
    with wave.open(out, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print('wrote', out)


if __name__ == '__main__':
    main()
