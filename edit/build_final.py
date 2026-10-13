#!/usr/bin/env python3
"""
Wristy — assemble the final competition video from the rendered scenes,
the transparent footage frames and Michel's real phone recordings.

  python3 edit/build_final.py <footage_dir> <output.mp4> [work_dir]

Cut points live in animation/edl.js. Footage files are matched by name
(e.g. "IMG_0622" matches "...IMG_0622.mov"). Needs ffmpeg and node.
The footage and the finished video are NOT stored in the repo.
"""
import glob, json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REN = os.path.join(ROOT, "renders")
FPS, AR = 30, 48000
TARGET_BYTES = 27_000_000          # leaves a safe margin under the 30,000,000-byte limit
LUFS = -16.0


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"command failed: {' '.join(cmd)}\n{r.stderr[-2000:]}")
    return r


def load_edl():
    js = ("const fs=require('fs'),vm=require('vm');const c={window:{}};"
          f"vm.runInNewContext(fs.readFileSync({json.dumps(os.path.join(ROOT, 'animation', 'edl.js'))},'utf8'),c);"
          "console.log(JSON.stringify(c.window.PT_EDL))")
    return json.loads(run(["node", "-e", js]).stdout)


def find(footage, name):
    hits = []
    for p in sorted(glob.glob(os.path.join(footage, f"*{name}*"))):
        stem = os.path.splitext(os.path.basename(p))[0]
        if stem.endswith(name) or f"{name}-" in stem:   # "X_3" must not match "X"
            hits.append(p)
    if not hits:
        sys.exit(f"missing footage for {name} in {footage}")
    return hits[0]


def gain_db(src, a, b):
    """Gain that brings this speech piece to LUFS (measured with loudnorm)."""
    r = run(["ffmpeg", "-hide_banner", "-ss", f"{a}", "-to", f"{b}", "-i", src, "-vn",
             "-af", "loudnorm=print_format=json", "-f", "null", "-"])
    txt = r.stderr[r.stderr.rindex("{"):]
    return LUFS - float(json.loads(txt)["input_i"])


def speech_chain(label_in, g, dur, label_out):
    # level, gentle high-pass, short fades (no clicks), limiter, fixed format
    return (f"[{label_in}]highpass=f=80,volume={g:.2f}dB,afade=t=in:d=0.03,"
            f"afade=t=out:st={max(dur - 0.05, 0):.3f}:d=0.05,alimiter=limit=0.84,"
            f"aresample={AR},aformat=sample_fmts=fltp:channel_layouts=stereo[{label_out}]")


ENC_V = ["-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p", "-r", str(FPS)]
ENC_A = ["-c:a", "aac", "-b:a", "192k", "-ar", str(AR), "-ac", "2"]


def scene_with_vo(name, scene_file, vo_list, footage, out):
    scene = os.path.join(REN, "scenes", scene_file)
    dur = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", scene]).stdout)
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", scene]
    parts, labels = [], []
    for i, (fname, a, b, at) in enumerate(vo_list or []):
        src = find(footage, fname)
        cmd += ["-ss", f"{a}", "-to", f"{b}", "-i", src]
        g = gain_db(src, a, b)
        parts.append(speech_chain(f"{i + 1}:a", g, b - a, f"p{i}") + f";[p{i}]adelay={int(at * 1000)}:all=1[d{i}]")
        labels.append(f"[d{i}]")
    parts.append(f"anullsrc=r={AR}:cl=stereo,atrim=0:{dur}[sil]")
    mix = "".join(labels) + "[sil]"
    parts.append(f"{mix}amix=inputs={len(labels) + 1}:normalize=0:duration=longest,atrim=0:{dur}[aout]")
    cmd += ["-filter_complex", ";".join(parts), "-map", "0:v", "-map", "[aout]", *ENC_V, *ENC_A, "-t", f"{dur}", out]
    run(cmd)


def presenter(seg, frame, footage, win, out):
    src = find(footage, seg["src"])
    a, b = seg["in"], seg["out"]
    dur = b - a
    g = gain_db(src, a, b)
    fc = (f"color=c=0x102A1F:s=1920x1080:r={FPS}:d={dur}[bg];"
          f"[0:v]scale={win['w']}:{win['h']}:flags=lanczos,setsar=1,fps={FPS}[v];"
          f"[bg][v]overlay={win['x']}:{win['y']}:shortest=1[b];[b][1:v]overlay=0:0:shortest=1[vo];"
          + speech_chain("0:a", g, dur, "ao"))
    run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-ss", f"{a}", "-to", f"{b}", "-i", src,
         "-i", os.path.join(REN, "frames", frame), "-filter_complex", fc, "-map", "[vo]", "-map", "[ao]",
         *ENC_V, *ENC_A, "-t", f"{dur}", out])


