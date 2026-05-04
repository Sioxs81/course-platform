// js/modules/eventBus.js — Módulo ESM: Bus de eventos (singleton natural)

const listeners = new Map();

const getSet = (ev) => {
  if (!listeners.has(ev)) listeners.set(ev, new Set());
  return listeners.get(ev);
};

/** Suscribir función a un evento. Devuelve función para desuscribirse. */
export const on = (ev, fn) => {
  const set = getSet(ev);
  set.add(fn);
  return () => set.delete(fn);
};

/** Emitir evento con payload opcional */
export const emit = (ev, payload) => {
  const set = listeners.get(ev);
  if (!set) return;
  for (const fn of set) fn(payload);
};

// Eventos disponibles en la app:
// "topic:select"    → { topic }
// "topic:complete"  → { topicId, isFirstTime }
// "search:query"    → { query }
// "sidebar:toggle"  → {}
// "focus:toggle"    → {}
// "accent:change"   → { color }
