import { useMemo } from "react";
import { CatmullRomCurve3, Vector3 } from "three";
import type { Point } from "./routine";
/** Small curves for seams, cables, stems and soft sculpted details. */
export function Curve({
  points,
  radius = 0.01,
  color = "#5e6950",
}: {
  points: Point[];
  radius?: number;
  color?: string;
}) {
  const curve = useMemo(
    () => new CatmullRomCurve3(points.map((p) => new Vector3(...p))),
    [points],
  );
  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, 24, radius, 6, false]} />
      <meshStandardMaterial color={color} roughness={0.75} />
    </mesh>
  );
}
export function Ring({
  radius,
  tube = 0.01,
  color,
  position = [0, 0, 0],
}: {
  radius: number;
  tube?: number;
  color: string;
  position?: Point;
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} castShadow>
      <torusGeometry args={[radius, tube, 8, 48]} />
      <meshStandardMaterial color={color} roughness={0.65} />
    </mesh>
  );
}
