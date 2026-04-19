"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PlayMode } from "@/components/PlayMode";
import { RoutineBuilder } from "@/components/RoutineBuilder";
import { SavedRoutines } from "@/components/SavedRoutines";
import { SettingsPanel } from "@/components/SettingsPanel";
import { WatchModeToggle } from "@/components/WatchModeToggle";
import { presetRoutines } from "@/lib/presets";
import {
  defaultSettings,
  loadCurrentRoutine,
  loadSavedRoutines,
  loadSettings,
  saveCurrentRoutine,
  saveSavedRoutines,
  saveSettings,
} from "@/lib/storage";
import { getPlayerState, TimerSnapshot } from "@/lib/timer";
import { clampDuration, createId, getRoutineDuration } from "@/lib/utils";
import { Pose, Routine, RoutineSettings } from "@/types";

const createEmptyRoutine = (): Routine => {
  const now = new Date().toISOString();
  return {
    id: createId(),
    name: "Stage rehearsal",
    poses: [],
    createdAt: now,
    updatedAt: now,
  };
};

const initialSnapshot: TimerSnapshot = {
  status: "idle",
  currentIndex: 0,
  currentStartedAtMs: null,
  elapsedInCurrentMs: 0,
};

export function PosingCallerApp() {
  const [hydrated, setHydrated] = useState(false);
  const [routine, setRoutine] = useState<Routine>(createEmptyRoutine);
  const [savedRoutines, setSavedRoutines] = useState<Routine[]>([]);
  const [settings, setSettingsState] = useState<RoutineSettings>(defaultSettings);
  const [snapshot, setSnapshot] = useState<TimerSnapshot>(initialSnapshot);
  const [clockTick, setClockTick] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const announcedPoseIdRef = useRef<string | null>(null);
  const beepedPoseIdRef = useRef<string | null>(null);
  const lastVibrationPoseIdRef = useRef<string | null>(null);

  const createAudioContext = () => {
    if (typeof window === "undefined") return null;

    const AudioContextClass = window.AudioContext;
    if (AudioContextClass) {
      return new AudioContextClass();
    }

    const maybeWindow = window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    };

    return maybeWindow.webkitAudioContext ? new maybeWindow.webkitAudioContext() : null;
  };

  useEffect(() => {
    const storedRoutine = loadCurrentRoutine();
    const storedSaved = loadSavedRoutines();
    const storedSettings = loadSettings();

    if (storedRoutine) {
      setRoutine(storedRoutine);
    }
    setSavedRoutines(storedSaved);
    setSettingsState(storedSettings);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCurrentRoutine(routine);
  }, [hydrated, routine]);

  useEffect(() => {
    if (!hydrated) return;
    saveSavedRoutines(savedRoutines);
  }, [hydrated, savedRoutines]);

  useEffect(() => {
    if (!hydrated) return;
    saveSettings(settings);
  }, [hydrated, settings]);

  useEffect(() => {
    if (snapshot.status !== "running") return;

    const interval = window.setInterval(() => {
      setClockTick(Date.now());
      setSnapshot((current) => {
        if (current.status !== "running" || !current.currentStartedAtMs) return current;

        let next = current;
        let now = Date.now();
        let currentPose = routine.poses[next.currentIndex];

        while (currentPose) {
          const poseDurationMs = currentPose.duration * 1000;
          const elapsed = next.elapsedInCurrentMs + (now - (next.currentStartedAtMs ?? now));

          if (elapsed < poseDurationMs) {
            return next;
          }

          const overflow = elapsed - poseDurationMs;
          const nextIndex = next.currentIndex + 1;
          const upcomingPose = routine.poses[nextIndex];

          if (!upcomingPose) {
            return {
              status: "finished",
              currentIndex: routine.poses.length,
              currentStartedAtMs: null,
              elapsedInCurrentMs: 0,
            };
          }

          next = {
            status: "running",
            currentIndex: nextIndex,
            currentStartedAtMs: now - overflow,
            elapsedInCurrentMs: 0,
          };
          currentPose = upcomingPose;
          now = Date.now();
        }

        return next;
      });
    }, 200);

    return () => window.clearInterval(interval);
  }, [routine.poses, snapshot.status]);

  const player = useMemo(() => {
    void clockTick;
    return getPlayerState(routine.poses, snapshot);
  }, [routine.poses, snapshot, clockTick]);
  const totalSeconds = useMemo(() => getRoutineDuration(routine.poses), [routine.poses]);

  useEffect(() => {
    if (!hydrated || !player.currentPose) return;

    if (player.currentPose.id !== announcedPoseIdRef.current) {
      announcedPoseIdRef.current = player.currentPose.id;
      beepedPoseIdRef.current = null;

      if (settings.voiceEnabled && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(player.currentPose.name.trim() || "Next pose");
        utterance.rate = 0.92;
        utterance.pitch = 0.82;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
      }

      if (settings.vibrationEnabled && "vibrate" in navigator) {
        if (lastVibrationPoseIdRef.current !== player.currentPose.id) {
          navigator.vibrate([120, 40, 120]);
          lastVibrationPoseIdRef.current = player.currentPose.id;
        }
      }
    }
  }, [hydrated, player.currentPose, settings.vibrationEnabled, settings.voiceEnabled]);

  useEffect(() => {
    if (
      snapshot.status !== "running" ||
      !player.currentPose ||
      !settings.beepEnabled ||
      beepedPoseIdRef.current === player.currentPose.id
    ) {
      return;
    }

    if (player.poseRemainingMs > 1000 || !player.nextPose) return;

    beepedPoseIdRef.current = player.currentPose.id;

    const audioContext =
      audioContextRef.current || createAudioContext();
    if (!audioContext) return;
    audioContextRef.current = audioContext;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.02;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.08);
  }, [player.currentPose, player.nextPose, player.poseRemainingMs, settings.beepEnabled, snapshot.status]);

  useEffect(() => {
    if (routine.poses.length === 0) {
      setSnapshot(initialSnapshot);
      return;
    }

    if (snapshot.status !== "finished" && snapshot.currentIndex >= routine.poses.length) {
      setSnapshot(initialSnapshot);
      return;
    }
  }, [routine.poses.length, snapshot.currentIndex, snapshot.status]);

  const updateRoutine = (updater: (current: Routine) => Routine) => {
    setRoutine((current) => {
      const next = updater(current);
      return {
        ...next,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const resetPlayer = () => {
    window.speechSynthesis?.cancel?.();
    announcedPoseIdRef.current = null;
    beepedPoseIdRef.current = null;
    lastVibrationPoseIdRef.current = null;
    setSnapshot(initialSnapshot);
  };

  const startPlayer = () => {
    if (routine.poses.length === 0) return;
    announcedPoseIdRef.current = null;
    beepedPoseIdRef.current = null;
    setSnapshot({
      status: "running",
      currentIndex: 0,
      currentStartedAtMs: Date.now(),
      elapsedInCurrentMs: 0,
    });
  };

  const pausePlayer = () => {
    setSnapshot((current) => {
      if (current.status !== "running" || !current.currentStartedAtMs) return current;
      return {
        ...current,
        status: "paused",
        elapsedInCurrentMs: current.elapsedInCurrentMs + (Date.now() - current.currentStartedAtMs),
        currentStartedAtMs: null,
      };
    });
    window.speechSynthesis?.cancel?.();
  };

  const resumePlayer = () => {
    setSnapshot((current) => {
      if (current.status !== "paused") return current;
      return {
        ...current,
        status: "running",
        currentStartedAtMs: Date.now(),
      };
    });
  };

  const jumpToPose = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= routine.poses.length) return;
    announcedPoseIdRef.current = null;
    beepedPoseIdRef.current = null;
    setSnapshot((current) => ({
      status:
        current.status === "paused"
          ? "paused"
          : current.status === "idle"
            ? "idle"
            : "running",
      currentIndex: targetIndex,
      currentStartedAtMs:
        current.status === "running"
          ? Date.now()
          : null,
      elapsedInCurrentMs: 0,
    }));
  };

  const addPose = () => {
    updateRoutine((current) => ({
      ...current,
      poses: [
        ...current.poses,
        {
          id: createId(),
          name: `Pose ${current.poses.length + 1}`,
          duration: 10,
        },
      ],
    }));
  };

  const changePose = (updatedPose: Pose) => {
    updateRoutine((current) => ({
      ...current,
      poses: current.poses.map((pose) =>
        pose.id === updatedPose.id
          ? {
              ...updatedPose,
              name: updatedPose.name.trimStart(),
              duration: clampDuration(updatedPose.duration),
            }
          : pose,
      ),
    }));
  };

  const deletePose = (id: string) => {
    updateRoutine((current) => ({
      ...current,
      poses: current.poses.filter((pose) => pose.id !== id),
    }));
  };

  const movePose = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= routine.poses.length) return;

    updateRoutine((current) => {
      const poses = [...current.poses];
      const [moved] = poses.splice(index, 1);
      poses.splice(targetIndex, 0, moved);
      return {
        ...current,
        poses,
      };
    });
  };

  const applyPreset = (presetId: string) => {
    const preset = presetRoutines.find((item) => item.id === presetId);
    if (!preset) return;

    resetPlayer();
    setRoutine({
      ...preset,
      id: createId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      poses: preset.poses.map((pose) => ({ ...pose, id: createId() })),
    });
  };

  const loadRoutine = (routineId: string) => {
    const match = savedRoutines.find((item) => item.id === routineId);
    if (!match) return;
    resetPlayer();
    setRoutine({
      ...match,
      poses: match.poses.map((pose) => ({ ...pose })),
    });
  };

  const saveCurrent = () => {
    const routineName = routine.name.trim() || "Untitled routine";
    const snapshotRoutine: Routine = {
      ...routine,
      name: routineName,
      updatedAt: new Date().toISOString(),
    };

    setRoutine(snapshotRoutine);
    setSavedRoutines((current) => [snapshotRoutine, ...current.filter((item) => item.id !== snapshotRoutine.id)]);
  };

  const overwriteRoutine = (routineId: string) => {
    setSavedRoutines((current) =>
      current.map((item) =>
        item.id === routineId
          ? {
              ...routine,
              id: routineId,
              name: routine.name.trim() || item.name,
              createdAt: item.createdAt,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  };

  const deleteRoutine = (routineId: string) => {
    setSavedRoutines((current) => current.filter((item) => item.id !== routineId));
  };

  const setRoutineName = (name: string) => {
    updateRoutine((current) => ({
      ...current,
      name,
    }));
  };

  const setSettings = (nextSettings: RoutineSettings) => {
    setSettingsState(nextSettings);
  };

  const toggleWatchMode = () => {
    setSettingsState((current) => ({
      ...current,
      watchMode: !current.watchMode,
    }));
  };

  return (
    <main className="min-h-screen bg-stage-radial px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <div className="flex items-center justify-end">
          <WatchModeToggle enabled={settings.watchMode} onToggle={toggleWatchMode} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <RoutineBuilder
              routineName={routine.name}
              poses={routine.poses}
              totalSeconds={totalSeconds}
              onRoutineNameChange={setRoutineName}
              onAddPose={addPose}
              onChangePose={changePose}
              onDeletePose={deletePose}
              onMovePose={movePose}
              onApplyPreset={applyPreset}
              presets={presetRoutines.map((preset) => ({ id: preset.id, name: preset.name }))}
            />
            <SavedRoutines
              routines={savedRoutines}
              currentRoutineId={routine.id}
              onLoad={loadRoutine}
              onSave={saveCurrent}
              onOverwrite={overwriteRoutine}
              onDelete={deleteRoutine}
            />
          </div>

          <div className="space-y-5">
            <PlayMode
              routineName={routine.name || "Untitled routine"}
              player={player}
              poseCount={routine.poses.length}
              watchMode={settings.watchMode}
              onStart={startPlayer}
              onPause={pausePlayer}
              onResume={resumePlayer}
              onReset={resetPlayer}
              onNext={() => jumpToPose(Math.min(routine.poses.length - 1, player.currentIndex + 1))}
              onPrevious={() => jumpToPose(Math.max(0, player.currentIndex - 1))}
            />
            <SettingsPanel settings={settings} onChange={setSettings} />
          </div>
        </div>
      </div>
    </main>
  );
}
