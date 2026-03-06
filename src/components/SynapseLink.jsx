import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SynapseLink = ({ start, end, color = "#00e5ff" }) => {
  const pulseRef = useRef();
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useFrame(({ clock }) => {
    if (!pulseRef.current) return;
    const t = (clock.elapsedTime * 0.35) % 1;
    pulseRef.current.position.set(
      THREE.MathUtils.lerp(start[0], end[0], t),
      THREE.MathUtils.lerp(start[1], end[1], t),
      THREE.MathUtils.lerp(start[2], end[2], t)
    );
    const scale = 0.9 + Math.sin(clock.elapsedTime * 8.2) * 0.22;
    pulseRef.current.scale.setScalar(scale);
  });

  return (
    <group>
      <line geometry={geometry}>
        <lineBasicMaterial color={color} transparent opacity={0.3} />
      </line>
      <line geometry={geometry}>
        <lineBasicMaterial color={color} transparent opacity={0.14} />
      </line>
      <mesh ref={pulseRef}><sphereGeometry args={[0.05, 10, 10]} /><meshBasicMaterial color={color} /></mesh>
    </group>
  );
};

export default SynapseLink;