def demo(edl, footage, out):
    win, cy = edl["winDemo"], edl["demoCropY"]
    ch = round(1080 * win["h"] / win["w"])          # crop height that matches the window aspect
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"]
    fc, cat = [], ""
    total = 0.0
    for i, seg in enumerate(edl["demo"]):
        src = find(footage, seg["src"])
        a, b = seg["in"], seg["out"]
        d = b - a
        total += d
        cmd += ["-ss", f"{a}", "-to", f"{b}", "-i", src]
        g = gain_db(src, a, b)
        fc.append(f"[{i}:v]scale=1080:1920:flags=lanczos,setsar=1,crop=1080:{ch}:0:{cy},"
                  f"scale={win['w']}:{win['h']}:flags=lanczos,fps={FPS},trim=0:{d:.3f},setpts=PTS-STARTPTS[v{i}]")
        fc.append(speech_chain(f"{i}:a", g, d, f"a{i}") + f";[a{i}]atrim=0:{d:.3f},asetpts=PTS-STARTPTS[b{i}]")
        cat += f"[v{i}][b{i}]"
    n = len(edl["demo"])
    frame_idx = n
    cmd += ["-i", os.path.join(REN, "frames", "frame-demo.mov")]
    fc.append(f"{cat}concat=n={n}:v=1:a=1[cv][ca]")
    fc.append(f"color=c=0x102A1F:s=1920x1080:r={FPS}:d={total:.3f}[bg]")
    fc.append(f"[bg][cv]overlay={win['x']}:{win['y']}:shortest=1[b]")
    fc.append(f"[b][{frame_idx}:v]overlay=0:0:shortest=1[vo]")
    cmd += ["-filter_complex", ";".join(fc), "-map", "[vo]", "-map", "[ca]", *ENC_V, *ENC_A, "-t", f"{total:.3f}", out]
    run(cmd)


def probe(path):
    r = run(["ffprobe", "-v", "error", "-show_entries", "format=duration,size:stream=codec_type,width,height",
             "-of", "json", path])
    return json.loads(r.stdout)


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    footage, final = sys.argv[1], sys.argv[2]
    work = sys.argv[3] if len(sys.argv) > 3 else os.path.join(ROOT, "edit", "work")
    os.makedirs(work, exist_ok=True)
    edl = load_edl()
    vo = edl["vo"]
    W = lambda n: os.path.join(work, n)
    parts = [
        ("01", lambda o: scene_with_vo("title", "01-title.mp4", None, footage, o)),
        ("02", lambda o: presenter(edl["presenterA"], "frame-a.mov", footage, edl["winPresenter"], o)),
        ("03", lambda o: scene_with_vo("why", "02-why.mp4", vo.get("why"), footage, o)),
        ("04", lambda o: scene_with_vo("pipeline", "03-pipeline.mp4", vo.get("pipeline"), footage, o)),
        ("05", lambda o: scene_with_vo("future", "04-future.mp4", vo.get("future"), footage, o)),
        ("06", lambda o: demo(edl, footage, o)),
        ("07", lambda o: scene_with_vo("cost", "05-cost.mp4", vo.get("cost"), footage, o)),
        ("08", lambda o: presenter(edl["presenterB"], "frame-b.mov", footage, edl.get("winPresenterB", edl["winPresenter"]), o)),
        ("09", lambda o: scene_with_vo("closing", "06-closing.mp4", None, footage, o)),
    ]
    files = []
    for tag, fn in parts:
        out = W(f"part{tag}.mp4")
        fn(out)
        d = float(probe(out)["format"]["duration"])
        print(f"part {tag}: {d:6.2f} s")
        files.append(out)
    lst = W("list.txt")
    with open(lst, "w") as f:
        f.writelines(f"file '{p}'\n" for p in files)
    master = W("master.mp4")
    run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", master])
    dur = float(probe(master)["format"]["duration"])

    # final: two-pass H.264 sized to TARGET_BYTES, AAC 128k
    vk = int((TARGET_BYTES * 8 / dur - 128_000) / 1000)
    common = ["-c:v", "libx264", "-preset", "slow", "-b:v", f"{vk}k", "-pix_fmt", "yuv420p", "-r", str(FPS)]
    plog = W("x264pass")
    run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", master, *common, "-pass", "1",
         "-passlogfile", plog, "-an", "-f", "mp4", os.devnull])
    run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", master, *common, "-pass", "2",
         "-passlogfile", plog, "-c:a", "aac", "-b:a", "128k", "-ar", str(AR), "-movflags", "+faststart", final])

    # verification
    info = probe(final)
    size, d = int(info["format"]["size"]), float(info["format"]["duration"])
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    has_a = any(s["codec_type"] == "audio" for s in info["streams"])
    vd = run(["ffmpeg", "-hide_banner", "-i", final, "-af", "volumedetect", "-vn", "-f", "null", "-"]).stderr
    mean = float(vd.split("mean_volume:")[1].split("dB")[0])
    mx = float(vd.split("max_volume:")[1].split("dB")[0])
    checks = {
        f"duration {d:.2f} s within 30–90 s": 30 <= d <= 90,
        f"landscape {v['width']}x{v['height']}": v["width"] > v["height"],
        f"size {size:,} bytes < 30,000,000": size < 30_000_000,
        f"audio present, mean {mean} dB / max {mx} dB (audible)": has_a and mean > -40,
    }
    print(f"\nfinal: {final}")
    for k, ok in checks.items():
        print(("PASS " if ok else "FAIL ") + k)
    if not all(checks.values()):
        sys.exit(1)


if __name__ == "__main__":
    main()
