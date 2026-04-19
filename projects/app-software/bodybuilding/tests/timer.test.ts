import assert from "node:assert/strict";
import test from "node:test";

import { calculateRemainingTotalMs, getPlayerState, type TimerSnapshot } from "../lib/timer";
import type { Pose } from "../types";

const poses: Pose[] = [
  { id: "front", name: "Front pose", duration: 10 },
  { id: "side", name: "Side pose", duration: 20 }
];

test("calculateRemainingTotalMs includes current remainder and upcoming poses", () => {
  assert.equal(calculateRemainingTotalMs(poses, 0, 5000), 25000);
  assert.equal(calculateRemainingTotalMs(poses, 1, 12000), 12000);
});

test("getPlayerState reports finished when current index is past the routine", () => {
  const snapshot: TimerSnapshot = {
    status: "finished",
    currentIndex: poses.length,
    currentStartedAtMs: null,
    elapsedInCurrentMs: 0
  };

  const player = getPlayerState(poses, snapshot);
  assert.equal(player.status, "finished");
  assert.equal(player.progress, 1);
  assert.equal(player.currentPose, null);
});

test("getPlayerState calculates paused progress without live clock drift", () => {
  const snapshot: TimerSnapshot = {
    status: "paused",
    currentIndex: 0,
    currentStartedAtMs: null,
    elapsedInCurrentMs: 4000
  };

  const player = getPlayerState(poses, snapshot);
  assert.equal(player.poseRemainingMs, 6000);
  assert.equal(player.totalRemainingMs, 26000);
  assert.equal(Math.round(player.progress * 100), 13);
});
