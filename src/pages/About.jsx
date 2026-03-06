import { motion } from "framer-motion";

const About = () => (
  <section className="mx-auto max-w-5xl p-6">
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="hud-panel p-6">
      <h1 className="font-orbitron text-2xl text-cyan-200">About Viraj Thakur</h1>
      <p className="mt-3 text-slate-200/90">
        I&apos;m Viraj Thakur, a Python developer focused on building AI-powered web applications using Django, Flask, and modern web technologies.
      </p>
      <p className="mt-3 text-slate-300/90">
        I enjoy creating tools that combine backend systems, APIs, and intelligent features to solve real problems. My projects include AI analyzers, music platforms, and full-stack applications.
      </p>
    </motion.div>
  </section>
);

export default About;
