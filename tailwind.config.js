/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        holoBlue: "#00e5ff",
        holoViolet: "#7c4dff",
        holoCyan: "#18ffff"
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 22px rgba(0, 229, 255, 0.45)",
        violetGlow: "0 0 22px rgba(124, 77, 255, 0.4)"
      },
      backgroundImage: {
        nebula:
          "radial-gradient(circle at 20% 20%, rgba(0,229,255,0.14), transparent 36%), radial-gradient(circle at 80% 30%, rgba(124,77,255,0.18), transparent 40%), radial-gradient(circle at 45% 80%, rgba(24,255,255,0.12), transparent 32%)"
      }
    }
  },
  plugins: []
};
