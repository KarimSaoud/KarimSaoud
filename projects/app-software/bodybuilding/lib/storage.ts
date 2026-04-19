import { Routine, RoutineSettings } from "@/types";

const ROUTINES_KEY = "posing-caller:routines";
const CURRENT_KEY = "posing-caller:current-routine";
const SETTINGS_KEY = "posing-caller:settings";

const isBrowser = typeof window !== "undefined";

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const defaultSettings: RoutineSettings = {
  voiceEnabled: true,
  beepEnabled: true,
  vibrationEnabled: true,
  watchMode: false,
};

export const loadSavedRoutines = (): Routine[] => {
  if (!isBrowser) return [];
  return safeParse<Routine[]>(window.localStorage.getItem(ROUTINES_KEY), []);
};

export const saveSavedRoutines = (routines: Routine[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
};

export const loadCurrentRoutine = (): Routine | null => {
  if (!isBrowser) return null;
  return safeParse<Routine | null>(window.localStorage.getItem(CURRENT_KEY), null);
};

export const saveCurrentRoutine = (routine: Routine) => {
  if (!isBrowser) return;
  window.localStorage.setItem(CURRENT_KEY, JSON.stringify(routine));
};

export const loadSettings = (): RoutineSettings => {
  if (!isBrowser) return defaultSettings;
  return {
    ...defaultSettings,
    ...safeParse<Partial<RoutineSettings>>(window.localStorage.getItem(SETTINGS_KEY), {}),
  };
};

export const saveSettings = (settings: RoutineSettings) => {
  if (!isBrowser) return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
