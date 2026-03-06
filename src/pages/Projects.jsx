import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform
} from "framer-motion";
import { useLocation } from "react-router-dom";
import { nodes } from "../data/nodes";

const projects = nodes.filter((n) => n.category === "Projects");
const featuredOrder = ["lielens", "resume-analyzer", "music-player", "skillo", "speech-emotion"];

const mediaByProject = {
  lielens: [
    { type: "image", label: "Analysis Output", src: "/project-media/lielens/lielens-analysis.png" },
    { type: "image", label: "Risk Dashboard", src: "/project-media/lielens/lielens-dashboard.png" },
    { type: "image", label: "Signup Flow", src: "/project-media/lielens/lielens-signup.png" },
    { type: "video", label: "Live Demo", src: "/project-media/lielens/lielensproject.mp4" }
  ],
  "resume-analyzer": [
    { type: "image", label: "Portfolio Home View", src: "/project-media/resume-analyzer/resume-analyzer-home.png" },
    { type: "image", label: "Signup Screen", src: "/project-media/resume-analyzer/resume-analyzer-signup.png" },
    { type: "image", label: "Analyzer Report", src: "/project-media/resume-analyzer/resume-analyzer-report.png" },
    { type: "video", label: "Live Demo", src: "/project-media/resume-analyzer/resumeanalyzerproject.mp4" }
  ],
  "music-player": [
    { type: "image", label: "Now Playing Screen", src: "/project-media/music-player/music-player-main.png" },
    { type: "image", label: "Song Selection View", src: "/project-media/music-player/music-player-dropdown.png" },
    { type: "video", label: "Live Demo", src: "/project-media/music-player/musicplayerproject.mp4" }
  ],
  skillo: [
    { type: "image", label: "Auth Screen", src: "/project-media/skillo/skillo-auth.png" },
    { type: "image", label: "Marketplace View", src: "/project-media/skillo/skillo-marketplace.png" },
    { type: "image", label: "Provider Dashboard", src: "/project-media/skillo/skillo-provider-dashboard.png" },
    { type: "video", label: "Live Demo", src: "/project-media/skillo/skillo.mp4" }
  ],
  "speech-emotion": [
    { type: "image", label: "Audio Upload Screen", src: "/project-media/speech-emotion/speech-upload.png" },
    { type: "image", label: "Prediction Result", src: "/project-media/speech-emotion/speech-result.png" },
    { type: "image", label: "Record Audio Flow", src: "/project-media/speech-emotion/speech-record.png" },
    { type: "video", label: "Live Demo", src: "/project-media/speech-emotion/speech.mp4" }
  ]
};

