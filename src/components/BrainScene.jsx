import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import NeuronNode from "./NeuronNode";
import SynapseLink from "./SynapseLink";

const createGyrifiedGeometry = (radius = 3.1, widthSeg = 80, heightSeg = 80) => {
  const geo = new THREE.SphereGeometry(radius, widthSeg, heightSeg);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const n = new THREE.Vector3(x, y, z).normalize();

    const wrinkle =
      Math.sin(x * 3.6) * 0.085 +
      Math.sin(y * 4.2) * 0.065 +
      Math.cos(z * 3.9) * 0.055 +
      Math.sin((x + z) * 5.1) * 0.04;

    pos.setXYZ(i, x + n.x * wrinkle, y + n.y * wrinkle, z + n.z * wrinkle);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
};

const BrainModel = ({ reducedMotion }) => {
  const root = useRef();
  const leftGroup = useRef();
  const rightGroup = useRef();
  const cerebellumRef = useRef();
  const stemRef = useRef();
  const lobeGeo = useMemo(() => createGyrifiedGeometry(2.35, 72, 72), []);
  const cerebellumGeo = useMemo(() => createGyrifiedGeometry(1.52, 56, 56), []);

  const lobeLayout = useMemo(
    () => [
      { pos: [2.55, 0.78, 0.58], scale: [1.08, 0.98, 1.02] }, // frontal
      { pos: [1.92, 0.74, -1.18], scale: [1.08, 1.02, 1.08] }, // temporal
      { pos: [1.2, 1.12, -0.18], scale: [1.0, 1.05, 1.0] }, // parietal
      { pos: [0.62, 0.86, 1.02], scale: [0.92, 0.9, 0.96] }, // occipital
      { pos: [1.8, -0.22, -0.52], scale: [0.95, 0.9, 1.0] } // lower temporal
    ],
    []
  );

  useFrame(({ clock }) => {
    if (!root.current) return;
    const t = clock.elapsedTime;

    if (!reducedMotion) {
      root.current.rotation.y = Math.sin(t * 0.22) * 0.06;
      root.current.rotation.x = Math.sin(t * 0.15) * 0.03;
    }

    const pulse = reducedMotion ? 1 : 1 + Math.sin(t * 1.65) * 0.02;
    if (leftGroup.current) leftGroup.current.scale.setScalar(pulse);
    if (rightGroup.current) rightGroup.current.scale.setScalar(pulse);
    if (cerebellumRef.current) cerebellumRef.current.material.emissiveIntensity = reducedMotion ? 0.2 : 0.28 + Math.sin(t * 1.8) * 0.08;
    if (stemRef.current) stemRef.current.material.emissiveIntensity = reducedMotion ? 0.18 : 0.24 + Math.sin(t * 1.5) * 0.05;
  });

  return (
    <group ref={root}>
      <group ref={leftGroup} position={[-0.1, 0.38, 0]}>
        {lobeLayout.map((lobe, i) => (
          <mesh key={`left-${i}`} position={[-lobe.pos[0], lobe.pos[1], lobe.pos[2]]} scale={lobe.scale}>
            <primitive object={lobeGeo} attach="geometry" />
            <meshPhysicalMaterial color="#16251f" emissive="#34f8ba" emissiveIntensity={0.32} roughness={0.24} metalness={0.08} clearcoat={1} transmission={0.42} transparent opacity={0.86} />
          </mesh>
        ))}
      </group>

      <group ref={rightGroup} position={[0.1, 0.38, 0]}>
        {lobeLayout.map((lobe, i) => (
          <mesh key={`right-${i}`} position={lobe.pos} scale={lobe.scale}>
            <primitive object={lobeGeo} attach="geometry" />
            <meshPhysicalMaterial color="#10263a" emissive="#00d8ff" emissiveIntensity={0.34} roughness={0.24} metalness={0.1} clearcoat={1} transmission={0.4} transparent opacity={0.84} />
          </mesh>
        ))}
      </group>

      <mesh position={[0, 0.68, 0.1]} scale={[0.24, 1.46, 1.28]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#020812" transparent opacity={0.52} />
      </mesh>

      <mesh ref={cerebellumRef} position={[0, -2.35, -1.25]} scale={[1.75, 0.95, 1.0]}>
        <primitive object={cerebellumGeo} attach="geometry" />
        <meshPhysicalMaterial color="#182739" emissive="#7c4dff" emissiveIntensity={0.28} roughness={0.32} metalness={0.09} clearcoat={0.9} transparent opacity={0.84} />
      </mesh>

      <mesh ref={stemRef} position={[0, -2.45, -0.3]} scale={[0.45, 1.0, 0.42]}>
        <capsuleGeometry args={[0.52, 1.4, 6, 18]} />
        <meshPhysicalMaterial color="#172338" emissive="#4edbff" emissiveIntensity={0.22} roughness={0.28} metalness={0.1} transparent opacity={0.78} />
      </mesh>

      <mesh>
        <sphereGeometry args={[7.6, 60, 60]} />
        <meshBasicMaterial color="#9cfaff" transparent opacity={0.07} wireframe />
      </mesh>

      <mesh>
        <torusGeometry args={[9.2, 0.045, 14, 120]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.33} />
      </mesh>
    </group>
  );
};

const BrainCore = ({ reducedMotion }) => {
  // Keep the original procedural brain as the default visual style.
  return <BrainModel reducedMotion={reducedMotion} />;
};

const Stars = ({ count = 700, radius = 50 }) => {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = radius * (0.3 + Math.random() * 0.7);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#90f4ff" size={0.05} sizeAttenuation />
    </points>
  );
};

