"""
Wristy — sound design, synthesised from scratch (no samples, no licensing issues).

Soft UI effects (pop, tick, whoosh, click, chime, shimmer, swell…) are placed on
the animation moments listed in animation/edl.js ("sfx"), and a quiet ambient
music bed runs underneath. Levels are kept low so speech always stays clear.
"""
import wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def _t(d):
    return np.arange(int(d * SR)) / SR


def _env(n, a=0.003, d=0.1):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(t - a, 0) / d)


def _lp(x, cutoff):
    """One-pole low-pass; cutoff may be a per-sample array."""
    if np.ndim(cutoff) == 0:
        try:
            from scipy.signal import lfilter
            k = 1 - np.exp(-2 * np.pi * float(cutoff) / SR)
            return lfilter([k], [1, k - 1], x)
        except ImportError:
            pass
    c = np.broadcast_to(np.asarray(cutoff, float), x.shape)
    k = 1 - np.exp(-2 * np.pi * c / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += k[i] * (x[i] - acc)
        y[i] = acc
    return y


def _sweep(f0, f1, d):
    t = _t(d)
    f = f0 * (f1 / f0) ** (t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def pop():
    s = _sweep(820, 470, 0.12) * _env(int(.12 * SR), .002, .045)
    n = rng.standard_normal(int(.006 * SR)) * np.linspace(1, 0, int(.006 * SR)) * .25
    s[:len(n)] += n
    return s * .34


def tick():
    t = _t(.06)
    return (np.sin(2 * np.pi * 1900 * t) + .35 * np.sin(2 * np.pi * 3800 * t)) * _env(len(t), .001, .012) * .16


def type_():
    n = rng.standard_normal(int(.03 * SR))
    n = n - _lp(n, 1800)                       # high-pass-ish
    return n * _env(len(n), .001, .006) * .09


def click():
    th = _sweep(150, 70, .09) * _env(int(.09 * SR), .002, .03) * .3
    c = rng.standard_normal(int(.008 * SR)) * np.linspace(1, 0, int(.008 * SR)) * .1
    th[:len(c)] += c
    return th


def blip():
    return _sweep(1150, 1650, .09) * _env(int(.09 * SR), .003, .04) * .12


def _whoosh(d, up=True, amp=.2):
    n = rng.standard_normal(int(d * SR))
    x = np.linspace(0, 1, len(n))
    cut = 300 + 3200 * (np.sin(np.pi * x) if up else (1 - x) ** 1.5)
    env = np.sin(np.pi * x) ** 1.6 if up else (1 - x) ** 2 * np.minimum(1, x * 12)
    return _lp(n, cut) * env * amp


def whoosh():
    return _whoosh(.5)


def whoosh_short():
    return _whoosh(.28, amp=.17)


def whoosh_out():
    return _whoosh(.38, up=False, amp=.15)


def swell():
    d = 1.0
    t = _t(d)
    x = t / d
    n = _lp(rng.standard_normal(len(t)), 200 + 1400 * x) * .5
    tone = (np.sin(2 * np.pi * 220 * t) + .6 * np.sin(2 * np.pi * 330 * t)) * .25
    return (n + tone) * (x ** 1.5) * np.minimum(1, (1 - x) * 8) * .22


def shimmer():
    out = np.zeros(int(.7 * SR))
    for i, f in enumerate([2640, 3140, 3960, 4700]):
        t = _t(.4)
        s = np.sin(2 * np.pi * f * t) * _env(len(t), .002, .12) * .06
        o = int(i * .045 * SR)
        out[o:o + len(s)] += s
    return out


def _bell(freqs, d, amp, stagger=.07):
    out = np.zeros(int((d + stagger * len(freqs)) * SR))
    for i, f in enumerate(freqs):
        t = _t(d)
        s = (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * 2.01 * f * t) + .12 * np.sin(2 * np.pi * 3.0 * f * t))
        s *= _env(len(t), .004, d / 4)
        o = int(i * stagger * SR)
        out[o:o + len(s)] += s
    return out * amp


def chime():
    return _bell([659.3, 987.8, 1318.5], 1.8, .085)


def chime_small():
    return _bell([784.0, 1174.7], 1.0, .07, .06)


SOUNDS = {"pop": pop, "tick": tick, "type": type_, "click": click, "blip": blip, "whoosh": whoosh,
          "whoosh_short": whoosh_short, "whoosh_out": whoosh_out, "swell": swell, "shimmer": shimmer,
          "chime": chime, "chime_small": chime_small}


def sfx_track(cues, total):
    """cues: list of (absolute_time, name, gain). Returns stereo float array."""
    L = np.zeros(int((total + 2) * SR))
    R = np.zeros_like(L)
    cache = {}
    for at, name, g in cues:
        if name not in cache:
            cache[name] = SOUNDS[name]()
        s = cache[name] * g
        o = int(at * SR)
        if o >= len(L):
            continue
        s = s[:len(L) - o]
        pan = .5 + .12 * np.sin(at * 1.7)             # tiny stereo movement
        L[o:o + len(s)] += s * (1 - pan) * 1.4
        R[o:o + len(s)] += s * pan * 1.4
    n = int(total * SR)
    return np.stack([L[:n], R[:n]], 1)


def music_bed(total, bpm=84):
    """Soft ambient pad + gentle plucks. Cmaj9 – Am9 – Fmaj9 – G6/9."""
    def hz(m):
        return 440 * 2 ** ((m - 69) / 12)
    chords = [[48, 52, 55, 59, 62], [45, 48, 52, 55, 59], [41, 45, 48, 52, 55], [43, 47, 50, 52, 57]]
    bar = 60 / bpm * 4
    chord_len = bar * 2
    n = int(total * SR)
    t = np.arange(n) / SR
    pad = np.zeros(n)
    plk = np.zeros(n)
    k = 0
    start = 0.0
    while start < total:
        notes = chords[k % len(chords)]
        a, b = int(max(start - 1.0, 0) * SR), min(int((start + chord_len + 1.5) * SR), n)
        tt = t[a:b] - t[a]
        L = b - a
        env = np.minimum(1, tt / 1.6) * np.minimum(1, (L / SR - tt) / 1.8)
        for m in notes:
            f = hz(m)
            v = (np.sin(2 * np.pi * f * tt) + .5 * np.sin(2 * np.pi * (f + .35) * tt + 1)
                 + .18 * np.sin(2 * np.pi * 2 * f * tt))
            pad[a:b] += v * env * .05
        # plucks on chord tones an octave and a half up, every half beat… sparse
        step = 60 / bpm
        for j, p in enumerate(np.arange(start, start + chord_len - .01, step)):
            if p >= total or j % 4 == 3:
                continue
            m = notes[(j * 2) % len(notes)] + 24
            o = int(p * SR)
            d = int(.9 * SR)
            seg = min(d, n - o)
            tp = np.arange(seg) / SR
            plk[o:o + seg] += np.sin(2 * np.pi * hz(m) * tp) * np.exp(-tp / .22) * np.minimum(1, tp / .004) * .035
        start += chord_len
        k += 1
    mix = _lp(pad, 1800) + plk
    fade = np.minimum(1, t / 1.5) * np.minimum(1, (total - t) / 3.0)
    mix *= fade
    return np.stack([mix * .98, mix], 1)


def write_wav(path, x, peak=None):
    x = np.asarray(x, float)
    if peak:
        m = np.max(np.abs(x)) or 1
        x = x * (peak / m)
    x = np.clip(x, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