const projectDNA = {
  lielens: {
    accent: "#00e5ff",
    accentSoft: "rgba(0,229,255,0.16)",
    accentClass: "text-cyan-100",
    borderClass: "border-cyan-300/55",
    glowClass: "shadow-[0_0_44px_rgba(0,229,255,0.24)]",
    stageClass: "dna-cyan",
    motion: { yIn: 110, yOut: -90, scaleIn: 0.92, scaleOut: 0.95 },
    timeline: ["Problem", "Build", "Breakthrough", "Impact"],
    metrics: [
      { label: "Risk Signals", value: 83, suffix: "%" },
      { label: "Response Time", value: 2, suffix: "s" },
      { label: "Model Influence", value: 83, suffix: "%" }
    ],
    architecture: [
      { id: "input", label: "Input Layer", detail: "Text capture + validation", level: "UI" },
      { id: "api", label: "Django API", detail: "Routing + scoring request", level: "API" },
      { id: "nlp", label: "NLP Features", detail: "Linguistic signal extraction", level: "ML" },
      { id: "model", label: "Classifier", detail: "Risk + credibility inference", level: "Model" },
      { id: "result", label: "Explanation", detail: "Readable output and rewrites", level: "UX" }
    ]
  },
  "resume-analyzer": {
    accent: "#6f86ff",
    accentSoft: "rgba(111,134,255,0.18)",
    accentClass: "text-indigo-100",
    borderClass: "border-indigo-300/55",
    glowClass: "shadow-[0_0_44px_rgba(111,134,255,0.25)]",
    stageClass: "dna-indigo",
    motion: { yIn: 96, yOut: -78, scaleIn: 0.93, scaleOut: 0.97 },
    timeline: ["Problem", "Build", "ATS Analysis", "Impact"],
    metrics: [
      { label: "Resume Score", value: 79, suffix: "" },
      { label: "Input Modes", value: 2, suffix: "" },
      { label: "Feedback Coverage", value: 90, suffix: "%" }
    ],
    architecture: [
      { id: "upload", label: "Resume Upload", detail: "PDF/TXT ingestion + parsing", level: "UI" },
      { id: "extract", label: "Text Extraction", detail: "Section and keyword extraction", level: "NLP" },
      { id: "match", label: "ATS Match", detail: "Role keyword gap detection", level: "Engine" },
      { id: "score", label: "Scoring", detail: "Section-wise weighted score synthesis", level: "Model" },
      { id: "report", label: "Report View", detail: "Actionable feedback + recommendations", level: "UX" }
    ]
  },
  "music-player": {
    accent: "#7c4dff",
    accentSoft: "rgba(124,77,255,0.18)",
    accentClass: "text-violet-100",
    borderClass: "border-violet-300/55",
    glowClass: "shadow-[0_0_44px_rgba(124,77,255,0.26)]",
    stageClass: "dna-violet",
    motion: { yIn: 95, yOut: -70, scaleIn: 0.93, scaleOut: 0.97 },
    timeline: ["Problem", "Build", "Playback Engine", "Impact"],
    metrics: [
      { label: "Playlists", value: 18, suffix: "+" },
      { label: "Routes", value: 7, suffix: "" },
      { label: "Media Coverage", value: 100, suffix: "%" }
    ],
    architecture: [
      { id: "ui", label: "Template UI", detail: "Song list + controls", level: "UI" },
      { id: "router", label: "Django Views", detail: "Song/playback handlers", level: "API" },
      { id: "db", label: "Track DB", detail: "Playlist + metadata models", level: "DB" },
      { id: "player", label: "Browser Player", detail: "Audio stream + controls", level: "Runtime" },
      { id: "lyrics", label: "Lyric Sync", detail: "Pattern-based timeline text", level: "Feature" }
    ]
  },
  skillo: {
    accent: "#18ffff",
    accentSoft: "rgba(24,255,255,0.15)",
    accentClass: "text-teal-100",
    borderClass: "border-teal-300/55",
    glowClass: "shadow-[0_0_44px_rgba(24,255,255,0.22)]",
    stageClass: "dna-teal",
    motion: { yIn: 90, yOut: -75, scaleIn: 0.93, scaleOut: 0.96 },
    timeline: ["Problem", "Build", "Marketplace Loop", "Impact"],
    metrics: [
      { label: "Service Types", value: 5, suffix: "+" },
      { label: "User Roles", value: 2, suffix: "" },
      { label: "Flow Coverage", value: 92, suffix: "%" }
    ],
    architecture: [
      { id: "auth", label: "Auth Layer", detail: "Seeker/provider role onboarding", level: "Auth" },
      { id: "search", label: "Discovery", detail: "Skill + location query", level: "Search" },
      { id: "booking", label: "Booking Flow", detail: "Request, accept, complete", level: "Workflow" },
      { id: "wallet", label: "Wallet", detail: "Rate + wallet summary", level: "Finance" },
      { id: "dash", label: "Dashboards", detail: "Provider status + jobs", level: "UX" }
    ]
  },
  "speech-emotion": {
    accent: "#ff5f9e",
    accentSoft: "rgba(255,95,158,0.18)",
    accentClass: "text-pink-100",
    borderClass: "border-pink-300/55",
    glowClass: "shadow-[0_0_44px_rgba(255,95,158,0.25)]",
    stageClass: "dna-pink",
    motion: { yIn: 110, yOut: -95, scaleIn: 0.91, scaleOut: 0.95 },
    timeline: ["Problem", "Build", "Inference", "Impact"],
    metrics: [
      { label: "MFCC Features", value: 40, suffix: "" },
      { label: "Input Modes", value: 2, suffix: "" },
      { label: "Pipeline Steps", value: 5, suffix: "" }
    ],
    architecture: [
      { id: "input", label: "Audio Input", detail: "Upload or record voice clip", level: "UI" },
      { id: "prep", label: "Preprocessing", detail: "Waveform cleanup + framing", level: "DSP" },
      { id: "feat", label: "Feature Build", detail: "MFCC extraction", level: "ML" },
      { id: "infer", label: "Model Inference", detail: "Emotion classification", level: "Model" },
      { id: "result", label: "Result Layer", detail: "Predicted emotion response", level: "UX" }
    ]
  }
};

