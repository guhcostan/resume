import { strict as assert } from "node:assert";
import { test } from "node:test";
import { routine, sampleRoutine, smooth } from "./routine.ts";
test("each action can be reached, with continuous position across every boundary", () => {
  let elapsed = 0;
  for (let i = 0; i < routine.length; i++) {
    const step = routine[i];
    const start = sampleRoutine(elapsed + 0.000001);
    assert.equal(start.step.activity, step.activity);
    if (i) assert.deepEqual(start.from, routine[i - 1].to);
    assert.equal(
      sampleRoutine(elapsed + step.duration / 2).step.activity,
      step.activity,
    );
    elapsed += step.duration;
  }
  const loop = sampleRoutine(elapsed + 0.000001);
  assert.equal(loop.index, 0);
  assert.deepEqual(loop.from, routine.at(-1)!.to);
});
test("interpolation eases to a complete stop; all destinations are within the room", () => {
  assert.equal(smooth(-1), 0);
  assert.equal(smooth(2), 1);
  for (const { to, duration } of routine) {
    assert.ok(duration > 0);
    assert.ok(Math.abs(to[0]) < 2.8 && Math.abs(to[2]) < 2.6);
  }
});
