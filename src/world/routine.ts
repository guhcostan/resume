export type Activity =
  | "pet"
  | "exercise"
  | "jog"
  | "balance"
  | "eat"
  | "read"
  | "walk"
  | "sit"
  | "code"
  | "stand"
  | "reach"
  | "coffee"
  | "return-cup"
  | "recline"
  | "sleep"
  | "wake";
export type Point = [number, number, number];
export type Step = {
  activity: Activity;
  duration: number;
  to: Point;
  yaw: number;
};
export const chair: Point = [-1.1, 0.45, -1.0];
export const lounge: Point = [-1.98, 0.25, 1.52];
export const cupHome: Point = [-0.8, 0.56, 1.94];
// Approach/exit corridors are explicit so the avatar does not cut through furniture.
export const routine: Step[] = [
  { activity: "walk", duration: 2.4, to: [-0.43, 0.045, -0.62], yaw: Math.PI },
  { activity: "sit", duration: 1.6, to: chair, yaw: Math.PI },
  { activity: "code", duration: 10, to: chair, yaw: Math.PI },
  {
    activity: "stand",
    duration: 1.5,
    to: [-0.43, 0.045, -0.62],
    yaw: Math.PI / 2,
  },
  { activity: "walk", duration: 2.3, to: [0.05, 0.045, 0.5], yaw: 0.3 },
  { activity: "walk", duration: 1.9, to: [-1.07, 0.045, 1.6], yaw: 0 },
  { activity: "reach", duration: 1.8, to: [-1.07, 0.045, 1.6], yaw: 0 },
  { activity: "coffee", duration: 7, to: [-1.07, 0.045, 1.6], yaw: 0 },
  {
    activity: "return-cup",
    duration: 1.8,
    to: [-1.07, 0.045, 1.6],
    yaw: 0,
  },
  { activity: "walk", duration: 1.8, to: [-0.9, 0.045, 0.65], yaw: -2.6 },
  { activity: "walk", duration: 1.8, to: [-1.63, 0.045, 0.7], yaw: -1.5 },
  { activity: "recline", duration: 2.2, to: lounge, yaw: 0.4 },
  { activity: "sleep", duration: 8, to: lounge, yaw: 0.4 },
  { activity: "wake", duration: 2, to: [-1.63, 0.045, 0.7], yaw: 1.5 },
  { activity: "walk", duration: 2.5, to: [0, 0.045, 0.7], yaw: 1.57 },
  { activity: "walk", duration: 1.8, to: [0.65, 0.045, 1.65], yaw: 0.6 },
  { activity: "pet", duration: 7, to: [0.65, 0.045, 1.65], yaw: 0 },
  { activity: "walk", duration: 2.2, to: [-0.2, 0.045, 0.35], yaw: -2.5 },
  { activity: "walk", duration: 2.4, to: [-1.9, 0.045, -0.05], yaw: -1.8 },
  {
    activity: "exercise",
    duration: 7,
    to: [-1.9, 0.045, -0.05],
    yaw: -Math.PI / 2,
  },
  { activity: "walk", duration: 0.8, to: [-1.8, 0.045, 0.35], yaw: 0.2 },
  { activity: "jog", duration: 6, to: [-1.8, 0.045, 0.35], yaw: 0.2 },
  { activity: "walk", duration: 2.3, to: [-0.2, 0.045, 0.35], yaw: 1.57 },
  { activity: "walk", duration: 2, to: [0.8, 0.045, -0.65], yaw: 2.3 },
  { activity: "balance", duration: 6, to: [0.8, 0.045, -0.65], yaw: -0.5 },
  { activity: "walk", duration: 1, to: [1.1, 0.045, -0.3], yaw: 0.7 },
  { activity: "walk", duration: 1.6, to: [1.1, 0.045, -1.4], yaw: Math.PI },
  { activity: "eat", duration: 7, to: [1.1, 0.045, -1.4], yaw: Math.PI / 2 },
  { activity: "walk", duration: 1.6, to: [1.25, 0.045, -0.3], yaw: 0 },
  { activity: "read", duration: 7, to: [1.25, 0.045, -0.3], yaw: Math.PI / 2 },
  { activity: "walk", duration: 2, to: [-0.2, 0.045, 0.35], yaw: -1.1 },
  { activity: "walk", duration: 0.8, to: [0, 0.045, 0.7], yaw: 0.5 },
];
export const smooth = (t: number) => {
  const v = Math.max(0, Math.min(1, t));
  return v * v * (3 - 2 * v);
};
export function sampleRoutine(elapsed: number) {
  const total = routine.reduce((sum, step) => sum + step.duration, 0);
  let time = ((elapsed % total) + total) % total;
  for (let index = 0; index < routine.length; index++) {
    const step = routine[index];
    if (time < step.duration)
      return {
        step,
        index,
        progress: time / step.duration,
        from: index ? routine[index - 1].to : ([0, 0.045, 0.7] as Point),
      };
    time -= step.duration;
  }
  return {
    step: routine[0],
    index: 0,
    progress: 0,
    from: [0, 0.045, 0.7] as Point,
  };
}
