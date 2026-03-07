import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";

const navClass = ({ isActive }) => `rounded px-3 py-1 text-sm uppercase tracking-wider transition ${isActive ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40" : "text-slate-300 hover:text-cyan-200"}`;

function App() {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 border-b border-cyan-400/20 bg-slate-950/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <span className="font-orbitron text-sm text-cyan-200">Engineering Brain</span>
          <div className="flex gap-2">
            <NavLink to="/" className={navClass} end>Home</NavLink>
            <NavLink to="/projects" className={navClass}>Projects</NavLink>
            <NavLink to="/about" className={navClass}>About</NavLink>
            <a
              href="/portfolio2/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded border border-cyan-400/40 px-3 py-1 text-sm uppercase tracking-wider text-cyan-200 hover:bg-cyan-500/15"
            >
              Resume
            </a>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
