import { Shape } from "three";
import { Html } from "@react-three/drei";
import { Curve, Ring } from "./Details";
import { Ball, Box, Cylinder } from "./objects";
const outline = new Shape();
outline.moveTo(-0.21, -1.15);
outline.bezierCurveTo(-0.47, -0.3, -0.42, 0.85, 0, 1.35);
outline.bezierCurveTo(0.42, 0.85, 0.47, -0.3, 0.21, -1.15);
outline.quadraticCurveTo(0, -1.22, -0.21, -1.15);
function Surfboard() {
  return (
    <group position={[2.5, 1.24, -2.4]} rotation={[0.04, -0.2, -0.12]}>
      <mesh castShadow receiveShadow>
        <extrudeGeometry
          args={[
            outline,
            {
              depth: 0.075,
              bevelEnabled: true,
              bevelSegments: 3,
              steps: 1,
              bevelSize: 0.025,
              bevelThickness: 0.02,
              curveSegments: 24,
            },
          ]}
        />
        <meshStandardMaterial color="#e8dfc4" roughness={0.67} />
      </mesh>
      <Box
        size={[0.027, 2.1, 0.018]}
        position={[0, 0.03, 0.099]}
        color="#b3905e"
      />
      <Box
        size={[0.58, 0.21, 0.02]}
        position={[0, -0.4, 0.104]}
        rotation={[0, 0, -0.1]}
        color="#729995"
      />
      <Box
        size={[0.56, 0.085, 0.02]}
        position={[0, -0.62, 0.104]}
        rotation={[0, 0, -0.1]}
        color="#d0a67c"
      />
      <mesh position={[0.03, -0.93, 0.13]}>
        <torusGeometry args={[0.09, 0.012, 7, 24]} />
        <meshStandardMaterial color="#6a7364" />
      </mesh>
      <Box
        size={[0.28, 0.36, 0.015]}
        position={[0, -0.89, 0.113]}
        color="#6c8179"
      />
      {[-0.09, -0.03, 0.03, 0.09].map((x) => (
        <Box
          key={x}
          size={[0.007, 0.3, 0.007]}
          position={[x, -0.89, 0.125]}
          color="#9aa99a"
        />
      ))}
      <Curve
        radius={0.012}
        color="#56675a"
        points={[
          [0.08, -1.05, 0.14],
          [0.3, -1.18, 0.23],
          [0.48, -1.13, 0.15],
          [0.45, -0.85, 0.04],
          [0.3, -0.83, 0.06],
        ]}
      />
      <Box size={[0.45, 0.07, 0.22]} position={[0, -1.19, 0]} color="#c8b797" />
    </group>
  );
}
function RunningShoes() {
  return (
    <group position={[-2.63, 0.07, 0.4]} rotation={[0, 0.25, 0]}>
      {[-0.16, 0.16].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <Box
            size={[0.24, 0.075, 0.46]}
            position={[0, 0.02, 0]}
            color="#eee5d1"
          />
          <Ball
            position={[0, 0.11, 0.015]}
            scale={[0.115, 0.11, 0.21]}
            color="#6f877f"
          />
          <Ball
            position={[0, 0.17, -0.13]}
            scale={[0.09, 0.09, 0.075]}
            color="#515f58"
          />
          <Box
            size={[0.035, 0.075, 0.16]}
            position={[0.09, 0.1, 0.03]}
            rotation={[0, 0, -0.25]}
            color="#d6ac76"
          />
          <Ball
            position={[0, 0.234, -0.115]}
            scale={[0.066, 0.022, 0.062]}
            color="#3c5048"
          />
          <Curve
            radius={0.012}
            color="#d4af7e"
            points={[
              [-0.045, 0.21, -0.18],
              [-0.035, 0.29, -0.19],
              [0.035, 0.29, -0.19],
              [0.045, 0.21, -0.18],
            ]}
          />
          {[0, 0.055, 0.11].map((z) => (
            <group key={z}>
              <Curve
                radius={0.009}
                color="#eee5cc"
                points={[
                  [-0.06, 0.205, z - 0.06],
                  [0, 0.224, z - 0.035],
                  [0.06, 0.205, z - 0.01],
                ]}
              />
              <Curve
                radius={0.009}
                color="#eee5cc"
                points={[
                  [0.06, 0.207, z - 0.06],
                  [0, 0.225, z - 0.035],
                  [-0.06, 0.207, z - 0.01],
                ]}
              />
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}
function Fitness() {
  return (
    <group position={[-2.64, 0, -0.18]}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <Cylinder
          position={[0, 0, -0.13]}
          radius={0.13}
          height={0.6}
          color="#a6ae90"
        />
        <mesh position={[0, 0.306, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.07, 0.1, 24]} />
          <meshStandardMaterial color="#6c7c5c" />
        </mesh>
      </group>
      <group position={[0.05, 0.13, 0.26]} rotation={[0, 0.3, Math.PI / 2]}>
        <Cylinder
          position={[0, 0, 0]}
          radius={0.035}
          height={0.34}
          color="#7d837a"
        />
        {[-0.15, 0.15].map((y) => (
          <Cylinder
            key={y}
            position={[0, y, 0]}
            radius={0.105}
            height={0.08}
            color="#424e48"
          />
        ))}
      </group>
      <Cylinder
        position={[0.14, 0.23, -0.2]}
        radius={0.072}
        height={0.39}
        color="#c5a17a"
      />
      <Cylinder
        position={[0.14, 0.44, -0.2]}
        radius={0.054}
        height={0.045}
        color="#5d6f61"
      />
    </group>
  );
}
function Food() {
  return (
    <group position={[1.55, 1.16, -1.55]} rotation={[0, -Math.PI / 2, 0]}>
      <Box size={[0.68, 0.035, 0.48]} color="#d9c8a8" />
      {[-0.3, 0.3].map((x) => (
        <Curve
          key={x}
          radius={0.015}
          color="#c1af8f"
          points={[
            [x, 0.02, -0.14],
            [x, 0.08, -0.12],
            [x, 0.08, 0.12],
            [x, 0.02, 0.14],
          ]}
        />
      ))}
      <Cylinder
        position={[0, 0.04, 0]}
        radius={0.23}
        height={0.025}
        color="#e6e1d0"
      />
      <Ring
        position={[0, 0.063, 0]}
        radius={0.214}
        tube={0.012}
        color="#a8b4a0"
      />
      <group position={[-0.045, 0.082, 0]}>
        <Ball scale={[0.115, 0.03, 0.1]} color="#c59554" />
        <Ball
          position={[0, 0.035, 0]}
          scale={[0.12, 0.018, 0.102]}
          color="#687346"
        />
        <Ball
          position={[0, 0.053, 0]}
          scale={[0.105, 0.023, 0.09]}
          color="#a95f3c"
        />
        <Box
          size={[0.19, 0.012, 0.18]}
          position={[0, 0.079, 0]}
          rotation={[0, 0.25, 0]}
          color="#deb461"
        />
        <Ball
          position={[0, 0.103, 0]}
          scale={[0.118, 0.063, 0.104]}
          color="#c59553"
        />
        {[-1, 0, 1].map((i) => (
          <Ball
            key={i}
            position={[i * 0.044, 0.159 - Math.abs(i) * 0.008, 0.015]}
            scale={[0.008, 0.004, 0.016]}
            color="#ead8ac"
          />
        ))}
      </group>
      <Box
        size={[0.1, 0.012, 0.19]}
        position={[0.155, 0.08, -0.03]}
        rotation={[0, 0.14, 0]}
        color="#f1e8d5"
      />
      <Curve
        radius={0.008}
        color="#a6ab9d"
        points={[
          [0.162, 0.1, -0.13],
          [0.17, 0.1, -0.04],
          [0.17, 0.1, 0.09],
        ]}
      />
    </group>
  );
}
export function CoastalPrint() {
  return (
    <group position={[0.48, 2.28, -2.64]}>
      <Box size={[1.05, 1.18, 0.07]} color="#d8c8ae" />
      <Box
        size={[0.95, 1.08, 0.015]}
        position={[0, 0, 0.045]}
        color="#e9e3d2"
      />
      <Html transform position={[0, 0, 0.06]} scale={0.14}>
        <div className="coastal-print">
          <small>LITORAL NORTE</small>
          <svg width="150" height="112" viewBox="0 0 150 112" fill="none">
            <circle cx="112" cy="27" r="13" fill="#c6b07b" />
            <path d="M0 75 34 31 65 74 99 42 150 81v31H0Z" fill="#b7c0a0" />
            <path d="M0 82Q30 65 67 83t83 0v29H0Z" fill="#7d9b94" />
            <path
              d="M0 96q28-12 56 0t57 0 37 0"
              stroke="#d9e2d1"
              strokeWidth="3"
            />
          </svg>
          <strong>São Sebastião</strong>
          <span>23°45′ S · 45°24′ W</span>
        </div>
      </Html>
    </group>
  );
}
export function PersonalObjects() {
  return (
    <group>
      <Surfboard />
      <RunningShoes />
      <Fitness />
      <Food />
      <group position={[1.96, 2.45, -2.44]}>
        <Box size={[0.13, 0.31, 0.18]} color="#b9b7ab" />
        <Box
          size={[0.035, 0.23, 0.015]}
          position={[0, 0, 0.1]}
          color="#e5c992"
        />
      </group>
    </group>
  );
}
