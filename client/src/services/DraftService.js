const STORAGE_PREFIX = "examapp";

function buildKey(scope) {
  return `${STORAGE_PREFIX}:${scope}`;
}

export function saveDraft(scope, payload) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(buildKey(scope), JSON.stringify(payload));
  } catch (error) {
    console.warn("Could not save draft:", error);
  }
}

export function getDraft(scope) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(buildKey(scope));
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Could not read draft:", error);
    return null;
  }
}

export function clearDraft(scope) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(buildKey(scope));
}
