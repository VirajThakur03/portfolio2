import { useMemo } from "react";
import { motion } from "framer-motion";

const lineItems = (text = "") => text.split("->").map((item) => item.trim()).filter(Boolean);

const InfoPanel = ({ node, onClose, onDeepDive }) => {
  const architecture = useMemo(() => lineItems(node?.architecture), [node]);
  if (!node) return null;

  return (
    <motion.aside initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className="hud-panel fixed right-4 top-20 z-30 max-h-[78vh] w-[min(420px,92vw)] overflow-y-auto p-4 scrollbar-thin">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">{node.category}</p>
          <h2 className="font-orbitron text-xl text-cyan-200">{node.name}</h2>
        </div>
        <button onClick={onClose} className="rounded border border-cyan-400/40 px-2 py-1 text-sm text-cyan-200 hover:bg-cyan-400/10">Close</button>
      </div>

      <p className="text-sm text-slate-200/90">{node.description}</p>

      {node.problem_solved ? (
        <div className="mt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Problem Solved</h3>
          <p className="mt-2 text-sm text-slate-200/90">{node.problem_solved}</p>
        </div>
      ) : null}

      {Array.isArray(node.impact_metrics) && node.impact_metrics.length ? (
        <div className="mt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Impact Metrics</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {node.impact_metrics.map((metric) => (
              <span key={metric} className="rounded-full border border-violet-400/35 bg-violet-400/10 px-3 py-1 text-xs text-violet-100">
                {metric}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Technologies</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {node.technologies.map((tech) => (
            <span key={tech} className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">{tech}</span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Architecture Diagram</h3>
        <div className="mt-2 rounded-lg border border-violet-400/40 bg-violet-500/10 p-3 text-xs text-violet-100">
          {architecture.length ? architecture.map((step, idx) => <p key={step}>{`${idx + 1}. ${step}`}</p>) : <p>{node.architecture}</p>}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Code Snippet</h3>
        <pre className="mt-2 overflow-x-auto rounded-lg border border-cyan-400/30 bg-slate-900/80 p-3 text-xs text-cyan-100"><code>{node.code_snippet}</code></pre>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        {node.category === "Projects" ? (
          <button
            onClick={() => onDeepDive?.(node)}
            className="rounded border border-emerald-400/40 px-3 py-1 text-emerald-200 hover:bg-emerald-400/10"
          >
            Deep Dive
          </button>
        ) : null}
        {node.github_link ? <a href={node.github_link} target="_blank" rel="noreferrer" className="rounded border border-cyan-400/40 px-3 py-1 text-cyan-200 hover:bg-cyan-400/10">GitHub</a> : null}
        {node.linkedin_link ? <a href={node.linkedin_link} target="_blank" rel="noreferrer" className="rounded border border-sky-400/40 px-3 py-1 text-sky-200 hover:bg-sky-400/10">LinkedIn</a> : null}
        {node.demo_link ? <a href={node.demo_link} target="_blank" rel="noreferrer" className="rounded border border-violet-400/40 px-3 py-1 text-violet-200 hover:bg-violet-400/10">{node.category === "Projects" ? "Live Proof" : "Open Resource"}</a> : null}
        {Array.isArray(node.proof_links)
          ? node.proof_links.slice(0, 2).map((proof) => (
              <a
                key={proof.url}
                href={proof.url}
                target="_blank"
                rel="noreferrer"
                className="rounded border border-amber-300/35 px-3 py-1 text-amber-100 hover:bg-amber-300/10"
              >
                {proof.label}
              </a>
            ))
          : null}
      </div>
    </motion.aside>
  );
};

export default InfoPanel;
