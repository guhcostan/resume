import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { Dog } from "./Dog";
import { Ball, Box } from "./objects";

function ClosedEye({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <mesh position={[x, y, z]} rotation={[0, 0, Math.PI]}>
      <torusGeometry args={[0.035, 0.008, 6, 14, Math.PI]} />
      <meshStandardMaterial color="#554337" />
    </mesh>
  );
}
function Reader({ paused }: { paused: boolean }) {
  const head = useRef<Group>(null),
    book = useRef<Group>(null),
    time = useRef(0);
  useFrame((_, delta) => {
    if (paused) return;
    time.current += Math.min(delta, 0.05);
    if (head.current)
      head.current.rotation.x = 0.1 + Math.sin(time.current * 0.9) * 0.022;
    if (book.current)
      book.current.rotation.x = -0.25 + Math.sin(time.current * 0.7) * 0.012;
  });
  return (
    <group position={[2.03, 0, 1.18]} rotation={[0, -1.3, 0]}>
      <Ball
        position={[0, 0.34, 0]}
        scale={[0.58, 0.34, 0.56]}
        color="#d9d7cf"
        fabric
      />
      <Ball
        position={[0, 0.66, -0.22]}
        scale={[0.56, 0.52, 0.3]}
        color="#eeebe2"
        fabric
      />
      <group position={[0, 0.55, 0.09]} scale={0.77}>
        <Ball
          position={[0, 0.04, 0.12]}
          scale={[0.37, 0.17, 0.3]}
          color="#464c42"
        />
        <group rotation={[0, 0.5, 0.2]}>
          <Box
            size={[0.25, 0.18, 0.48]}
            position={[-0.13, 0.04, 0.2]}
            color="#45493f"
          />
        </group>
        <group rotation={[0, -0.5, -0.2]}>
          <Box
            size={[0.25, 0.18, 0.48]}
            position={[0.13, 0.04, 0.2]}
            color="#45493f"
          />
        </group>
        <Box
          size={[0.53, 0.49, 0.33]}
          position={[0, 0.38, 0]}
          color="#eee9d5"
        />
        <group ref={head} position={[0, 0.9, 0]}>
          <Ball
            position={[0, 0, -0.08]}
            scale={[0.32, 0.37, 0.29]}
            color="#342c24"
          />
          <Ball
            position={[0, 0, 0.01]}
            scale={[0.29, 0.34, 0.25]}
            color="#dba47a"
          />
          <Ball
            position={[0, 0.23, -0.05]}
            scale={[0.31, 0.2, 0.25]}
            color="#382d23"
          />
          <Ball
            position={[0, 0.29, -0.28]}
            scale={[0.19, 0.2, 0.19]}
            color="#30281f"
          />
          <Ball
            position={[0, 0.06, -0.29]}
            scale={[0.15, 0.25, 0.14]}
            color="#30281f"
          />
          <group rotation={[0, 0, 0.25]}>
            <Ball
              position={[-0.21, 0.11, 0.06]}
              scale={[0.09, 0.22, 0.16]}
              color="#382d23"
            />
          </group>
          <ClosedEye x={-0.11} y={-0.02} z={0.248} />
          <ClosedEye x={0.11} y={-0.02} z={0.248} />
          <Ball
            position={[0, -0.07, 0.26]}
            scale={[0.035, 0.045, 0.035]}
            color="#c68d63"
          />
          <Ball
            position={[0, -0.16, 0.22]}
            scale={[0.065, 0.018, 0.013]}
            color="#9e624c"
          />
          {[-0.3, 0.3].map((x) => (
            <mesh key={x} position={[x, -0.065, 0.01]}>
              <torusGeometry args={[0.047, 0.011, 7, 18]} />
              <meshStandardMaterial
                color="#caa757"
                metalness={0.65}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>
        {[-1, 1].map((side) => (
          <group
            key={side}
            position={[side * 0.28, 0.56, 0.01]}
            rotation={[-1.1, 0, side * 0.2]}
          >
            <Box
              size={[0.18, 0.34, 0.22]}
              position={[0, -0.11, 0]}
              color="#eee9d5"
            />
            <Ball
              position={[0, -0.28, 0.015]}
              scale={[0.08, 0.1, 0.075]}
              color="#dba47a"
            />
          </group>
        ))}
        <group ref={book} position={[0, 0.43, 0.34]} rotation={[-0.25, 0, 0]}>
          {[-1, 1].map((side) => (
            <group key={side} rotation={[0, side * 0.2, 0]}>
              <Box
                size={[0.27, 0.36, 0.035]}
                position={[side * 0.137, 0, 0]}
                color="#788363"
              />
              <Box
                size={[0.235, 0.325, 0.025]}
                position={[side * 0.135, 0, 0.025]}
                color="#e5dcc3"
              />
              {Array.from({ length: 6 }, (_, i) => (
                <Box
                  key={i}
                  size={[0.17, 0.004, 0.006]}
                  position={[side * 0.135, 0.11 - i * 0.037, 0.041]}
                  color="#b6b29c"
                />
              ))}
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}
export function Family({ paused }: { paused: boolean }) {
  return (
    <group>
      <Reader paused={paused} />
      <Dog paused={paused} position={[0.35, 0.04, 2.2]} />
      <Dog small paused={paused} position={[1.38, 0.04, 2.35]} />
    </group>
  );
}
