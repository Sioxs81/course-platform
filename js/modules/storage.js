// js/modules/storage.js — Módulo ESM de persistencia

const PREFIX = "devpath_";

export const storage = {
  get(key) {
    try {
      const v = localStorage.getItem(PREFIX + key);
      return v ? JSON.parse(v) : null;
    } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch {}
  },
  remove(key) {
    try { localStorage.removeItem(PREFIX + key); } catch {}
  }
};

// ── Progress helpers ─────────────────────────────────────────────────────────

export function getCompleted() {
  return new Set(storage.get("completed") ?? []);
}

export function setCompleted(set) {
  storage.set("completed", [...set]);
}

export function toggleCompleted(topicId) {
  const set = getCompleted();
  const wasNew = !set.has(topicId);
  if (set.has(topicId)) set.delete(topicId);
  else set.add(topicId);
  setCompleted(set);
  return { completed: set.has(topicId), isFirstTime: wasNew && set.has(topicId) };
}

// ── Notes helpers ────────────────────────────────────────────────────────────

export function getNote(topicId) {
  return storage.get(`note_${topicId}`) ?? "";
}

export function saveNote(topicId, text) {
  storage.set(`note_${topicId}`, text);
}

// ── Accent color ─────────────────────────────────────────────────────────────

export function getAccentColor() {
  return storage.get("accent") ?? "#6366f1";
}

export function saveAccentColor(color) {
  storage.set("accent", color);
}
