import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")?.[1] || "engineering-brain-portfolio";
const isGhPages = process.env.DEPLOY_TARGET === "gh-pages";

export default defineConfig({
  plugins: [react()],
  base: isGhPages ? `/${repoName}/` : "/",
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "three-core";
          if (id.includes("@react-three/fiber")) return "r3f-core";
          if (id.includes("@react-three/drei")) return "r3f-drei";
          if (id.includes("@react-three/postprocessing") || id.includes("postprocessing")) return "r3f-post";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("d3")) return "d3";
        }
      }
    }
  }
});
