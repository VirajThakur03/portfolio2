import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import AIChat from "../components/AIChat";
import InfoPanel from "../components/InfoPanel";
import { nodes } from "../data/nodes";
import { connections } from "../data/connections";
import useHandGestureControls from "../hooks/useHandGestureControls";

const BrainScene = lazy(() => import("../components/BrainScene"));
const storySequence = ["about-viraj", "ai-systems", "lielens", "resume-analyzer", "backend", "contact"];
const quickFilters = {
  Projects: ["lielens", "resume-analyzer", "music-player", "skillo", "speech-emotion"],
  AI: ["ai-systems", "ml", "nlp", "lielens", "resume-analyzer", "speech-emotion"],
  Backend: ["backend", "apis", "db", "auth", "django", "flask"],
  Platforms: ["hackerrank", "codewars", "leetcode"]
};

const roleLensMap = {
  All: [],
  Backend: ["python", "django", "flask", "apis", "backend", "db", "auth", "music-player", "skillo", "resume-analyzer"],
  "AI/ML": ["python", "ml", "nlp", "ai-systems", "lielens", "resume-analyzer", "speech-emotion"],
  "Full-Stack": ["python", "django", "flask", "apis", "backend", "db", "auth", "lielens", "resume-analyzer", "music-player", "skillo"]
};

const timelineStages = [
  { label: "Learning Foundations", ids: ["python", "django", "flask", "ml", "nlp", "apis", "backend", "db", "auth"] },
  { label: "Projects Built", ids: ["lielens", "resume-analyzer", "music-player", "skillo", "speech-emotion"] },
  { label: "Impact And Proof", ids: ["about-viraj", "resume", "contact", "hackerrank", "codewars", "leetcode"] }
];

