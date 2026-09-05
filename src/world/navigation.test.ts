import { strict as assert } from "node:assert";
import { test } from "node:test";
import { planRoute, sampleRoute } from "./navigation.ts";
import { chair } from "./routine.ts";
test("projects walks to the desk and keeps coding while the reader is open", () => {
  const route = planRoute([0, 0.045, 0.7], "walk", "projects");
  assert.deepEqual(
    route.steps.map((s) => s.activity),
    ["walk", "walk", "sit", "code"],
  );
  const sample = sampleRoute(route, 120);
  assert.equal(sample.step.activity, "code");
  assert.deepEqual(sample.step.to, chair);
  assert.deepEqual(sample.from, chair);
});
test("switching from seated work stands up before going for coffee", () => {
  const route = planRoute(chair, "code", "about");
  assert.equal(route.steps[0].activity, "stand");
  assert.equal(sampleRoute(route, 120).step.activity, "coffee");
});
test("leaving coffee returns the cup, and an interrupted walk starts at its actual position", () => {
  assert.equal(
    planRoute([-1.07, 0.045, 1.6], "coffee", "projects").steps[0].activity,
    "return-cup",
  );
  const here: [number, number, number] = [-0.35, 0.045, 0.2];
  const route = planRoute(here, "walk", "experience");
  assert.deepEqual(sampleRoute(route, 0).from, here);
  assert.equal(sampleRoute(route, 120).step.activity, "read");
});
test("closing a reader exits the station and returns to the ambient routine", () => {
  const route = planRoute(chair, "code", null);
  assert.equal(route.steps[0].activity, "stand");
  const duration = route.steps.reduce((sum, s) => sum + s.duration, 0);
  assert.equal(sampleRoute(route, duration + 0.1).step.activity, "walk");
  assert.deepEqual(sampleRoute(route, duration + 0.1).from, [0, 0.045, 0.7]);
});

test("every personal station is reachable, holds its action and exits continuously", () => {
  const targets = {
    rest: "sleep",
    dogs: "pet",
    fitness: "exercise",
    run: "jog",
    surf: "balance",
    food: "eat",
  } as const;
  for (const [destination, activity] of Object.entries(targets)) {
    const route = planRoute(chair, "code", destination as keyof typeof targets);
    assert.equal(route.steps[0].activity, "stand");
    const arrived = sampleRoute(route, 200);
    assert.equal(arrived.step.activity, activity);
    assert.deepEqual(arrived.from, arrived.step.to);
    const next = planRoute(arrived.step.to, arrived.step.activity, "projects");
    assert.deepEqual(sampleRoute(next, 0).from, arrived.step.to);
    if (destination === "rest") assert.equal(next.steps[0].activity, "wake");
    for (const step of route.steps) {
      assert.ok(step.duration > 0);
      assert.ok(Math.abs(step.to[0]) < 2.8 && Math.abs(step.to[2]) < 2.6);
    }
  }
});