const animateCount = (from, to, onUpdate, duration = 900) => {
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = from + (to - from) * eased;
    onUpdate(Math.round(val));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const ArchitectureLayer = ({ dna }) => {
  const [activeNode, setActiveNode] = useState(dna.architecture[0]?.id);

  return (
    <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/50 p-3">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-300/90">Architecture Layer</p>
      <div className="mt-3 grid gap-2 md:grid-cols-5">
        {dna.architecture.map((node) => (
          <button
            key={node.id}
            onMouseEnter={() => setActiveNode(node.id)}
            onFocus={() => setActiveNode(node.id)}
            className={`rounded-lg border px-2 py-3 text-left text-xs transition ${
              activeNode === node.id
                ? "border-white/40 bg-white/10 text-white"
                : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/25"
            }`}
          >
            <p className="font-semibold">{node.label}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider opacity-85">{node.level}</p>
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-lg border border-white/10 bg-slate-900/65 p-3 text-sm text-slate-200/95">
        {dna.architecture.find((n) => n.id === activeNode)?.detail}
      </div>
    </div>
  );
};

const TechHeatSignature = ({ tech, accent }) => (
  <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/55 p-3">
    <p className="text-xs uppercase tracking-[0.22em] text-slate-300/90">Tech Heat Signature</p>
    <div className="mt-3 flex flex-wrap gap-2">
      {tech.map((item, idx) => {
        const intensity = 0.25 + ((idx % 4) + 1) * 0.18;
        return (
          <span
            key={item}
            className="rounded-full border px-3 py-1 text-xs uppercase tracking-wider text-slate-100"
            style={{
              borderColor: `rgba(255,255,255,${intensity * 0.65})`,
              background: `radial-gradient(circle at 30% 20%, ${accent}, rgba(8,15,28,0.4))`,
              boxShadow: `0 0 12px rgba(0,0,0,0.25), 0 0 ${6 + intensity * 18}px ${accent}`
            }}
          >
            {item}
          </span>
        );
      })}
    </div>
  </div>
);

const SignalTimeline = ({ timeline, accent }) => (
  <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/55 p-3">
    <p className="text-xs uppercase tracking-[0.22em] text-slate-300/90">Signal Timeline</p>
    <div className="mt-3 grid gap-2 sm:grid-cols-4">
      {timeline.map((step, idx) => (
        <motion.div
          key={step}
          initial={{ opacity: 0.3, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ delay: idx * 0.08 }}
          className="relative rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-xs text-slate-100"
        >
          <span className="absolute -left-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
          {step}
        </motion.div>
      ))}
    </div>
  </div>
);

const MetricsBoard = ({ metrics, isVisible }) => {
  const [vals, setVals] = useState(metrics.map(() => 0));

  useEffect(() => {
    if (!isVisible) return;
    metrics.forEach((m, idx) => {
      animateCount(0, m.value, (next) => {
        setVals((prev) => {
          const clone = [...prev];
          clone[idx] = next;
          return clone;
        });
      });
    });
  }, [isVisible, metrics]);

  return (
    <div className="mt-5 grid gap-2 sm:grid-cols-3">
      {metrics.map((m, idx) => (
        <div key={m.label} className="rounded-xl border border-white/15 bg-slate-900/75 px-3 py-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{m.label}</p>
          <p className="mt-1 font-orbitron text-xl text-white">
            {vals[idx]}
            {m.suffix}
          </p>
        </div>
      ))}
    </div>
  );
};

const FeaturedProjectStage = ({
  project,
  stageIndex,
  active,
  onVisible,
  registerStageRef
}) => {
  const [activeMedia, setActiveMedia] = useState(0);
  const [storyMode, setStoryMode] = useState(true);
  const [ambientOn, setAmbientOn] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glowX: 50, glowY: 50 });
  const stageRef = useRef(null);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);

  const media = mediaByProject[project.id] || [];
  const dna = projectDNA[project.id] || projectDNA.lielens;
  const inView = useInView(stageRef, { amount: 0.45, margin: "-20% 0px -20% 0px" });
  const imageIndexes = media.map((m, idx) => ({ ...m, idx })).filter((m) => m.type === "image");
  const mediaItem = media[activeMedia];

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"]
  });

  const stageY = useTransform(scrollYProgress, [0, 0.5, 1], [dna.motion.yIn, 0, dna.motion.yOut]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.17, 0.82, 1], [0.15, 1, 1, 0.2]);
  const stageScale = useTransform(scrollYProgress, [0, 0.5, 1], [dna.motion.scaleIn, 1, dna.motion.scaleOut]);
  const mediaLift = useTransform(scrollYProgress, [0, 0.5, 1], [35, 0, -30]);
  const wipeOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 0, 0, 0.75]);
  const sweepX = useTransform(scrollYProgress, [0, 1], ["-26%", "64%"]);

  useEffect(() => {
    if (inView) onVisible(stageIndex);
  }, [inView, onVisible, stageIndex]);

  useEffect(() => {
    if (!storyMode || !imageIndexes.length) return;
    const unsub = scrollYProgress.on("change", (p) => {
      const i = Math.min(imageIndexes.length - 1, Math.max(0, Math.floor(p * imageIndexes.length)));
      const idx = imageIndexes[i]?.idx ?? 0;
      setActiveMedia((prev) => (prev === idx ? prev : idx));
    });
    return () => unsub();
  }, [scrollYProgress, storyMode, imageIndexes]);

  useEffect(() => () => {
    if (oscRef.current) oscRef.current.stop();
    if (audioCtxRef.current) audioCtxRef.current.close();
  }, []);

  const toggleAmbient = async () => {
    if (ambientOn) {
      setAmbientOn(false);
      if (gainRef.current) gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.08);
      return;
    }

    if (!audioCtxRef.current) {
      const ctx = new window.AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = project.id === "music-player" ? 86 : project.id === "speech-emotion" ? 132 : 110;
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      audioCtxRef.current = ctx;
      oscRef.current = osc;
      gainRef.current = gain;
    }
    await audioCtxRef.current.resume();
    gainRef.current.gain.setTargetAtTime(0.014, audioCtxRef.current.currentTime, 0.18);
    setAmbientOn(true);
  };

  const onCardMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    const dx = px - 50;
    const dy = py - 50;
    setTilt({
      x: -(dy / 9),
      y: dx / 9,
      glowX: px,
      glowY: py
    });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0, glowX: 50, glowY: 50 });

  return (
    <section
      ref={(el) => {
        stageRef.current = el;
        registerStageRef(stageIndex, el);
      }}
      id={`project-${project.id}`}
      className={`project-stage relative min-h-[130vh] py-20 ${dna.stageClass}`}
    >
      <motion.div style={{ opacity: wipeOpacity }} className="project-wipe" />
      <motion.div style={{ x: sweepX }} className="project-sweep" />

      <div className="sticky top-20">
        <motion.article
          style={{ y: stageY, opacity: stageOpacity, scale: stageScale }}
          className={`rounded-3xl border bg-slate-950/60 p-6 backdrop-blur-xl transition duration-500 md:p-8 ${active ? `${dna.borderClass} ${dna.glowClass}` : "border-slate-600/30 shadow-[0_0_22px_rgba(0,0,0,0.24)]"}`}
        >
          <div className="grid gap-7 lg:grid-cols-[1.03fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300/85">Featured Build</p>
              <h2 className={`mt-2 font-orbitron text-3xl md:text-4xl ${dna.accentClass}`}>{project.name}</h2>
              <p className="mt-3 text-base text-slate-200/95">{project.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setStoryMode((v) => !v)}
                  className={`rounded border px-3 py-1 text-xs uppercase tracking-wider ${storyMode ? "border-emerald-300/45 bg-emerald-500/20 text-emerald-100" : "border-slate-500/40 bg-slate-800/60 text-slate-200"}`}
                >
                  Story Mode {storyMode ? "On" : "Off"}
                </button>
                <button
                  onClick={toggleAmbient}
                  className={`rounded border px-3 py-1 text-xs uppercase tracking-wider ${ambientOn ? "border-violet-300/45 bg-violet-500/20 text-violet-100" : "border-slate-500/40 bg-slate-800/60 text-slate-200"}`}
                >
                  Ambient {ambientOn ? "On" : "Off"}
                </button>
              </div>

              <SignalTimeline timeline={dna.timeline} accent={dna.accent} />

              <MetricsBoard metrics={dna.metrics} isVisible={inView} />

              <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300/90">Problem Solved</p>
                <p className="mt-2 text-sm text-slate-100/95">{project.problem_solved}</p>
              </div>

              <TechHeatSignature tech={project.technologies} accent={dna.accent} />

              <ArchitectureLayer dna={dna} />

              <div className="mt-5 flex flex-wrap gap-2">
                <a href={project.github_link} target="_blank" rel="noreferrer" className="rounded border border-cyan-300/45 px-3 py-1 text-sm text-cyan-100 hover:bg-cyan-400/10">
                  View GitHub
                </a>
                {project.demo_link ? (
                  <a href={project.demo_link} target="_blank" rel="noreferrer" className="rounded border border-violet-400/45 px-3 py-1 text-sm text-violet-100 hover:bg-violet-400/10">
                    Live Proof
                  </a>
                ) : null}
              </div>
            </div>

            <div>
              <motion.div
                style={{
                  y: mediaLift,
                  rotateX: tilt.x,
                  rotateY: tilt.y
                }}
                onMouseMove={onCardMove}
                onMouseLeave={resetTilt}
                className="media-light-card overflow-hidden rounded-2xl border border-white/20 bg-slate-900/70 [transform-style:preserve-3d]"
              >
                <div
                  className="media-light-overlay"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, ${dna.accentSoft} 0%, transparent 56%)`
                  }}
                />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mediaItem?.src || `${project.id}-${activeMedia}`}
                    initial={{ opacity: 0, y: 20, scale: 1.02 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    {mediaItem?.type === "video" ? (
                      <video src={mediaItem.src} controls className="aspect-video w-full bg-black/70 object-cover" />
                    ) : (
                      <img src={mediaItem?.src} alt={mediaItem?.label || project.name} className="aspect-video w-full object-cover" />
                    )}
                  </motion.div>
                </AnimatePresence>
                <div className="border-t border-white/10 px-3 py-2 text-xs uppercase tracking-wider text-slate-100/90">
                  {mediaItem?.label}
                </div>
              </motion.div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {media.map((item, idx) => (
                  <motion.button
                    key={`${item.label}-${item.src}`}
                    onClick={() => {
                      setStoryMode(false);
                      setActiveMedia(idx);
                    }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className={`overflow-hidden rounded-lg border text-left transition ${
                      activeMedia === idx
                        ? "border-white/60 bg-white/10"
                        : "border-white/15 bg-slate-900/65 hover:bg-slate-800/75"
                    }`}
                  >
                    <div className="aspect-video w-full">
                      {item.type === "video" ? (
                        <video src={item.src} muted className="h-full w-full object-cover" />
                      ) : (
                        <img src={item.src} alt={item.label} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <p className="px-2 py-1 text-[11px] uppercase tracking-wider text-slate-100/90">{item.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
};

const Projects = () => {
  const location = useLocation();
  const activeId = location.hash?.replace("#", "") || "";
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [trackMode, setTrackMode] = useState("Recruiter");
  const sectionRef = useRef(null);
  const stageElsRef = useRef([]);

  const featuredProjects = useMemo(
    () => featuredOrder.map((id) => projects.find((p) => p.id === id)).filter(Boolean),
    []
  );

  const remainingProjects = useMemo(
    () => projects.filter((p) => !featuredOrder.includes(p.id)),
    []
  );

  const trackCopy = {
    Recruiter: "Fast scan: outcome metrics, stack depth, and production readiness.",
    Founder: "Focus on product leverage: speed to build, user-facing value, and iteration loop.",
    Engineer: "Deep dive into architecture, tradeoffs, and implementation details."
  };

  const { scrollYProgress: pageProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });
  const progressScaleX = useTransform(pageProgress, [0, 1], [0, 1]);

  useEffect(() => {
    if (!activeId) return;
    const el = document.getElementById(`project-${activeId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeId]);

  useEffect(() => {
    const onScroll = () => {
      const stageEls = stageElsRef.current.filter(Boolean);
      if (!stageEls.length) return;
      const viewportAnchor = window.innerHeight * 0.45;

      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      stageEls.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - viewportAnchor);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });

      setActiveStageIndex((prev) => (prev === bestIdx ? prev : bestIdx));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="project-cosmos relative mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-cyan-400/10 via-violet-500/10 to-transparent blur-2xl" />
      <motion.div style={{ scaleX: progressScaleX }} className="fixed left-0 right-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-cyan-300 via-violet-400 to-emerald-300" />

      <div className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
        {featuredProjects.map((project, idx) => (
          <div key={project.id} className="flex items-center gap-2">
            <motion.span
              animate={{ scaleX: idx <= activeStageIndex ? 1 : 0.45, opacity: idx <= activeStageIndex ? 1 : 0.45 }}
              transition={{ duration: 0.25 }}
              className={`h-[2px] w-10 origin-left rounded-full ${idx <= activeStageIndex ? "bg-cyan-300" : "bg-slate-600/70"}`}
            />
            <motion.span
              animate={idx === activeStageIndex ? { scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] } : { scale: 1, opacity: 0.7 }}
              transition={{ duration: 1.1, repeat: idx === activeStageIndex ? Infinity : 0, ease: "easeInOut" }}
              className={`h-2.5 w-2.5 rounded-full ${idx === activeStageIndex ? "bg-cyan-300 shadow-[0_0_16px_rgba(0,229,255,0.95)]" : "bg-slate-500/80"}`}
            />
          </div>
        ))}
      </div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6 rounded-2xl border border-cyan-400/25 bg-slate-950/55 p-5 text-center backdrop-blur"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          {[...Array(12)].map((_, i) => (
            <motion.span
              key={`spark-${i}`}
              className="absolute h-1 w-1 rounded-full bg-cyan-200/70"
              style={{ left: `${8 + i * 7}%`, top: `${12 + (i % 5) * 14}%` }}
              animate={{ y: [-6, 8, -6], opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 2.6 + (i % 5) * 0.4, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Project Showcase</p>
        <h1 className="mt-2 font-orbitron text-2xl text-cyan-100 md:text-4xl">Futuristic Build Story</h1>
        <p className="mx-auto mt-3 max-w-3xl text-sm text-slate-300/95">
          Distinct visual DNA, cinematic stage transitions, architecture interaction, and dynamic metrics for each project.
        </p>
      </motion.header>

      {featuredProjects.map((project, idx) => (
        <FeaturedProjectStage
          key={project.id}
          project={project}
          stageIndex={idx}
          active={idx === activeStageIndex || activeId === project.id}
          onVisible={setActiveStageIndex}
          registerStageRef={(stageIdx, el) => {
            stageElsRef.current[stageIdx] = el;
          }}
        />
      ))}

      {remainingProjects.length ? (
        <div className="mt-8 rounded-2xl border border-cyan-400/25 bg-slate-950/50 p-5">
          <h2 className="font-orbitron text-xl text-cyan-100">Archive Nodes</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {remainingProjects.map((project) => (
              <motion.article
                key={project.id}
                id={`project-${project.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                className="rounded-xl border border-cyan-500/25 bg-slate-900/55 p-4"
              >
                <h3 className="font-orbitron text-lg text-cyan-100">{project.name}</h3>
                <p className="mt-2 text-sm text-slate-300/95">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="rounded-full border border-cyan-400/30 px-2 py-1 text-xs text-cyan-100">{tech}</span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={project.github_link} target="_blank" rel="noreferrer" className="rounded border border-cyan-400/35 px-3 py-1 text-sm text-cyan-200 hover:bg-cyan-400/10">View GitHub</a>
                  {project.demo_link ? (
                    <a href={project.demo_link} target="_blank" rel="noreferrer" className="rounded border border-violet-400/35 px-3 py-1 text-sm text-violet-200 hover:bg-violet-400/10">Live Proof</a>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-10 rounded-2xl border border-cyan-400/30 bg-slate-950/55 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/75">Choose Your Track</p>
        <h2 className="mt-2 font-orbitron text-xl text-cyan-100 md:text-2xl">How Do You Want To Evaluate My Work?</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Recruiter", "Founder", "Engineer"].map((mode) => (
            <button
              key={mode}
              onClick={() => setTrackMode(mode)}
              className={`rounded border px-3 py-1 text-xs uppercase tracking-wider ${
                trackMode === mode
                  ? "border-cyan-300/65 bg-cyan-500/20 text-cyan-100"
                  : "border-cyan-500/30 bg-slate-900/60 text-slate-200 hover:bg-cyan-500/10"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-200/95">{trackCopy[trackMode]}</p>
      </div>
    </section>
  );
};

export default Projects;