const HandDebugPreview = ({ open, handGesture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    let rafId = null;
    let mounted = true;

    const loop = async () => {
      if (!mounted) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const stream = handGesture.streamRef.current;

      if (video && stream && video.srcObject !== stream) {
        video.srcObject = stream;
        try {
          await video.play();
        } catch {
          // ignore autoplay blocks
        }
      }

      if (video && ctx && video.readyState >= 2) {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -w, 0, w, h);
        ctx.restore();

        const pts = handGesture.landmarksRef.current || [];
        for (let i = 0; i < pts.length; i += 1) {
          const p = pts[i];
          const x = (1 - p.x) * w;
          const y = p.y * h;
          ctx.beginPath();
          ctx.arc(x, y, i === 0 || i === 4 || i === 8 || i === 9 ? 4 : 2.4, 0, Math.PI * 2);
          ctx.fillStyle = i === 0 || i === 4 || i === 8 || i === 9 ? "#00e5ff" : "rgba(255,255,255,0.78)";
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      mounted = false;
      if (rafId) cancelAnimationFrame(rafId);
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [open, handGesture]);

  if (!open) return null;

  return (
    <div className="hud-panel fixed left-4 top-20 z-30 w-[min(290px,88vw)] p-2">
      <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-cyan-200">Hand Debug Preview</p>
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} width={320} height={180} className="w-full rounded border border-cyan-400/30 bg-slate-900" />
      <p className="mt-1 text-[10px] text-cyan-100/80">Dots: wrist, thumb tip, index tip, middle MCP</p>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState(null);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState([]);
  const [storyIndex, setStoryIndex] = useState(-1);
  const [autoStory, setAutoStory] = useState(false);
  const [aiOpen, setAiOpen] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [roleLens, setRoleLens] = useState("All");
  const [timelineMode, setTimelineMode] = useState(false);
  const [timelineStage, setTimelineStage] = useState(0);
  const [interactionMode, setInteractionMode] = useState("mouse");
  const [showHandPreview, setShowHandPreview] = useState(false);
  const [dominantHand, setDominantHand] = useState("auto");
  const handGestureEnabled = interactionMode !== "mouse";
  const handGesture = useHandGestureControls({ enabled: handGestureEnabled, dominantHand });

  const mobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const lensIds = useMemo(() => new Set(roleLensMap[roleLens] || []), [roleLens]);
  const timelineIds = useMemo(
    () => (timelineMode ? timelineStages[timelineStage]?.ids || [] : []),
    [timelineMode, timelineStage]
  );
  const lensColor = roleLens === "Backend" ? "#00e5ff" : roleLens === "AI/ML" ? "#7c4dff" : roleLens === "Full-Stack" ? "#18ffff" : "#00e5ff";

  const highlightedIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    const fromSearch = q
      ? nodes
          .filter(
            (n) =>
              n.name.toLowerCase().includes(q) ||
              n.category.toLowerCase().includes(q) ||
              n.description.toLowerCase().includes(q) ||
              n.technologies.some((t) => t.toLowerCase().includes(q))
          )
          .map((n) => n.id)
      : [];
    return new Set([...fromSearch, ...highlighted, ...Array.from(lensIds), ...timelineIds]);
  }, [query, highlighted, lensIds, timelineIds]);

  useEffect(() => {
    if (!autoStory) return undefined;

    const intervalId = setInterval(() => {
      setStoryIndex((prev) => {
        const next = prev + 1;
        if (next >= storySequence.length) {
          setAutoStory(false);
          return -1;
        }
        const node = nodes.find((n) => n.id === storySequence[next]);
        if (node) {
          setSelectedNode(node);
          setHighlighted([node.id]);
        }
        return next;
      });
    }, 3200);

    return () => clearInterval(intervalId);
  }, [autoStory]);

  useEffect(() => {
    if (!timelineMode) return undefined;

    setTimelineStage(0);
    const intervalId = setInterval(() => {
      setTimelineStage((prev) => (prev + 1) % timelineStages.length);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [timelineMode]);

  const stepStory = () => {
    setStoryIndex((prev) => {
      const next = prev + 1;
      if (next >= storySequence.length) return -1;
      const node = nodes.find((n) => n.id === storySequence[next]);
      if (node) {
        setSelectedNode(node);
        setHighlighted([node.id]);
      }
      return next;
    });
  };

  const applyQuickFilter = (ids) => {
    setStoryIndex(-1);
    setHighlighted(ids);
    if (ids[0]) {
      const focus = nodes.find((n) => n.id === ids[0]);
      setSelectedNode(focus || null);
    }
  };

  return (
    <main className="scan-grid brain-hero relative mx-auto max-w-7xl p-4 md:p-6">
      <motion.header initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="mb-5 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/70">The Engineering Brain</p>
        <h1 className="font-orbitron text-2xl text-cyan-100 md:text-4xl">Inside the Mind of Viraj Thakur</h1>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="status-pill rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-widest text-emerald-200">
            Currently Building
          </span>
          <span className="status-pill rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-widest text-cyan-100">
            Open To Roles
          </span>
          <a
            href="/portfolio2/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="status-pill rounded-full border border-violet-400/45 bg-violet-500/10 px-3 py-1 text-xs uppercase tracking-widest text-violet-100 hover:bg-violet-500/20"
          >
            View Resume
          </a>
        </div>
        <div className="mx-auto mt-4 max-w-2xl rounded-xl border border-emerald-300/35 bg-emerald-500/10 px-4 py-3 text-left">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/90">Hire Me</p>
          <p className="mt-1 text-sm text-emerald-50/95">
            Building AI + backend products end-to-end. Open to Software Engineer and AI Engineer roles.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="mailto:virajthakur.dev@gmail.com"
              className="rounded border border-emerald-300/45 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-wider text-emerald-100 hover:bg-emerald-400/20"
            >
              Email Viraj
            </a>
            <a
              href="https://www.linkedin.com/in/viraj-thakur03/"
              target="_blank"
              rel="noreferrer"
              className="rounded border border-cyan-300/45 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-wider text-cyan-100 hover:bg-cyan-500/20"
            >
              LinkedIn
            </a>
            <a
              href="/portfolio2/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded border border-violet-300/45 bg-violet-500/10 px-3 py-1 text-xs uppercase tracking-wider text-violet-100 hover:bg-violet-500/20"
            >
              Download Resume
            </a>
          </div>
        </div>
      </motion.header>

      <div className="mx-auto mb-4 max-w-3xl rounded-lg border border-cyan-400/25 bg-slate-950/55 px-4 py-2 text-center text-xs text-cyan-100/90">
        Click neuron to zoom and view achievements. Click same project neuron again for GitHub, or use Deep Dive in panel for project-level detail view.
      </div>

      <SearchBar value={query} onChange={setQuery} onClear={() => setQuery("")} />
      <HandDebugPreview open={showHandPreview && handGestureEnabled} handGesture={handGesture} />
      <AIChat onHighlight={setHighlighted} isOpen={aiOpen} onToggle={() => setAiOpen((v) => !v)} />
      <InfoPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onDeepDive={(node) => {
          if (node.category !== "Projects") return;
          navigate(`/projects#${node.id}`);
        }}
      />

      <div className="mb-4 mt-20 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={stepStory}
          className="rounded border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 font-orbitron text-sm text-cyan-200 hover:bg-cyan-500/20"
        >
          Explore Viraj's Brain
        </button>
        <button
          onClick={() => {
            setStoryIndex(-1);
            setHighlighted([]);
            setQuery("");
            setSelectedNode(null);
            setAutoStory(false);
          }}
          className="rounded border border-violet-400/40 bg-violet-500/10 px-4 py-2 font-orbitron text-sm text-violet-200 hover:bg-violet-500/20"
        >
          Reset Focus
        </button>
        <button
          onClick={() => {
            setAutoStory((v) => !v);
            if (storyIndex < 0) setStoryIndex(-1);
          }}
          className="rounded border border-cyan-300/40 bg-slate-900/70 px-4 py-2 font-orbitron text-sm text-cyan-100 hover:bg-cyan-500/15"
        >
          {autoStory ? "Stop Auto Story" : "Start Auto Story"}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {Object.entries(quickFilters).map(([label, ids]) => (
          <button
            key={label}
            onClick={() => applyQuickFilter(ids)}
            className="rounded-full border border-cyan-400/35 px-3 py-1 text-xs uppercase tracking-widest text-cyan-100 hover:bg-cyan-500/10"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-4 space-y-3 rounded-xl border border-cyan-400/25 bg-slate-950/45 p-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Object.keys(roleLensMap).map((lens) => (
            <button
              key={lens}
              onClick={() => setRoleLens(lens)}
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-widest ${
                roleLens === lens
                  ? "border-cyan-300/70 bg-cyan-500/20 text-cyan-100"
                  : "border-cyan-400/35 text-cyan-100 hover:bg-cyan-500/10"
              }`}
            >
              {lens}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setTimelineMode((v) => !v)}
            className="rounded border border-violet-400/45 bg-violet-500/10 px-3 py-1 text-xs uppercase tracking-widest text-violet-100 hover:bg-violet-500/20"
          >
            {timelineMode ? "Stop Career Timeline" : "Start Career Timeline"}
          </button>
          {timelineMode ? (
            <span className="text-xs uppercase tracking-widest text-cyan-100/90">
              Stage: {timelineStages[timelineStage].label}
            </span>
          ) : null}
        </div>
      </div>

      <div className="brain-shell">
        <Suspense
          fallback={
            <div className="flex h-[72vh] items-center justify-center rounded-2xl border border-cyan-400/20 bg-slate-950/40">
              <p className="font-orbitron text-cyan-200">Loading neural graph...</p>
            </div>
          }
        >
          <BrainScene
            nodes={nodes}
            connections={connections}
            onNodeSelect={(node) => {
              if (
                node.category === "Projects" &&
                selectedNode?.id === node.id &&
                node.github_link
              ) {
                window.open(node.github_link, "_blank", "noopener,noreferrer");
                return;
              }
              setSelectedNode(node);
              setStoryIndex(-1);
              setAutoStory(false);
            }}
            activeNodeId={selectedNode?.id}
            highlightedIds={highlightedIds}
            storyTargetId={storyIndex >= 0 ? storySequence[storyIndex] : null}
            focusTargetId={selectedNode?.id || (timelineMode ? timelineStages[timelineStage].ids[0] : null)}
            mobile={mobile}
            rotationSpeed={rotationSpeed}
            reducedMotion={reducedMotion}
            showLabels={showLabels}
            activeLensIds={lensIds}
            lensColor={lensColor}
            handGestureControlsRef={handGestureEnabled ? handGesture.controlsRef : null}
            interactionMode={interactionMode}
          />
        </Suspense>
      </div>

      {controlsOpen ? (
        <div className="hud-panel fixed bottom-4 right-4 z-30 w-[min(320px,90vw)] p-3">
          <div className="flex items-center justify-between">
            <p className="font-orbitron text-xs uppercase tracking-[0.25em] text-cyan-200">Neural Controls</p>
            <button
              onClick={() => setControlsOpen(false)}
              className="rounded border border-cyan-300/35 px-2 py-1 text-[10px] uppercase tracking-wider text-cyan-100 hover:bg-cyan-500/10"
            >
              Minimize
            </button>
          </div>
          <div className="mt-2">
            <label className="text-xs text-slate-300">Rotation Speed: {rotationSpeed.toFixed(1)}x</label>
            <input
              type="range"
              min="0.5"
              max="2.2"
              step="0.1"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(Number(e.target.value))}
              className="mt-1 w-full accent-cyan-400"
            />
          </div>
          <button
            onClick={() => setShowLabels((v) => !v)}
            className="mt-3 w-full rounded border border-cyan-300/35 bg-slate-900/75 px-3 py-2 text-xs uppercase tracking-wider text-cyan-100 hover:bg-cyan-500/10"
          >
            {showLabels ? "Hide Neuron Labels" : "Show Neuron Labels"}
          </button>
          <button
            onClick={() => setReducedMotion((v) => !v)}
            className="mt-2 w-full rounded border border-cyan-300/35 bg-slate-900/75 px-3 py-2 text-xs uppercase tracking-wider text-cyan-100 hover:bg-cyan-500/10"
          >
            {reducedMotion ? "Disable Reduced Motion" : "Enable Reduced Motion"}
          </button>
          <div className="mt-2 space-y-2">
            <p className="text-xs uppercase tracking-wider text-cyan-100/85">Control Mode</p>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: "mouse", label: "Mouse" },
                { id: "hand", label: "Hand" },
                { id: "both", label: "Both" }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setInteractionMode(mode.id)}
                  className={`rounded border px-2 py-1 text-[10px] uppercase tracking-wider ${
                    interactionMode === mode.id
                      ? "border-cyan-300/70 bg-cyan-500/20 text-cyan-100"
                      : "border-cyan-300/30 bg-slate-900/75 text-cyan-100 hover:bg-cyan-500/10"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowHandPreview((v) => !v)}
            disabled={!handGestureEnabled}
            className="mt-2 w-full rounded border border-cyan-300/35 bg-slate-900/75 px-3 py-2 text-xs uppercase tracking-wider text-cyan-100 hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {showHandPreview ? "Hide Hand Preview" : "Show Hand Preview"}
          </button>
          <div className="mt-2">
            <label className="text-xs uppercase tracking-wider text-cyan-100/85">Dominant Hand</label>
            <div className="mt-1 grid grid-cols-3 gap-1">
              {[
                { id: "auto", label: "Auto" },
                { id: "right", label: "Right" },
                { id: "left", label: "Left" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDominantHand(opt.id)}
                  disabled={!handGestureEnabled}
                  className={`rounded border px-2 py-1 text-[10px] uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-40 ${
                    dominantHand === opt.id
                      ? "border-cyan-300/70 bg-cyan-500/20 text-cyan-100"
                      : "border-cyan-300/30 bg-slate-900/75 text-cyan-100 hover:bg-cyan-500/10"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handGesture.startCalibration}
            disabled={!handGestureEnabled || handGesture.status.calibrationRunning}
            className="mt-2 w-full rounded border border-cyan-300/35 bg-slate-900/75 px-3 py-2 text-xs uppercase tracking-wider text-cyan-100 hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {handGesture.status.calibrationRunning ? `Calibrating... ${handGesture.status.calibrationProgress}%` : "Start 5s Calibration"}
          </button>
          {handGestureEnabled ? (
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-300 transition-all"
                style={{ width: `${Math.round((handGesture.status.confidence || 0) * 100)}%` }}
              />
            </div>
          ) : null}
          <p className="mt-2 text-xs text-cyan-100/90">
            Gesture Status: {handGestureEnabled ? (handGesture.status.error ? `Error - ${handGesture.status.error}` : handGesture.status.ready ? (handGesture.status.tracking ? `Tracking (${handGesture.status.gestureLabel})` : "Waiting for hand") : "Initializing camera...") : "Disabled"}
          </p>
          {handGestureEnabled ? (
            <p className="mt-1 text-xs text-cyan-100/80">
              Gesture FPS: {handGesture.status.fps || 0} | Mode: {handGesture.status.fpsMode} | Confidence: {Math.round((handGesture.status.confidence || 0) * 100)}%
            </p>
          ) : null}
          {handGestureEnabled ? (
            <p className="mt-1 text-xs text-cyan-100/80">
              Locks: rotate {handGesture.status.rotationLocked ? "locked" : "unlocked"} | zoom {handGesture.status.zoomLocked ? "locked" : "unlocked"} | calibration {handGesture.status.calibrationReady ? "ready" : "default"}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-cyan-100/80">
            How it works: wrist + palm orientation controls horizontal/vertical rotation; pinch distance controls zoom.
          </p>
          <p className="mt-2 text-xs text-cyan-100/90">
            {selectedNode
              ? `Focused Node: ${selectedNode.name}`
              : autoStory
                ? "Auto Story in progress..."
                : "Tip: hover neurons, click to zoom, or use quick filters."}
          </p>
        </div>
      ) : (
        <button
          onClick={() => setControlsOpen(true)}
          className="hud-panel fixed bottom-4 right-4 z-30 rounded-full px-4 py-2 font-orbitron text-xs uppercase tracking-wider text-cyan-100 hover:bg-cyan-500/10"
        >
          Open Controls
        </button>
      )}
    </main>
  );
};

export default Home;
