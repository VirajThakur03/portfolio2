const SearchBar = ({ value, onChange, onClear }) => (
  <div className="hud-panel fixed left-4 top-20 z-30 w-[min(420px,92vw)] p-3">
    <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-cyan-300/70">Search Skills / Projects</label>
    <div className="flex gap-2">
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Try: NLP, backend, LieLens" className="w-full rounded border border-cyan-400/30 bg-slate-900/70 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-cyan-300" />
      <button onClick={onClear} className="rounded border border-cyan-400/40 px-3 py-2 text-xs text-cyan-200 hover:bg-cyan-400/10">Clear</button>
    </div>
  </div>
);

export default SearchBar;
