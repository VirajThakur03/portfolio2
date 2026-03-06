import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const AIChat = ({ onHighlight, isOpen, onToggle }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello, I am Viraj's engineering assistant. Ask: show projects, show AI work, show backend skills."
    }
  ]);
  const [input, setInput] = useState("");

  const suggestions = useMemo(
    () => ["show projects", "show AI work", "show backend skills", "show coding platforms"],
    []
  );

  const resolveIntent = (query) => {
    const q = query.toLowerCase();
    if (q.includes("project")) return ["lielens", "resume-analyzer", "music-player", "skillo", "speech-emotion"];
    if (q.includes("ai") || q.includes("nlp") || q.includes("ml")) return ["ai-systems", "nlp", "ml", "lielens", "resume-analyzer", "speech-emotion"];
    if (q.includes("backend") || q.includes("api") || q.includes("auth")) return ["backend", "apis", "auth", "db", "django", "flask"];
    if (q.includes("platform") || q.includes("leetcode") || q.includes("codewars") || q.includes("hackerrank")) {
      return ["hackerrank", "leetcode", "codewars"];
    }
    return ["about-viraj", "python", "backend"];
  };

  const send = (text) => {
    const finalText = text.trim();
    if (!finalText) return;
    const highlighted = resolveIntent(finalText);
    onHighlight(highlighted);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: finalText },
      { role: "assistant", text: `Highlighting ${highlighted.length} relevant neurons.` }
    ]);
    setInput("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 left-4 z-30 rounded-full border border-cyan-300/50 bg-slate-950/75 px-4 py-2 font-orbitron text-xs uppercase tracking-widest text-cyan-100 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:bg-cyan-500/15"
      >
        Open AI Guide
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="hud-panel fixed bottom-4 left-4 z-30 w-[min(420px,92vw)] p-3"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-orbitron text-sm text-cyan-200">AI Node Guide</h3>
        <button onClick={onToggle} className="rounded border border-cyan-400/40 px-2 py-1 text-[11px] text-cyan-100 hover:bg-cyan-400/10">
          Close
        </button>
      </div>

      <div className="mt-2 h-36 space-y-2 overflow-y-auto pr-1 text-sm scrollbar-thin">
        {messages.map((msg, i) => (
          <p key={`${msg.role}-${i}`} className={msg.role === "assistant" ? "text-cyan-100" : "text-violet-200"}>
            <span className="mr-1 font-semibold uppercase text-xs">{msg.role}:</span>
            {msg.text}
          </p>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="rounded border border-cyan-400/30 px-2 py-1 text-xs text-cyan-200 hover:bg-cyan-400/10"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask assistant..."
          className="w-full rounded border border-cyan-400/30 bg-slate-900/70 px-3 py-2 text-sm outline-none"
          onKeyDown={(e) => e.key === "Enter" && send(input)}
        />
        <button onClick={() => send(input)} className="rounded border border-violet-400/40 px-3 py-2 text-xs text-violet-200 hover:bg-violet-400/10">
          Send
        </button>
      </div>
    </motion.div>
  );
};

export default AIChat;
