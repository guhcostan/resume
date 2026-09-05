import { DoubleSide } from "three";
import { wovenFiber } from "./textures";
import { Ring, Curve } from "./Details";
export function StrawShade() {
  return (
    <group position={[-1.04, 1.99, -0.3]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.25, 0.3, 48, 1, true]} />
        <meshStandardMaterial
          color="#d6c09a"
          map={wovenFiber}
          bumpMap={wovenFiber}
          bumpScale={0.018}
          side={DoubleSide}
          roughness={1}
        />
      </mesh>
      <Ring
        position={[0, -0.15, 0]}
        radius={0.25}
        tube={0.012}
        color="#c5ac83"
      />
      <Ring position={[0, 0.15, 0]} radius={0.15} tube={0.01} color="#c5ac83" />
    </group>
  );
}
export function BeachBasket() {
  return (
    <group position={[-2.57, 0.04, -2.16]}>
      <mesh position={[0, 0.19, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.205, 0.36, 40, 1, true]} />
        <meshStandardMaterial
          color="#d1ba91"
          map={wovenFiber}
          bumpMap={wovenFiber}
          bumpScale={0.015}
          side={DoubleSide}
          roughness={1}
        />
      </mesh>
      <Ring
        position={[0, 0.38, 0]}
        radius={0.25}
        tube={0.024}
        color="#c3ab81"
      />
      {[-1, 1].map((side) => (
        <Curve
          key={side}
          radius={0.018}
          color="#c3ab81"
          points={[
            [side * 0.24, 0.29, -0.08],
            [side * 0.3, 0.46, -0.05],
            [side * 0.3, 0.46, 0.05],
            [side * 0.24, 0.29, 0.08],
          ]}
        />
      ))}
      <mesh
        position={[0, 0.29, 0]}
        scale={[0.2, 0.09, 0.18]}
        rotation={[-0.16, 0, 0.2]}
        castShadow
      >
        <sphereGeometry args={[1, 20, 12]} />
        <meshStandardMaterial color="#e7e5df" map={wovenFiber} roughness={1} />
      </mesh>
    </group>
  );
}
