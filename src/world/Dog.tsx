import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Shape } from "three";
import { Ball } from "./objects";
import { Curve, Ring } from "./Details";
import type { Point } from "./routine";
const ear = new Shape();
ear.moveTo(-0.1, 0);
ear.quadraticCurveTo(-0.16, 0.16, -0.05, 0.39);
ear.quadraticCurveTo(-0.02, 0.43, 0.02, 0.38);
ear.quadraticCurveTo(0.16, 0.19, 0.11, 0.02);
ear.quadraticCurveTo(0, -0.05, -0.1, 0);
function Ear({ inner = false }: { inner?: boolean }) {
  return (
    <mesh
      castShadow
      scale={inner ? [0.64, 0.72, 0.7] : [1, 1, 1]}
      position={inner ? [0, 0.035, 0.042] : [0, 0, 0]}
    >
      <extrudeGeometry
        args={[
          ear,
          {
            depth: 0.035,
            bevelEnabled: true,
            bevelSize: 0.025,
            bevelThickness: 0.018,
            bevelSegments: 3,
            steps: 1,
            curveSegments: 14,
          },
        ]}
      />
      <meshStandardMaterial
        color={inner ? "#c68f79" : "#b68148"}
        roughness={0.93}
      />
    </mesh>
  );
}
export function Dog({
  small = false,
  paused,
  position,
}: {
  small?: boolean;
  paused: boolean;
  position: Point;
}) {
  const body = useRef<Group>(null),
    tail = useRef<Group>(null),
    ears = useRef<Group>(null),
    time = useRef(0);
  useFrame((_, delta) => {
    if (paused) return;
    time.current += Math.min(delta, 0.05);
    const t = time.current;
    if (body.current)
      body.current.scale.y = 1 + Math.sin(t * 1.5 + (small ? 1 : 0)) * 0.018;
    if (tail.current)
      tail.current.rotation.y =
        Math.sin(t * 2.7) *
        0.055 *
        Math.pow(Math.max(0, Math.sin(t * 0.23)), 8);
    if (ears.current)
      ears.current.rotation.z =
        Math.sin(t * 5) *
        0.035 *
        Math.pow(Math.max(0, Math.sin(t * 0.18 + 1)), 12);
  });
  const coat = small ? "#b9834b" : "#d6b477",
    cream = small ? "#eed5a7" : "#efdab0";
  return (
    <group
      position={position}
      rotation={[0, small ? -0.3 : 0.15, 0]}
      scale={small ? 0.65 : 1}
    >
      <group scale={[1.18, 1, 0.89]}>
        <Ball
          position={[0, 0.065, 0.02]}
          scale={[0.61, 0.085, 0.54]}
          color={small ? "#929b80" : "#b5a184"}
        />
        <Ball
          position={[0, 0.1, 0.02]}
          scale={[0.55, 0.065, 0.48]}
          color={small ? "#b3bba2" : "#d4c3a3"}
        />
        <Ring
          position={[0, 0.105, 0.02]}
          radius={0.56}
          tube={0.018}
          color={small ? "#859075" : "#a08b6c"}
        />
      </group>
      <group ref={body}>
        <Ball
          position={[0.1, 0.29, -0.06]}
          scale={small ? [0.36, 0.19, 0.25] : [0.48, 0.24, 0.29]}
          color={coat}
        />
        <Ball
          position={[0.35, 0.24, -0.08]}
          scale={[0.24, 0.18, 0.24]}
          color={coat}
        />
        <Ball
          position={[-0.2, 0.3, 0.03]}
          scale={[0.24, 0.23, 0.24]}
          color={cream}
        />
        <group ref={tail} position={[0.36, 0.17, -0.2]}>
          <Curve
            points={[
              [0, 0, 0],
              [0.26, 0.035, 0.02],
              [0.28, 0.03, 0.25],
              [0.12, 0.025, 0.35],
            ]}
            radius={small ? 0.047 : 0.085}
            color={coat}
          />
          {!small &&
            [0, 1, 2].map((i) => (
              <Ball
                key={i}
                position={[0.24 - i * 0.045, 0.02, 0.18 + i * 0.07]}
                scale={[0.115, 0.04, 0.12]}
                color="#ddbd84"
              />
            ))}
        </group>
        {[-0.3, -0.03].map((x) => (
          <group key={x}>
            <Ball
              position={[x, 0.14, 0.21]}
              scale={[0.095, 0.09, 0.19]}
              color={coat}
            />
            <Ball
              position={[x, 0.13, 0.37]}
              scale={[0.11, 0.07, 0.14]}
              color={cream}
            />
            {[-0.033, 0.033].map((dx) => (
              <Curve
                key={dx}
                radius={0.006}
                color={small ? "#bba078" : "#c6ad81"}
                points={[
                  [x + dx, 0.161, 0.45],
                  [x + dx, 0.18, 0.415],
                  [x + dx, 0.184, 0.39],
                ]}
              />
            ))}
          </group>
        ))}
        <group
          position={[-0.23, small ? 0.41 : 0.37, 0.15]}
          rotation={[0.06, -0.25, small ? -0.12 : 0.05]}
        >
          <Ball
            scale={small ? [0.23, 0.24, 0.2] : [0.25, 0.245, 0.225]}
            color={coat}
          />
          <Ball
            position={[0, -0.035, 0.125]}
            scale={[0.19, 0.16, 0.14]}
            color={cream}
          />
          {[-1, 1].map((side) => (
            <group key={side}>
              <Ball
                position={[side * 0.06, -0.085, 0.245]}
                scale={small ? [0.066, 0.055, 0.075] : [0.09, 0.078, 0.105]}
                color={cream}
              />
              <Curve
                radius={0.009}
                color="#463b30"
                points={[
                  [side * 0.055, 0.035, 0.205],
                  [side * 0.095, 0.018, 0.216],
                  [side * 0.138, 0.035, 0.191],
                ]}
              />
              <Curve
                radius={0.013}
                color={small ? "#dcb77f" : "#e7cda0"}
                points={[
                  [side * 0.07, 0.09, 0.192],
                  [side * 0.11, 0.102, 0.184],
                  [side * 0.14, 0.087, 0.172],
                ]}
              />
            </group>
          ))}
          <Ball
            position={[0, -0.055, small ? 0.289 : 0.328]}
            scale={small ? [0.046, 0.031, 0.031] : [0.063, 0.041, 0.035]}
            color="#352f29"
          />
          <Ball
            position={[-0.012, -0.042, small ? 0.31 : 0.349]}
            scale={[0.012, 0.008, 0.006]}
            color="#9c9486"
          />
          <Curve
            radius={0.006}
            color="#7e6148"
            points={[
              [0, -0.073, 0.32],
              [0, -0.105, 0.321],
              [0.039, -0.119, 0.292],
            ]}
          />
          <group ref={ears}>
            {[-1, 1].map((side) =>
              small ? (
                <group
                  key={side}
                  position={[side * 0.17, 0.12, -0.02]}
                  rotation={[0.07, side * 0.2, -side * 0.27]}
                >
                  <Ear />
                  <Ear inner />
                </group>
              ) : (
                <group
                  key={side}
                  position={[side * 0.235, -0.015, -0.025]}
                  rotation={[0.18, side * 0.12, side * 0.14]}
                >
                  <Ball scale={[0.105, 0.225, 0.13]} color="#bc965e" />
                  <Ball
                    position={[0, -0.11, 0.015]}
                    scale={[0.1, 0.135, 0.115]}
                    color="#c6a16a"
                  />
                  <Curve
                    radius={0.008}
                    color="#af8851"
                    points={[
                      [side * 0.02, 0.09, 0.11],
                      [side * 0.025, -0.02, 0.128],
                      [0, -0.14, 0.107],
                    ]}
                  />
                </group>
              ),
            )}
          </group>
        </group>
        {!small && (
          <group position={[-0.18, 0.265, 0.23]} rotation={[0.2, 0, -0.12]}>
            <mesh rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[0.13, 0.21, 3]} />
              <meshStandardMaterial color="#758972" roughness={1} />
            </mesh>
            <Ball
              position={[0, 0.095, 0.055]}
              scale={[0.075, 0.04, 0.045]}
              color="#82987b"
            />
            <Ball
              position={[0, -0.01, 0.09]}
              scale={[0.025, 0.025, 0.012]}
              color="#d9c495"
            />
          </group>
        )}
        {small && (
          <group position={[-0.18, 0.24, 0.22]}>
            <Curve
              radius={0.023}
              color="#8b6954"
              points={[
                [-0.13, 0.035, -0.035],
                [0, -0.015, 0.045],
                [0.13, 0.035, -0.035],
              ]}
            />
            <Ball
              position={[0, -0.035, 0.065]}
              scale={[0.035, 0.045, 0.012]}
              color="#c7ac6e"
            />
          </group>
        )}
      </group>
    </group>
  );
}
