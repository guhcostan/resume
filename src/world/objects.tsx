import { Shape, Vector2 } from "three";
import { Curve, Ring } from "./Details";
import { StrawShade } from "./BeachDetails";
import { woodGrain, wovenFiber } from "./textures";
import { RoundedBox } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
export const colors = {
  wood: "#d7c5a5",
  edge: "#d1a36c",
  green: "#7d8965",
  cream: "#eee4ce",
  coral: "#c57653",
  dark: "#293c2e",
};
type BoxProps = { size: [number, number, number]; color?: string } & Omit<
  ThreeElements["group"],
  "args"
>;
export function Box({ size, color = colors.wood, ...props }: BoxProps) {
  return (
    <group {...props}>
      <RoundedBox
        args={size}
        radius={Math.min(...size) * 0.15}
        smoothness={2}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          roughness={0.86}
          map={
            [
              "#d7c5a5",
              "#d9c9ad",
              "#d4c1a0",
              "#d3c2a6",
              "#b98549",
              "#af7f43",
              "#b98549",
              "#ba8854",
              "#c99960",
              "#c39358",
              "#cda16e",
              "#bd8d54",
              "#ac7d45",
              "#d3c2a6",
            ].includes(color)
              ? woodGrain
              : undefined
          }
          bumpMap={color === colors.wood ? woodGrain : undefined}
          bumpScale={0.006}
        />
      </RoundedBox>
    </group>
  );
}
export function Ball({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  color = colors.green,
  fabric = false,
}: {
  position?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  fabric?: boolean;
}) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[1, 20, 16]} />
      <meshStandardMaterial
        color={color}
        roughness={0.94}
        map={fabric ? wovenFiber : undefined}
        bumpMap={fabric ? wovenFiber : undefined}
        bumpScale={0.01}
      />
    </mesh>
  );
}
export function Cylinder({
  position,
  radius,
  height,
  color,
  woven = false,
}: {
  position: [number, number, number];
  radius: number;
  height: number;
  color: string;
  woven?: boolean;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius * 0.87, height, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.9}
        map={woven ? wovenFiber : undefined}
        bumpMap={woven ? wovenFiber : undefined}
        bumpScale={0.012}
      />
    </mesh>
  );
}
const leafShape = new Shape();
leafShape.moveTo(0, 0);
leafShape.bezierCurveTo(-0.2, 0.2, -0.14, 0.41, 0, 0.58);
leafShape.bezierCurveTo(0.16, 0.4, 0.2, 0.19, 0, 0);
const potProfile = [
  [0.17, 0],
  [0.2, 0.025],
  [0.245, 0.39],
  [0.26, 0.4],
  [0.26, 0.45],
  [0.23, 0.45],
  [0.222, 0.395],
  [0.185, 0.045],
].map(([x, y]) => new Vector2(x, y));
export function Plant({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[potProfile, 40]} />
        <meshStandardMaterial color="#e6e3d9" roughness={0.66} />
      </mesh>
      <Ring
        position={[0, 0.035, 0]}
        radius={0.215}
        tube={0.024}
        color="#ccc7ba"
      />
      <Cylinder
        position={[0, 0.399, 0]}
        radius={0.219}
        height={0.012}
        color="#665440"
      />
      <Curve
        points={[
          [0, 0.38, 0],
          [0.015, 0.7, 0.005],
          [-0.025, 1.05, 0],
        ]}
        radius={0.017}
        color="#64734b"
      />
      {Array.from({ length: 7 }, (_, i) => (
        <group
          key={i}
          position={[0, 0.48 + (i % 3) * 0.16, 0]}
          rotation={[0, i * 2.4, 0]}
        >
          <group
            rotation={[0.3, 0, -0.85 - (i % 2) * 0.3]}
            scale={i > 4 ? 0.85 : 1}
          >
            <mesh castShadow receiveShadow>
              <extrudeGeometry
                args={[
                  leafShape,
                  {
                    depth: 0.012,
                    bevelEnabled: true,
                    bevelSize: 0.012,
                    bevelThickness: 0.009,
                    bevelSegments: 2,
                    steps: 1,
                    curveSegments: 12,
                  },
                ]}
              />
              <meshStandardMaterial
                color={i % 2 ? "#687f4c" : "#87965e"}
                roughness={0.78}
              />
            </mesh>
            <Curve
              radius={0.008}
              color="#a3ad77"
              points={[
                [0, 0.015, 0.032],
                [0, 0.25, 0.032],
                [0, 0.52, 0.032],
              ]}
            />
          </group>
        </group>
      ))}
    </group>
  );
}
export function Books({
  position,
  count = 7,
}: {
  position: [number, number, number];
  count?: number;
}) {
  return (
    <group position={position}>
      {Array.from({ length: count }, (_, i) => {
        const height = 0.42 + (i % 3) * 0.07,
          color = ["#566a4e", "#b78657", "#cab693", "#a76550"][i % 4];
        return (
          <group
            key={i}
            position={[i * 0.145, 0, 0]}
            rotation={[0, 0, i === count - 1 ? -0.12 : 0]}
          >
            <Box
              size={[0.105, height - 0.032, 0.31]}
              position={[0, height / 2, 0]}
              color="#e2d8bb"
            />
            {[-0.056, 0.056].map((x) => (
              <Box
                key={x}
                size={[0.014, height, 0.34]}
                position={[x, height / 2, 0]}
                color={color}
              />
            ))}
            <Box
              size={[0.125, height, 0.026]}
              position={[0, height / 2, 0.165]}
              color={color}
            />
            {[0.065, height - 0.065].map((y) => (
              <Box
                key={y}
                size={[0.1, 0.01, 0.005]}
                position={[0, y, 0.18]}
                color="#d6c091"
              />
            ))}
            <Box
              size={[0.013, 0.12, 0.005]}
              position={[0, height * 0.56, 0.182]}
              color="#dfcfaa"
            />
          </group>
        );
      })}
    </group>
  );
}
export function Desk() {
  return (
    <group position={[-1.1, 0, -1.7]}>
      <Box size={[2.65, 0.16, 1]} position={[0, 1.28, 0]} />
      {[-1.05, 1.05].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <Box
            size={[0.14, 0.62, 0.17]}
            position={[0, 0.34, 0]}
            color="#e0e0d5"
          />
          <Box
            size={[0.11, 0.58, 0.13]}
            position={[0, 0.91, 0]}
            color="#f0eee4"
          />
          <Box
            size={[0.25, 0.065, 0.92]}
            position={[0, 0.05, 0]}
            color="#d9dcd2"
          />
        </group>
      ))}
      <Box size={[2.13, 0.11, 0.13]} position={[0, 1.16, 0]} color="#d9dcd2" />
      <Box
        size={[0.25, 0.055, 0.1]}
        position={[0.94, 1.17, 0.46]}
        color="#424c45"
      />
      <Box
        size={[0.08, 0.023, 0.012]}
        position={[0.9, 1.175, 0.518]}
        color="#a0c2a5"
      />
      <group>
        <Box
          size={[0.11, 0.57, 0.1]}
          position={[0.22, 1.6, -0.44]}
          color="#444d47"
        />
        <Box
          size={[0.43, 0.075, 0.075]}
          position={[0.06, 1.83, -0.39]}
          rotation={[0, 0, -0.2]}
          color="#505a51"
        />
        <Box
          size={[0.09, 0.22, 0.085]}
          position={[-0.2, 1.84, -0.32]}
          color="#444d47"
        />
      </group>
      <Box
        size={[1.05, 0.72, 0.09]}
        position={[-0.2, 1.9, -0.24]}
        color="#303b32"
      />
      <Box
        size={[0.95, 0.61, 0.02]}
        position={[-0.2, 1.91, -0.18]}
        color="#20342f"
      />
      {Array.from({ length: 9 }, (_, i) => (
        <Box
          key={i}
          size={[0.22 + (i % 4) * 0.11, 0.016, 0.012]}
          position={[-0.38 + (i % 2) * 0.06, 2.12 - i * 0.046, -0.161]}
          color={["#b9c8a1", "#cdad76", "#83a48a"][i % 3]}
        />
      ))}
      <group position={[0.77, 1.64, -0.05]} rotation={[0, -0.12, 0]}>
        <Box
          size={[0.085, 0.26, 0.085]}
          position={[0.16, -0.15, -0.24]}
          color="#48534c"
        />
        <Box
          size={[0.65, 0.045, 0.4]}
          position={[0, -0.03, 0]}
          color="#6f7970"
        />
        <Box size={[0.75, 0.025, 0.48]} color="#bfc4bf" />
        <Box
          size={[0.53, 0.007, 0.18]}
          position={[0, 0.017, -0.08]}
          color="#4d5650"
        />
        <Box
          size={[0.21, 0.008, 0.13]}
          position={[0, 0.017, 0.12]}
          color="#a6afa6"
        />
        <group position={[0, 0.03, -0.23]} rotation={[-0.15, 0, 0]}>
          <Box
            size={[0.75, 0.48, 0.025]}
            position={[0, 0.24, 0]}
            color="#bfc4bf"
          />
          <Box
            size={[0.69, 0.41, 0.013]}
            position={[0, 0.25, 0.019]}
            color="#293d39"
          />
          {Array.from({ length: 6 }, (_, i) => (
            <Box
              key={i}
              size={[0.22 + (i % 3) * 0.08, 0.012, 0.008]}
              position={[-0.09, 0.39 - i * 0.05, 0.03]}
              color={i % 2 ? "#9eb5a0" : "#d0b38a"}
            />
          ))}
          <Ball
            position={[0, 0.46, 0.02]}
            scale={[0.009, 0.009, 0.009]}
            color="#414b44"
          />
        </group>
      </group>
      <Box
        size={[0.8, 0.035, 0.28]}
        position={[-0.2, 1.39, 0.22]}
        color="#4c5847"
      />
      {Array.from({ length: 24 }, (_, i) => (
        <Box
          key={i}
          size={[0.045, 0.01, 0.05]}
          position={[
            -0.51 + (i % 8) * 0.086,
            1.41,
            0.14 + Math.floor(i / 8) * 0.08,
          ]}
          color="#a4ad8e"
        />
      ))}
      <Cylinder
        position={[0.8, 1.4, 0.2]}
        radius={0.11}
        height={0.18}
        color="#f0dfbc"
      />
      <Cylinder
        position={[0.8, 1.498, 0.2]}
        radius={0.084}
        height={0.004}
        color="#4c3324"
      />
      <Cylinder
        position={[-1.04, 1.43, -0.3]}
        radius={0.15}
        height={0.08}
        color="#d1c0a2"
      />
      <Cylinder
        position={[-1.04, 1.67, -0.3]}
        radius={0.025}
        height={0.5}
        color="#d1c0a2"
      />
      <Ball
        position={[-1.04, 1.98, -0.3]}
        scale={[0.085, 0.09, 0.085]}
        color="#ffe6a9"
      />
      <StrawShade />
      <pointLight
        position={[-1.04, 1.95, -0.3]}
        color="#ffce84"
        intensity={0.7}
        distance={3}
      />
      <group position={[0, 0, 0.7]}>
        <Box size={[0.7, 0.13, 0.65]} position={[0, 0.71, 0]} color="#aeb1aa" />
        <Box
          size={[0.7, 0.64, 0.1]}
          position={[0, 1.05, 0.27]}
          color="#aeb1aa"
        />
        {[-0.25, 0.25].flatMap((x) =>
          [-0.23, 0.23].map((z) => (
            <Box
              key={`${x}${z}`}
              size={[0.07, 0.7, 0.07]}
              position={[x, 0.35, z]}
            />
          )),
        )}
      </group>
    </group>
  );
}
export function Bookcase() {
  return (
    <group position={[2, 0, -0.8]} rotation={[0, -Math.PI / 2, 0]}>
      <Box size={[2.45, 0.14, 0.65]} position={[0, 1.05, 0]} />
      <Box size={[2.45, 0.14, 0.65]} position={[0, 0.2, 0]} />
      {[-1.13, 0, 1.13].map((x) => (
        <Box key={x} size={[0.12, 0.85, 0.65]} position={[x, 0.62, 0]} />
      ))}
      <Books position={[-0.98, 0.27, 0]} />
      <Books position={[0.15, 0.27, 0]} count={6} />
      <group position={[-0.55, 1.15, 0]}>
        <Box size={[0.8, 0.12, 0.49]} color="#d3c2a6" />
        <Cylinder
          position={[0, 0.085, 0]}
          radius={0.19}
          height={0.018}
          color="#30352e"
        />
        <Cylinder
          position={[0, 0.098, 0]}
          radius={0.06}
          height={0.01}
          color="#cb9f68"
        />
        {[0.085, 0.11, 0.135, 0.16, 0.18].map((radius) => (
          <Ring
            key={radius}
            position={[0, 0.102, 0]}
            radius={radius}
            tube={0.0025}
            color="#50564d"
          />
        ))}
        <Cylinder
          position={[0, 0.112, 0]}
          radius={0.009}
          height={0.027}
          color="#c7c9b8"
        />
        <Cylinder
          position={[0.28, 0.1, -0.13]}
          radius={0.035}
          height={0.04}
          color="#686b5e"
        />
        <Curve
          radius={0.012}
          color="#c4c5b4"
          points={[
            [0.28, 0.14, -0.13],
            [0.26, 0.145, 0.025],
            [0.15, 0.13, 0.1],
          ]}
        />
        <Box
          size={[0.045, 0.025, 0.065]}
          position={[0.145, 0.12, 0.11]}
          color="#414b3b"
        />
        <Cylinder
          position={[0.29, 0.092, 0.15]}
          radius={0.025}
          height={0.028}
          color="#d8bd80"
        />
        <Box
          size={[0.8, 0.48, 0.045]}
          position={[0, 0.26, -0.23]}
          rotation={[-0.15, 0, 0]}
        />
      </group>
      <Plant position={[0.72, 1.13, 0]} scale={0.7} />
    </group>
  );
}
