import { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { stations, type Destination } from "./stations";
export function Interactions({
  en,
  onSelect,
}: {
  en: boolean;
  onSelect: (id: Destination) => void;
}) {
  const [hovered, setHovered] = useState<Destination | null>(null);
  const { gl } = useThree();
  useEffect(() => {
    gl.domElement.style.setProperty("cursor", hovered ? "pointer" : "grab");
    return () => {
      gl.domElement.style.removeProperty("cursor");
    };
  }, [gl, hovered]);
  return (
    <group>
      {stations.map((station) => (
        <group key={station.id} position={station.position}>
          <mesh
            onPointerOver={(event) => {
              event.stopPropagation();
              setHovered(station.id);
            }}
            onPointerOut={() =>
              setHovered((current) => (current === station.id ? null : current))
            }
            onClick={(event) => {
              event.stopPropagation();
              if (event.delta > 5) return;
              setHovered(null);
              onSelect(station.id);
            }}
          >
            <boxGeometry args={station.size} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          {hovered === station.id && (
            <>
              <mesh>
                <boxGeometry args={station.size} />
                <meshBasicMaterial
                  color="#f8e7b0"
                  transparent
                  opacity={0.075}
                  depthWrite={false}
                />
              </mesh>
              <Html
                center
                position={[0, station.size[1] / 2 + 0.16, 0]}
                style={{ pointerEvents: "none" }}
                zIndexRange={[10, 0]}
              >
                <div className="object-tooltip" role="tooltip">
                  <strong>{station.label[en ? 1 : 0]}</strong>
                  <span>{station.hint[en ? 1 : 0]}</span>
                </div>
              </Html>
            </>
          )}
        </group>
      ))}
    </group>
  );
}
