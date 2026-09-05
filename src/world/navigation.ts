import {
  chair,
  lounge,
  routine,
  type Activity,
  type Point,
  type Step,
} from "./routine.ts";
import type { Destination } from "./stations.ts";
export type { Destination } from "./stations.ts";
export type Route = {
  start: Point;
  steps: Step[];
  destination: Destination | null;
};
const center: Point = [-0.2, 0.045, 0.35];
const deskEntry: Point = [-0.43, 0.045, -0.62];
const coffee: Point = [-1.07, 0.045, 1.6];
const library: Point = [1.25, 0.045, -0.3];
export function planRoute(
  start: Point,
  activity: Activity,
  destination: Destination | null,
): Route {
  const steps: Step[] = [];
  const add = (activity: Activity, to: Point, duration: number, yaw = 0) =>
    steps.push({ activity, to, duration, yaw });
  // Finish releasing the object/seat before accepting a new destination.
  if (
    activity === "coffee" ||
    activity === "reach" ||
    activity === "return-cup"
  )
    add("return-cup", start, 1.2, 0);
  if (start[1] > 0.12) {
    const atDesk = start[2] < 0;
    add(
      atDesk ? "stand" : "wake",
      atDesk ? deskEntry : [-1.63, 0.045, 0.7],
      1.4,
      atDesk ? Math.PI / 2 : 1.5,
    );
  }
  const walk = (to: Point) => {
    const from = steps.at(-1)?.to ?? start;
    const distance = Math.hypot(to[0] - from[0], to[2] - from[2]);
    if (distance > 0.025)
      add(
        "walk",
        to,
        Math.max(0.45, distance / 0.7),
        Math.atan2(to[0] - from[0], to[2] - from[2]),
      );
  };
  // A shared clear corridor connects all stations; never cut across the furniture.
  walk(center);
  if (destination === "projects") {
    walk(deskEntry);
    add("sit", chair, 1.6, Math.PI);
    add("code", chair, 10, Math.PI);
  } else if (destination === "about") {
    walk(coffee);
    add("reach", coffee, 1.8);
    add("coffee", coffee, 7);
  } else if (destination === "experience") {
    walk(library);
    add("read", library, 8, Math.PI / 2);
  } else if (destination === "rest") {
    walk([-1.63, 0.045, 0.7]);
    add("recline", lounge, 2.2, 0.4);
    add("sleep", lounge, 8, 0.4);
  } else if (destination) {
    const targets: Partial<
      Record<Destination, { point: Point; activity: Activity; yaw: number }>
    > = {
      dogs: { point: [0.65, 0.045, 1.65], activity: "pet", yaw: 0 },
      fitness: {
        point: [-1.9, 0.045, -0.05],
        activity: "exercise",
        yaw: -Math.PI / 2,
      },
      run: { point: [-1.8, 0.045, 0.35], activity: "jog", yaw: 0.2 },
      surf: { point: [0.8, 0.045, -0.65], activity: "balance", yaw: -0.5 },
      food: { point: [1.1, 0.045, -1.4], activity: "eat", yaw: Math.PI / 2 },
    };
    const target = targets[destination]!;
    if (destination === "food") walk([1.1, 0.045, -0.3]);
    walk(target.point);
    add(target.activity, target.point, 8, target.yaw);
  } else walk([0, 0.045, 0.7]);
  return { start, steps, destination };
}
export function sampleRoute(route: Route, elapsed: number) {
  let remaining = elapsed,
    from = route.start;
  for (let i = 0; i < route.steps.length; i++) {
    const step = route.steps[i],
      last = i === route.steps.length - 1;
    if (remaining < step.duration || (last && route.destination))
      return {
        step,
        from,
        progress:
          last && remaining >= step.duration
            ? (remaining % step.duration) / step.duration
            : remaining / step.duration,
      };
    remaining -= step.duration;
    from = step.to;
  }
  // Closing the reader resumes the ambient routine only after walking back safely.
  const total = routine.reduce((n, s) => n + s.duration, 0);
  remaining %= total;
  for (const step of routine) {
    if (remaining < step.duration)
      return { step, from, progress: remaining / step.duration };
    remaining -= step.duration;
    from = step.to;
  }
  return { step: routine[0], from, progress: 0 };
}