const buildBrainSurfacePositions = (nodes) => {
  const count = nodes.length;
  return nodes.map((node, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

    let x = Math.cos(theta) * Math.sin(phi);
    let y = Math.cos(phi);
    let z = Math.sin(theta) * Math.sin(phi);

    x *= 5.4;
    y *= 3.8;
    z *= 3.8;

    const hemiOffset = x >= 0 ? 0.9 : -0.9;
    x += hemiOffset;

    if (x > 0) {
      x += 0.65 * Math.exp(-Math.abs(z) * 0.35); // frontal bulge
    } else {
      x -= 0.65 * Math.exp(-Math.abs(z) * 0.35);
    }

    z += Math.sin(i * 1.3) * 0.2;
    y += Math.cos(i * 0.9) * 0.15;

    if (y < -1.0) {
      z -= 0.7;
      y -= 0.55; // pushes lower nodes to cerebellum region
    }

    return { ...node, position: [x, y, z] };
  });
};

const BrainGraph = ({
  nodes,
  connections,
  activeNodeId,
  highlightedIds,
  onNodeSelect,
  storyTargetId,
  focusTargetId,
  mobile,
  rotationSpeed,
  reducedMotion,
  showLabels,
  activeLensIds,
  lensColor,
  handGestureControlsRef,
  interactionMode
}) => {
  const groupRef = useRef();
  const controlsRef = useRef();
  const autoYawRef = useRef(0);
  const gestureRotRef = useRef({ x: 0, y: 0 });
  const zoomTargetRef = useRef(14);

  const graph = useMemo(() => {
    const positionedNodes = buildBrainSurfacePositions(nodes);
    const byId = new Map(positionedNodes.map((n) => [n.id, n]));

    const links = connections
      .filter((l) => byId.has(l.source) && byId.has(l.target))
      .map((l) => ({
        source: byId.get(l.source).position,
        target: byId.get(l.target).position,
        sourceId: l.source,
        targetId: l.target
      }));

    return { nodes: positionedNodes, links };
  }, [nodes, connections]);

  useFrame(({ clock, camera }, delta) => {
    const t = clock.elapsedTime;
    const gesture = handGestureControlsRef?.current;

    if (gesture?.handPresent) {
      gestureRotRef.current.y += gesture.yawVelocity * delta * 0.72;
      gestureRotRef.current.x = THREE.MathUtils.clamp(
        gestureRotRef.current.x + gesture.pitchVelocity * delta * 0.68,
        -0.9,
        0.9
      );
      zoomTargetRef.current = THREE.MathUtils.clamp(
        zoomTargetRef.current - gesture.zoomVelocity * delta * 0.9,
        6,
        22
      );
    } else {
      gestureRotRef.current.y = THREE.MathUtils.damp(gestureRotRef.current.y, 0, 2.8, delta);
      gestureRotRef.current.x = THREE.MathUtils.damp(gestureRotRef.current.x, 0, 2.8, delta);
    }

    if (groupRef.current) {
      if (!reducedMotion) {
        autoYawRef.current += (mobile ? 0.0016 : 0.0011) * rotationSpeed;
      }
      groupRef.current.rotation.y = autoYawRef.current + gestureRotRef.current.y;
      groupRef.current.rotation.x = Math.sin(t * 0.23) * 0.05 + gestureRotRef.current.x * 0.65;
    }

    const targetId = storyTargetId || focusTargetId;

    if (!targetId) {
      camera.position.lerp(new THREE.Vector3(0, 1.3, zoomTargetRef.current), reducedMotion ? 0.08 : 0.02);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      if (controlsRef.current) {
        controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), reducedMotion ? 0.1 : 0.035);
        controlsRef.current.update();
      }
      return;
    }

    const target = graph.nodes.find((n) => n.id === targetId);
    if (!target) return;

    const v = new THREE.Vector3(...target.position);
    const focusDistance = THREE.MathUtils.clamp((zoomTargetRef.current / 14) * 3.8, 2.8, 6.2);
    const desired = v.clone().add(new THREE.Vector3(0, 1.0, focusDistance));
    camera.position.lerp(desired, reducedMotion ? 0.12 : 0.07);
    camera.lookAt(v);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(v, reducedMotion ? 0.12 : 0.1);
      controlsRef.current.update();
    }
  });

  return (
    <>
      <ambientLight intensity={0.36} />
      <pointLight color="#00e5ff" position={[8, 6, 8]} intensity={82} distance={45} />
      <pointLight color="#7c4dff" position={[-10, -4, -8]} intensity={52} distance={45} />
      <Stars count={reducedMotion ? 120 : mobile ? 240 : 720} />

      <group ref={groupRef}>
        <BrainCore reducedMotion={reducedMotion} />

        {graph.links.map((link, idx) => {
          const glow = highlightedIds.has(link.sourceId) || highlightedIds.has(link.targetId);
          const inLens = activeLensIds?.size
            ? activeLensIds.has(link.sourceId) && activeLensIds.has(link.targetId)
            : false;
          return (
            <SynapseLink
              key={`${link.sourceId}-${link.targetId}-${idx}`}
              start={link.source}
              end={link.target}
              color={inLens ? lensColor : glow ? "#18ffff" : "#00e5ff"}
            />
          );
        })}

        {graph.nodes.map((node) => {
          const isHighlighted = highlightedIds.has(node.id);
          return (
            <group key={node.id}>
              <NeuronNode
                node={node}
                isActive={activeNodeId === node.id}
                isHighlighted={isHighlighted}
                onClick={onNodeSelect}
                reducedMotion={reducedMotion}
                lensColor={activeLensIds?.has(node.id) ? lensColor : null}
              />
              {!mobile && (showLabels || isHighlighted || activeNodeId === node.id) ? (
                <Html position={[node.position[0], node.position[1] + 0.52, node.position[2]]} center>
                  <span className="rounded bg-slate-900/70 px-2 py-1 text-[10px] uppercase tracking-wider text-cyan-200">
                    {node.name}
                  </span>
                </Html>
              ) : null}
            </group>
          );
        })}
      </group>

      <OrbitControls
        ref={controlsRef}
        enabled
        enablePan={false}
        minDistance={4.2}
        maxDistance={22}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
};

const BrainScene = (props) => {
  const { reducedMotion } = props;

  return (
    <div className="h-[72vh] w-full rounded-2xl border border-cyan-400/20 bg-slate-950/30 shadow-[0_0_24px_rgba(0,229,255,0.2)]">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.3, 14], fov: 46 }} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <fog attach="fog" args={["#020718", 12, 62]} />
        <BrainGraph {...props} />
        {!reducedMotion ? (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur intensity={1.08} luminanceThreshold={0.17} luminanceSmoothing={0.28} radius={0.7} />
          </EffectComposer>
        ) : null}
      </Canvas>
    </div>
  );
};

export default BrainScene;
