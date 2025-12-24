// lib/progress.ts

export type JourneyProgress = {
  journeySlug: string;
  currentStepId: string;
  updatedAt: string;
  answersByStepId: Record<string, string>;
  completedStepIds: string[];
};

const KEY_PREFIX = "pathswithin.progress.";

function key(slug: string) {
  return `${KEY_PREFIX}${slug}`;
}

export function initProgress(
  journeySlug: string,
  firstStepId: string
): JourneyProgress {
  return {
    journeySlug,
    currentStepId: firstStepId,
    updatedAt: new Date().toISOString(),
    answersByStepId: {},
    completedStepIds: [],
  };
}

function normalizeProgress(
  raw: any,
  journeySlug: string,
  fallbackStepId: string
): JourneyProgress {
  return {
    journeySlug,
    currentStepId: raw?.currentStepId ?? fallbackStepId,
    updatedAt: raw?.updatedAt ?? new Date().toISOString(),
    answersByStepId: raw?.answersByStepId ?? {},
    completedStepIds: Array.isArray(raw?.completedStepIds)
      ? raw.completedStepIds
      : [],
  };
}


export function canUseStorage(): boolean {
  try {
    const k = "__pw_test__";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export type SaveProgressResult =
  | { ok: true }
  | { ok: false; reason: "storage_blocked" };

export type LoadProgressResult =
  | { ok: true; value: JourneyProgress | null }
  | { ok: false; reason: "storage_blocked" | "parse_error"; value: null };

export function loadProgressSafe(journeySlug: string): LoadProgressResult {
  try {
    const raw = localStorage.getItem(key(journeySlug));
    if (!raw) return { ok: true, value: null };

    try {
      const parsed = JSON.parse(raw);
      return {
        ok: true,
        value: normalizeProgress(
          parsed,
          journeySlug,
          parsed?.currentStepId ?? "1"
        ),
      };
    } catch {
      
      return { ok: false, reason: "parse_error", value: null };
    }
  } catch {
    
    return { ok: false, reason: "storage_blocked", value: null };
  }
}

export function loadProgress(journeySlug: string): JourneyProgress | null {
  const res = loadProgressSafe(journeySlug);
  return res.ok ? res.value : null;
}

export function saveProgress(progress: JourneyProgress): SaveProgressResult {
  try {
    localStorage.setItem(key(progress.journeySlug), JSON.stringify(progress));
    return { ok: true };
  } catch {
    return { ok: false, reason: "storage_blocked" };
  }
}

export function clearProgress(journeySlug: string): SaveProgressResult {
  try {
    localStorage.removeItem(key(journeySlug));
    return { ok: true };
  } catch {
    return { ok: false, reason: "storage_blocked" };
  }
}

export function setCurrentStep(
  progress: JourneyProgress,
  stepId: string
): JourneyProgress {
  return {
    ...progress,
    currentStepId: stepId,
    updatedAt: new Date().toISOString(),
  };
}

export function markStepCompleted(
  progress: JourneyProgress,
  stepId: string
): JourneyProgress {
  const set = new Set(progress.completedStepIds ?? []);
  set.add(stepId);

  return {
    ...progress,
    completedStepIds: Array.from(set),
    updatedAt: new Date().toISOString(),
  };
}

export function updateAnswer(
  progress: JourneyProgress,
  stepId: string,
  answer: string
): JourneyProgress {
  return {
    ...progress,
    updatedAt: new Date().toISOString(),
    answersByStepId: {
      ...(progress.answersByStepId ?? {}),
      [stepId]: answer,
    },
  };
}

export function ensureProgress(
  journeySlug: string,
  firstStepId: string
): { progress: JourneyProgress; saved: SaveProgressResult } {
  const existing = loadProgress(journeySlug);
  if (existing) return { progress: existing, saved: { ok: true } };

  const fresh = initProgress(journeySlug, firstStepId);
  const saved = saveProgress(fresh);
  return { progress: fresh, saved };
}
