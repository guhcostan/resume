import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Group, MathUtils, Vector3 } from "three";
import { Ring } from "./Details";
import { Ball, Box, Cylinder } from "./objects";
import {
  cupHome,
  sampleRoutine,
  smooth,
  type Activity,
  type Point,
} from "./routine";
import {
  planRoute,
  sampleRoute,
  type Destination,
  type Route,
} from "./navigation";

export function Character({
  paused,
  destination = null,
  onActivity,
}: {
  paused: boolean;
  destination?: Destination | null;
  onActivity: (activity: Activity) => void;
}) {
  const commanded = useRef<Destination | null>(null);
  const route = useRef<Route | null>(null);
  const routeTime = useRef(0);
  const activity = useRef<Activity>("walk");
  const reported = useRef<Activity | null>(null);
  const root = useRef<Group>(null),
    pelvis = useRef<Group>(null),
    head = useRef<Group>(null);
  const legL = useRef<Group>(null),
    legR = useRef<Group>(null),
    kneeL = useRef<Group>(null),
    kneeR = useRef<Group>(null);
  const armL = useRef<Group>(null),
    armR = useRef<Group>(null),
    elbowL = useRef<Group>(null),
    elbowR = useRef<Group>(null);
  const hand = useRef<Group>(null),
    cup = useRef<Group>(null),
    eyes = useRef<Group>(null),
    sleep = useRef<Group>(null);
  // Development-only fixed pose inspection; production always plays the full routine.
  const previewTime =
    import.meta.env.DEV && new URLSearchParams(location.search).has("sceneTime")
      ? Math.max(
          0,
          Number(new URLSearchParams(location.search).get("sceneTime")) || 0,
        )
      : null;
  const heldBook = useRef<Group>(null),
    heldWeight = useRef<Group>(null),
    heldFood = useRef<Group>(null);
  const time = useRef(0),
    sleepText = useRef<HTMLSpanElement>(null),
    handWorld = useRef(new Vector3());
  useFrame((_, delta) => {
    if (!root.current || !pelvis.current) return;
    if (destination !== commanded.current) {
      route.current = planRoute(
        root.current.position.toArray() as Point,
        activity.current,
        destination,
      );
      routeTime.current = 0;
      commanded.current = destination;
    }
    if (!paused) {
      time.current += Math.min(delta, 0.05);
      routeTime.current += Math.min(delta, 0.05);
    }
    const bones = [
      pelvis,
      head,
      legL,
      legR,
      kneeL,
      kneeR,
      armL,
      armR,
      elbowL,
      elbowR,
    ]
      .map((ref) => ref.current)
      .filter((bone): bone is Group => bone !== null);
    const previous = bones.map((bone) => [bone.rotation.x, bone.rotation.z]);
    const t = previewTime ?? time.current,
      { step, progress, from } = route.current
        ? sampleRoute(route.current, routeTime.current)
        : sampleRoutine(t),
      a = step.activity;
    activity.current = a;
    if (reported.current !== a) {
      reported.current = a;
      onActivity(a);
    }
    const p = smooth(progress),
      walking = a === "walk";
    root.current.position.set(
      MathUtils.lerp(from[0], step.to[0], p),
      MathUtils.lerp(from[1], step.to[1], p),
      MathUtils.lerp(from[2], step.to[2], p),
    );
    const facing = walking
      ? Math.atan2(step.to[0] - from[0], step.to[2] - from[2])
      : step.yaw;
    if (!paused)
      root.current.rotation.y +=
        Math.atan2(
          Math.sin(facing - root.current.rotation.y),
          Math.cos(facing - root.current.rotation.y),
        ) * Math.min(delta * 6, 1);
    let seated =
      a === "code"
        ? 1
        : a === "sit"
          ? smooth((progress - 0.2) / 0.8)
          : a === "stand"
            ? 1 - smooth(progress / 0.65)
            : 0;
    const resting =
      a === "sleep" ? 1 : a === "recline" ? p : a === "wake" ? 1 - p : 0;
    seated = Math.max(seated, resting);
    pelvis.current.rotation.z = 0;
    pelvis.current.rotation.x = resting * -0.95 + (a === "code" ? 0.12 : 0);
    pelvis.current.position.y =
      0.43 + (a === "sleep" ? Math.sin(t * 1.8) * 0.008 : 0);
    const gait = walking ? Math.sin(t * 9) * 0.42 : 0;
    if (walking) root.current.position.y += Math.abs(Math.sin(t * 9)) * 0.025;
    if (legL.current)
      legL.current.rotation.x = -seated * 1.48 + resting * 0.95 + gait;
    if (legR.current)
      legR.current.rotation.x = -seated * 1.48 + resting * 0.95 - gait;
    if (kneeL.current)
      kneeL.current.rotation.x = seated * (resting ? 0.45 : 1.48);
    if (kneeR.current)
      kneeR.current.rotation.x = seated * (resting ? 0.6 : 1.48);
    const coding = a === "code";
    const reading = a === "read";
    const reaching =
      a === "reach"
        ? smooth(progress / 0.65)
        : a === "return-cup"
          ? 1 - smooth((progress - 0.35) / 0.65)
          : 0;
    const drinking = a === "coffee";
    const sip = drinking
      ? smooth((Math.sin(progress * Math.PI * 4 - 0.8) + 0.15) / 0.9)
      : 0;
    if (armL.current) {
      armL.current.rotation.x = coding
        ? -1.95 + Math.sin(t * 19) * 0.045
        : resting * -0.35 - gait * 0.6;
      armL.current.rotation.z = resting * -0.4;
    }
    if (elbowL.current)
      elbowL.current.rotation.x = coding
        ? -0.38 + Math.sin(t * 23) * 0.08
        : resting * -0.4;
    if (armR.current) {
      armR.current.rotation.x = coding
        ? -1.95 + Math.sin(t * 21) * 0.045
        : drinking
          ? -1.2 - sip * 0.75
          : -reaching * 0.95 + resting * -0.35 + gait * 0.6;
      armR.current.rotation.z = drinking
        ? -0.35
        : reaching * -0.05 + resting * 0.4;
    }
    if (elbowR.current)
      elbowR.current.rotation.x = coding
        ? -0.38 + Math.sin(t * 25) * 0.08
        : drinking
          ? -1.3 - sip * 0.15
          : -reaching * 0.3;
    if (reading && armR.current)
      armR.current.rotation.x = -1.2 + Math.sin(t * 2) * 0.1;
    if (head.current) {
      head.current.rotation.x = coding
        ? -0.12 + Math.sin(t * 2) * 0.035
        : resting * 0.18 + reaching * 0.22 - sip * 0.1;
      head.current.rotation.z = resting * 0.12;
    }
    // Each station has its own articulated pose; companion characters stay at rest.
    const petting = a === "pet",
      training = a === "exercise",
      jogging = a === "jog",
      balancing = a === "balance",
      eating = a === "eat";
    if (heldBook.current) heldBook.current.visible = reading;
    if (heldWeight.current) heldWeight.current.visible = training;
    if (heldFood.current) heldFood.current.visible = eating;
    if (reading) {
      if (armL.current) armL.current.rotation.x = -1.25;
      if (armR.current) armR.current.rotation.x = -1.25;
      if (elbowL.current) elbowL.current.rotation.x = -0.7;
      if (elbowR.current) elbowR.current.rotation.x = -0.7;
      if (head.current) head.current.rotation.x = 0.22;
    }
    if (petting) {
      pelvis.current.position.y = 0.24;
      pelvis.current.rotation.x = 0.45;
      if (legL.current) legL.current.rotation.x = -0.8;
      if (legR.current) legR.current.rotation.x = -0.8;
      if (kneeL.current) kneeL.current.rotation.x = 1.5;
      if (kneeR.current) kneeR.current.rotation.x = 1.5;
      if (armR.current) armR.current.rotation.x = -0.8 + Math.sin(t * 3) * 0.12;
      if (head.current) head.current.rotation.x = 0.25;
    }
    if (training) {
      if (armR.current) armR.current.rotation.x = -0.25;
      if (elbowR.current)
        elbowR.current.rotation.x = -1.1 - Math.sin(t * 2.5) * 0.85;
      if (armL.current) armL.current.rotation.z = -0.15;
    }
    if (jogging) {
      const stride = Math.sin(t * 11);
      pelvis.current.position.y = 0.43 + Math.abs(stride) * 0.055;
      if (legL.current) legL.current.rotation.x = stride * 0.65;
      if (legR.current) legR.current.rotation.x = -stride * 0.65;
      if (kneeL.current) kneeL.current.rotation.x = Math.max(0, -stride) * 0.8;
      if (kneeR.current) kneeR.current.rotation.x = Math.max(0, stride) * 0.8;
      if (armL.current) armL.current.rotation.x = -stride * 0.6;
      if (armR.current) armR.current.rotation.x = stride * 0.6;
      if (elbowL.current) elbowL.current.rotation.x = -1.35;
      if (elbowR.current) elbowR.current.rotation.x = -1.35;
    }
    if (balancing) {
      pelvis.current.rotation.z = Math.sin(t * 1.8) * 0.12;
      pelvis.current.position.y = 0.39;
      if (armL.current)
        armL.current.rotation.z = -1.25 + Math.sin(t * 1.8) * 0.12;
      if (armR.current)
        armR.current.rotation.z = 1.25 + Math.sin(t * 1.8) * 0.12;
      if (legL.current) legL.current.rotation.x = -0.25;
      if (legR.current) legR.current.rotation.x = -0.25;
      if (kneeL.current) kneeL.current.rotation.x = 0.45;
      if (kneeR.current) kneeR.current.rotation.x = 0.45;
    }
    if (eating) {
      const bite = (Math.sin(t * 2) + 1) / 2;
      if (armR.current) armR.current.rotation.x = -1.3 - bite * 0.6;
      if (elbowR.current) elbowR.current.rotation.x = -1.2;
      if (head.current) head.current.rotation.x = bite * 0.08;
    }
    if (eyes.current)
      eyes.current.scale.y =
        resting > 0.8 ? 0.12 : Math.sin(t * 1.7) > 0.994 ? 0.15 : 1;
    if (sleep.current) {
      sleep.current.visible = resting > 0.85;
      sleep.current.position.y = 1.8 + Math.sin(t * 1.8) * 0.045;
    }
    bones.forEach((bone, i) => {
      bone.rotation.x = MathUtils.damp(
        previous[i][0],
        bone.rotation.x,
        10,
        paused ? 0 : Math.min(delta, 0.05),
      );
      bone.rotation.z = MathUtils.damp(
        previous[i][1],
        bone.rotation.z,
        10,
        paused ? 0 : Math.min(delta, 0.05),
      );
    });
    if (sleepText.current)
      sleepText.current.style.opacity = resting > 0.85 ? "1" : "0";
    if (cup.current && hand.current) {
      root.current.updateMatrixWorld(true);
      hand.current.getWorldPosition(handWorld.current);
      const hold = drinking
        ? 1
        : a === "reach"
          ? smooth((progress - 0.45) / 0.5)
          : a === "return-cup"
            ? 1 - smooth(progress / 0.55)
            : 0;
      cup.current.position.set(...cupHome).lerp(handWorld.current, hold);
      cup.current.rotation.z = -sip * 0.35;
    }
  });
  return (
    <>
      <group ref={root} position={[0, 0.045, 0.7]} scale={0.82}>
        <group ref={pelvis} position={[0, 0.43, 0]}>
          <group ref={legL} position={[-0.13, 0, 0]}>
            <Box
              size={[0.23, 0.22, 0.25]}
              position={[0, -0.09, 0]}
              color="#3d413b"
            />
            <group ref={kneeL} position={[0, -0.19, 0]}>
              <Box
                size={[0.22, 0.17, 0.24]}
                position={[0, -0.065, 0]}
                color="#c98f65"
              />
              <Box
                size={[0.25, 0.15, 0.35]}
                position={[0, -0.14, 0.045]}
                color="#e8d8b8"
              />
            </group>
          </group>
          <group ref={legR} position={[0.13, 0, 0]}>
            <Box
              size={[0.23, 0.22, 0.25]}
              position={[0, -0.09, 0]}
              color="#3d413b"
            />
            <group ref={kneeR} position={[0, -0.19, 0]}>
              <Box
                size={[0.22, 0.17, 0.24]}
                position={[0, -0.065, 0]}
                color="#c98f65"
              />
              <Box
                size={[0.25, 0.15, 0.35]}
                position={[0, -0.14, 0.045]}
                color="#e8d8b8"
              />
            </group>
          </group>
          <Box
            size={[0.58, 0.55, 0.36]}
            position={[0, 0.29, 0]}
            color="#929b98"
          />
          <group ref={armL} position={[-0.33, 0.46, 0]}>
            <Box
              size={[0.2, 0.23, 0.25]}
              position={[0, -0.09, 0]}
              color="#929b98"
            />
            <group ref={elbowL} position={[0, -0.19, 0]}>
              <Box
                size={[0.185, 0.065, 0.205]}
                position={[0, -0.14, 0]}
                color="#303531"
              />
              <Ball
                position={[-0.015, -0.14, 0.11]}
                scale={[0.06, 0.04, 0.015]}
                color="#1b2524"
              />
              <Box
                size={[0.16, 0.17, 0.19]}
                position={[0, -0.065, 0]}
                color="#c98f65"
              />
              <Ball
                position={[0, -0.19, 0]}
                scale={[0.105, 0.11, 0.1]}
                color="#c98f65"
              />
            </group>
          </group>
          <group ref={armR} position={[0.33, 0.46, 0]}>
            <Box
              size={[0.2, 0.23, 0.25]}
              position={[0, -0.09, 0]}
              color="#929b98"
            />
            <group ref={elbowR} position={[0, -0.19, 0]}>
              <Box
                size={[0.16, 0.17, 0.19]}
                position={[0, -0.065, 0]}
                color="#c98f65"
              />
              <Ball
                position={[0, -0.19, 0]}
                scale={[0.105, 0.11, 0.1]}
                color="#c98f65"
              />
              <group ref={hand} position={[0.03, -0.2, 0.07]}>
                <group
                  ref={heldWeight}
                  visible={false}
                  rotation={[0, 0, Math.PI / 2]}
                >
                  <Cylinder
                    position={[0, 0, 0]}
                    radius={0.035}
                    height={0.38}
                    color="#7d837a"
                  />
                  {[-0.17, 0.17].map((y) => (
                    <Cylinder
                      key={y}
                      position={[0, y, 0]}
                      radius={0.11}
                      height={0.085}
                      color="#424e48"
                    />
                  ))}
                </group>
                <group ref={heldFood} visible={false}>
                  <Ball scale={[0.1, 0.065, 0.1]} color="#c99557" />
                </group>
                <group
                  ref={heldBook}
                  visible={false}
                  position={[-0.27, 0, 0]}
                  rotation={[0.3, 0, 0]}
                >
                  <Box size={[0.54, 0.035, 0.36]} color="#6d7954" />
                  <Box
                    size={[0.5, 0.06, 0.32]}
                    position={[0, 0.04, 0]}
                    color="#ede1c5"
                  />
                  <Box
                    size={[0.015, 0.065, 0.32]}
                    position={[0, 0.04, 0]}
                    color="#cbbd9c"
                  />
                </group>
              </group>
            </group>
          </group>
          <group ref={head} position={[0, 0.74, 0]}>
            <group position={[0, -1.17, 0]}>
              <Ball
                position={[0, 1.29, 0]}
                scale={[0.4, 0.41, 0.34]}
                color="#c98f65"
              />
              <Ball
                position={[-0.4, 1.27, 0]}
                scale={[0.09, 0.12, 0.08]}
                color="#c98f65"
              />
              <Ball
                position={[0.4, 1.27, 0]}
                scale={[0.09, 0.12, 0.08]}
                color="#c98f65"
              />
              <Ball
                position={[0, 1.08, 0.08]}
                scale={[0.32, 0.2, 0.27]}
                color="#49342a"
              />
              <Ball
                position={[0, 1.12, 0.23]}
                scale={[0.22, 0.09, 0.11]}
                color="#c98f65"
              />
              {[-0.165, 0.165].map((x) => (
                <group
                  key={x}
                  position={[x, 1.32, 0.31]}
                  rotation={[0, x * 0.35, 0]}
                >
                  <Box size={[0.305, 0.225, 0.055]} color="#202421" />
                  <Box
                    size={[0.245, 0.165, 0.015]}
                    position={[0, 0, 0.035]}
                    color="#292e29"
                  />
                  <Box
                    size={[0.11, 0.012, 0.01]}
                    position={[-0.04, 0.05, 0.045]}
                    rotation={[0, 0, 0.3]}
                    color="#596056"
                  />
                </group>
              ))}
              <Box
                size={[0.08, 0.055, 0.055]}
                position={[0, 1.34, 0.34]}
                color="#202421"
              />
              {[-0.34, 0.34].map((x) => (
                <Box
                  key={x}
                  size={[0.035, 0.045, 0.32]}
                  position={[x, 1.34, 0.15]}
                  color="#202421"
                />
              ))}
              <group ref={eyes} position={[0, 1.3, 0.31]}>
                {[-0.14, 0.14].map((x) => (
                  <Ball
                    key={x}
                    position={[x, 0, 0]}
                    scale={[0.041, 0.057, 0.02]}
                    color="#302c23"
                  />
                ))}
              </group>
              {[-0.14, 0.14].map((x) => (
                <Box
                  key={x}
                  size={[0.12, 0.035, 0.03]}
                  position={[x, 1.41, 0.3]}
                  color="#44392b"
                />
              ))}
              <Ball
                position={[0, 1.19, 0.34]}
                scale={[0.07, 0.065, 0.07]}
                color="#c28d5e"
              />
              <Ball
                position={[0, 1.07, 0.24]}
                scale={[0.18, 0.09, 0.09]}
                color="#423027"
              />
              <Ball
                position={[0, 1.09, 0.32]}
                scale={[0.09, 0.025, 0.015]}
                color="#f5dfbc"
              />
              <Ball
                position={[-0.06, 1.16, 0.33]}
                scale={[0.09, 0.035, 0.024]}
                color="#423027"
              />
              <Ball
                position={[0.06, 1.16, 0.33]}
                scale={[0.09, 0.035, 0.024]}
                color="#423027"
              />
              <Ball
                position={[0, 1.57, -0.025]}
                scale={[0.39, 0.22, 0.34]}
                color="#282720"
              />
              {Array.from({ length: 8 }, (_, i) => (
                <Ball
                  key={i}
                  position={[
                    -0.3 + (i % 4) * 0.18,
                    1.58 + Math.floor(i / 4) * 0.08,
                    0.17 - Math.floor(i / 4) * 0.18,
                  ]}
                  scale={[0.145, 0.12, 0.18]}
                  color={i % 2 ? "#35312a" : "#282720"}
                />
              ))}
            </group>
          </group>
        </group>
        <group ref={sleep} position={[0, 1.8, 0]} visible={false}>
          <Html center>
            <span
              ref={sleepText}
              className="sleep-symbol"
              style={{ opacity: 0 }}
              aria-hidden="true"
            >
              z z Z
            </span>
          </Html>
        </group>
      </group>
      <group ref={cup} position={cupHome}>
        <Ring
          position={[0, 0.084, 0]}
          radius={0.083}
          tube={0.009}
          color="#eee3c9"
        />
        <Cylinder
          position={[0, 0, 0]}
          radius={0.095}
          height={0.16}
          color="#eee0bd"
        />
        <Cylinder
          position={[0, 0.085, 0]}
          radius={0.071}
          height={0.003}
          color="#4b3527"
        />
        <mesh position={[0.1, 0, 0]}>
          <torusGeometry args={[0.052, 0.015, 8, 20]} />
          <meshStandardMaterial color="#929b98" />
        </mesh>
      </group>
    </>
  );
}
