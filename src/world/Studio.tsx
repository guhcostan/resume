import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import type { OrbitControls as Controls } from "three-stdlib";
import { Box, Ball, Books, Cylinder, Desk, Bookcase, Plant } from "./objects";
import { Character } from "./Character";
import { PersonalObjects, CoastalPrint } from "./PersonalObjects";
import { Interactions } from "./Interactions";
import type { Destination } from "./stations";
import { BeachBasket } from "./BeachDetails";
import { Family } from "./Family";
import type { Activity } from "./routine";
type Props = {
  onZoom: (zoom: number) => void;
  onActivity: (activity: Activity) => void;
  destination: Destination | null;
  paused: boolean;
  night: boolean;
  zoom: number;
  reset: number;
  en: boolean;
  onSelect: (destination: Destination) => void;
};
// Three.js cameras are imperative mutable objects; synchronize them inside effects.
/* eslint-disable react-hooks/immutability */
function Camera({
  zoom,
  reset,
  onZoom,
}: Pick<Props, "zoom" | "reset" | "onZoom">) {
  const controls = useRef<Controls>(null);
  const { camera, size } = useThree();
  const fit = Math.min(
    size.width / (size.width < 600 ? 9.2 : 10),
    size.height / 8,
  );
  useEffect(() => {
    camera.zoom =
      Math.min(size.width / (size.width < 600 ? 9.2 : 10), size.height / 8) *
      zoom;
    camera.updateProjectionMatrix();
  }, [camera, size, zoom]);
  useEffect(() => {
    camera.position.set(-9, 8, 11);
    controls.current?.target.set(0, 1.15, 0);
    controls.current?.update();
  }, [camera, reset]);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      minPolarAngle={0.5}
      maxPolarAngle={1.35}
      minAzimuthAngle={-1.35}
      maxAzimuthAngle={0.25}
      minZoom={fit * 0.7}
      maxZoom={fit * 1.6}
      onEnd={() => onZoom(Math.round((camera.zoom / fit) * 100) / 100)}
      target={[0, 1.15, 0]}
    />
  );
}
/* eslint-enable react-hooks/immutability */
function Room({ paused, night, en, destination, onActivity, onSelect }: Props) {
  return (
    <group>
      <Box size={[6.1, 0.32, 5.7]} position={[0, -0.18, 0]} color="#d4c1a0" />
      {Array.from({ length: 19 }, (_, i) => (
        <Box
          key={i}
          size={[0.307, 0.035, 5.63]}
          position={[-2.85 + i * 0.317, 0, 0]}
          color={["#e3d8c4", "#dcd0b9", "#e8dfce", "#dfd4bf"][i % 4]}
        />
      ))}
      <Box size={[6, 0.05, 0.09]} position={[0, 0.025, 2.79]} color="#e4d6bd" />
      <Box size={[6.05, 3.2, 0.14]} position={[0, 1.6, -2.8]} color="#eeede5" />
      <Box size={[0.14, 3.2, 5.6]} position={[3, 1.6, 0]} color="#e5e5df" />
      <Box size={[6, 0.13, 0.07]} position={[0, 0.1, -2.69]} color="#f2f0e8" />
      <Box size={[0.07, 0.13, 5.6]} position={[2.9, 0.1, 0]} color="#f2f0e8" />
      <group position={[-1.85, 2.1, -2.67]}>
        <Box size={[1.4, 1.83, 0.14]} color="#d9c9ad" />
        <Box
          size={[1.24, 1.65, 0.03]}
          position={[0, 0, 0.08]}
          color={night ? "#263c57" : "#dce8e7"}
        />
        <Box
          size={[0.06, 1.65, 0.08]}
          position={[0, 0, 0.13]}
          color="#f6f3eb"
        />
        <Box
          size={[1.24, 0.06, 0.08]}
          position={[0, 0, 0.13]}
          color="#f6f3eb"
        />
        <Box
          size={[1.53, 0.12, 0.35]}
          position={[0, -0.95, 0.1]}
          color="#d9c9ad"
        />
        {Array.from({ length: 6 }, (_, i) => (
          <Box
            key={i}
            size={[1.45, 0.08, 0.1]}
            position={[0, 0.86 - i * 0.09, 0.16]}
            color="#d6c3a0"
          />
        ))}
        <Plant position={[0.38, -0.88, 0.12]} scale={0.34} />
      </group>
      <CoastalPrint />
      <Box
        size={[1.5, 0.12, 0.42]}
        position={[1.8, 2.32, -2.48]}
        color="#d9c9ad"
      />
      <Books position={[1.65, 2.39, -2.48]} count={4} />
      <Plant position={[1.29, 2.37, -2.46]} scale={0.52} />
      <group position={[2.88, 2.2, -0.05]} rotation={[0, -Math.PI / 2, 0]}>
        <Box size={[1.05, 1.32, 0.09]} color="#d9c9ad" />
        <Box
          size={[0.94, 1.21, 0.018]}
          position={[0, 0, 0.055]}
          color="#f0ebe0"
        />
        <Html transform position={[0, 0, 0.07]} scale={0.14}>
          <div className="poster">
            {en ? (
              <>
                build things.
                <br />
                <em>stay curious.</em>
              </>
            ) : (
              <>
                criar coisas.
                <br />
                <em>seguir curioso.</em>
              </>
            )}
          </div>
        </Html>
      </group>
      <Desk />
      <Bookcase />
      <Cylinder
        position={[0, 0.035, 0.6]}
        radius={1.78}
        height={0.04}
        color="#ded0b3"
        woven
      />
      {[1.68, 1.48, 1.39, 0.96, 0.88].map((r, i) => (
        <mesh
          key={r}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.06, 0.6]}
          receiveShadow
        >
          <ringGeometry args={[r, r + 0.018 + (i % 2) * 0.02, 100]} />
          <meshStandardMaterial color={i % 2 ? "#c4b69a" : "#d5c9b1"} />
        </mesh>
      ))}
      <Plant position={[-2.5, 0.03, -0.95]} scale={1.15} />
      <Plant position={[2.65, 0.02, 2.4]} scale={0.85} />
      <group position={[-1.98, 0, 1.5]} rotation={[0, 0.4, 0]}>
        <Ball
          position={[0, 0.33, 0]}
          scale={[0.66, 0.35, 0.67]}
          color="#d5cec0"
          fabric
        />
        <Ball
          position={[0, 0.45, -0.24]}
          scale={[0.62, 0.33, 0.34]}
          color="#ddd6c9"
          fabric
        />
        <Box
          size={[0.48, 0.24, 0.17]}
          position={[0, 0.55, -0.21]}
          rotation={[-0.2, 0, 0.15]}
          color="#a9b1b0"
        />
      </group>
      <group position={[-0.85, 0, 2.05]}>
        <Cylinder
          position={[0, 0.43, 0]}
          radius={0.41}
          height={0.1}
          color="#d9c9ad"
        />
        {[0, 2.1, 4.2].map((a) => (
          <Box
            key={a}
            size={[0.065, 0.4, 0.065]}
            position={[Math.sin(a) * 0.28, 0.2, Math.cos(a) * 0.28]}
          />
        ))}
      </group>
      <group position={[1.15, 0.09, 1.8]} rotation={[0, 0.24, 0]}>
        <Box size={[0.61, 0.09, 0.43]} color="#c7b99e" />
        <Box
          size={[0.54, 0.065, 0.39]}
          position={[0.06, 0.08, 0]}
          color="#acb4b1"
        />
        <Box
          size={[0.49, 0.055, 0.34]}
          position={[0.03, 0.15, 0.02]}
          color="#e9e1d3"
        />
      </group>
      <Character
        paused={paused}
        destination={destination}
        onActivity={onActivity}
      />
      <Family paused={paused} />
      <PersonalObjects />
      <BeachBasket />
      <Interactions en={en} onSelect={onSelect} />
    </group>
  );
}
export default function Studio(props: Props) {
  const [lost, setLost] = useState(false);
  return (
    <div
      className="canvas-wrap"
      aria-label={
        props.en
          ? "3D studio with Gustavo, his girlfriend reading and a resting golden retriever and chihuahua"
          : "Ateliê 3D com Gustavo, sua namorada lendo e um golden e um chihuahua descansando"
      }
    >
      {lost ? (
        <p className="world-error">
          {props.en
            ? "3D unavailable. Use Explore to access the content."
            : "3D indisponível. Use Explorar para acessar os conteúdos."}
        </p>
      ) : (
        <Canvas
          orthographic
          shadows
          dpr={[1, 1.7]}
          camera={{ position: [-9, 8, 11], zoom: 70, near: 0.1, far: 100 }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              "webglcontextlost",
              () => setLost(true),
              { once: true },
            );
          }}
          fallback={<p>3D indisponível. Use o menu para explorar.</p>}
        >
          <ambientLight
            intensity={props.night ? 0.65 : 1.45}
            color={props.night ? "#b9caef" : "#fffaf1"}
          />
          <directionalLight
            position={[-3, 7, 4]}
            intensity={props.night ? 0.8 : 3.3}
            color={props.night ? "#9eafff" : "#fff4e3"}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-7}
            shadow-camera-right={7}
            shadow-camera-top={7}
            shadow-camera-bottom={-7}
            shadow-normalBias={0.04}
          />
          <Suspense fallback={null}>
            <Room {...props} />
            <ContactShadows
              position={[0, -0.36, 0]}
              opacity={0.35}
              scale={15}
              blur={2.8}
              far={6}
              resolution={512}
            />
          </Suspense>
          <Camera zoom={props.zoom} reset={props.reset} onZoom={props.onZoom} />
        </Canvas>
      )}
    </div>
  );
}
