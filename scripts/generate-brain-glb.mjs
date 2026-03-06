import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class FileReader {
    constructor() {
      this.result = null;
      this.onloadend = null;
      this.onerror = null;
    }

    async readAsArrayBuffer(blob) {
      try {
        this.result = await blob.arrayBuffer();
        if (typeof this.onloadend === "function") this.onloadend();
      } catch (error) {
        if (typeof this.onerror === "function") this.onerror(error);
      }
    }
  };
}

const createGyrifiedGeometry = (radius = 1, widthSeg = 48, heightSeg = 48) => {
  const geo = new THREE.SphereGeometry(radius, widthSeg, heightSeg);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const n = new THREE.Vector3(x, y, z).normalize();

    const wrinkle =
      Math.sin(x * 4.2) * 0.08 +
      Math.sin(y * 5.1) * 0.06 +
      Math.cos(z * 4.7) * 0.055 +
      Math.sin((x + z) * 6.2) * 0.04;

    pos.setXYZ(i, x + n.x * wrinkle, y + n.y * wrinkle, z + n.z * wrinkle);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
};

const scene = new THREE.Scene();
const root = new THREE.Group();
scene.add(root);

const material = new THREE.MeshStandardMaterial({
  color: "#9cb2c7",
  roughness: 0.6,
  metalness: 0.03
});

const lobeGeo = createGyrifiedGeometry(0.95, 56, 56);
const lobeLayout = [
  { pos: [1.1, 0.3, 0.25], scale: [1.05, 0.94, 1.04] },
  { pos: [0.8, 0.28, -0.52], scale: [1.05, 1.0, 1.06] },
  { pos: [0.5, 0.46, -0.05], scale: [1.0, 1.03, 1.0] },
  { pos: [0.24, 0.34, 0.5], scale: [0.92, 0.88, 0.94] },
  { pos: [0.72, -0.16, -0.22], scale: [0.92, 0.88, 0.98] }
];

const left = new THREE.Group();
const right = new THREE.Group();
left.position.set(-0.05, 0.16, 0);
right.position.set(0.05, 0.16, 0);

for (const l of lobeLayout) {
  const lm = new THREE.Mesh(lobeGeo, material);
  lm.position.set(-l.pos[0], l.pos[1], l.pos[2]);
  lm.scale.set(l.scale[0], l.scale[1], l.scale[2]);
  left.add(lm);

  const rm = new THREE.Mesh(lobeGeo, material);
  rm.position.set(l.pos[0], l.pos[1], l.pos[2]);
  rm.scale.set(l.scale[0], l.scale[1], l.scale[2]);
  right.add(rm);
}

root.add(left);
root.add(right);

const cerebellum = new THREE.Mesh(createGyrifiedGeometry(0.7, 42, 42), material);
cerebellum.position.set(0, -1.2, -0.62);
cerebellum.scale.set(1.42, 0.8, 0.88);
root.add(cerebellum);

const stem = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.65, 5, 14), material);
stem.position.set(0, -1.18, -0.08);
root.add(stem);

root.scale.set(1.45, 1.45, 1.45);

const exporter = new GLTFExporter();
const outPath = path.resolve(process.cwd(), "public", "brain-anatomical.glb");

const glb = await new Promise((resolve, reject) => {
  exporter.parse(
    scene,
    (result) => {
      if (result instanceof ArrayBuffer) {
        resolve(Buffer.from(result));
        return;
      }
      reject(new Error("Exporter returned JSON instead of binary glb."));
    },
    (error) => reject(error),
    { binary: true, trs: false, onlyVisible: true }
  );
});

fs.writeFileSync(outPath, glb);
console.log(`Generated ${outPath}`);
