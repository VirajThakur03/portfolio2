# The Engineering Brain - Inside the Mind of Viraj Thakur

Futuristic 3D developer portfolio with React, Three.js, React Three Fiber, D3, Tailwind, and Framer Motion.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages (free)

```bash
npm install
$env:DEPLOY_TARGET="gh-pages"
npm run deploy
```

Enable Pages from `gh-pages` branch in repo settings.

## Push to GitHub

```bash
git init
git add .
git commit -m "feat: engineering brain portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Render Static Site (free)

- Build command: `npm install && npm run build`
- Publish directory: `dist`

## Custom domain

1. Copy `public/CNAME.example` to `public/CNAME`.
2. Replace content with your domain (single line, no protocol), for example `virajthakur.dev`.
3. Configure DNS on your domain provider.

## Social and SEO assets

- Favicon: `public/favicon.svg`
- Open Graph image: `public/og-image.svg`
- Meta tags are configured in `index.html`.

## Notes

- HashRouter is used for static-host routing compatibility.
- Resume is wired to `public/resume.pdf`.
- Update profile links/stats in `src/data/nodes.js` if your public handles differ.
- Real anatomical-style 3D brain model is available at `public/brain-anatomical.glb`.
  Regenerate it with `npm run generate:brain-model`.
- Project proof pages and screenshots are in `public/proofs/`.
