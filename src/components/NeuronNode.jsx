import { useRef, useState } from "react";
import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { categoryColors } from "../data/nodes";

const NeuronNode = ({ node, isActive, isHighlighted, onClick, reducedMotion, lensColor }) => {
  const color = lensColor || categoryColors[node.category] || "#00e5ff";
  const [hovered, setHovered] = useState(false);
  const ref = useRef();

  useCursor(hovered);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = reducedMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 3.2 + node.position[0]) * 0.04;
    const hoverBoost = hovered || isActive ? 1.25 : 1;
    ref.current.scale.setScalar(pulse * hoverBoost);
  });

  return (
    <group
      ref={ref}
      position={node.position}
      onClick={() => onClick(node)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <sphereGeometry args={[isActive ? 0.33 : 0.25, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={isHighlighted || isActive || hovered ? color : "#022b36"}
          emissiveIntensity={isActive ? 2.2 : hovered ? 1.8 : isHighlighted ? 1.5 : 0.8}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[isActive ? 0.52 : 0.43, 20, 20]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.2 : isHighlighted || hovered ? 0.13 : 0.08}
        />
      </mesh>
    </group>
  );
};

export default NeuronNode;
