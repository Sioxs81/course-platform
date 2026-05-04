// js/main.js — Entry point principal (módulo ESM)

import "@components/TopicCube.js";
import "@components/TopicViewer.js";
import "@components/PomodoroTimer.js";

import { COURSE } from "@data";
import { on, emit } from "@modules/eventBus.js";
import { getCompleted, toggleCompleted, getAccentColor, saveAccentColor } from "@modules/storage.js";

// ── Estado global ─────────────────────────────────────────────────────────────

let currentTopicId = null;
let searchQuery = "";
let focusMode = false;

// Mapa rápido topicId → topic
const topicMap = new Map(
  COURSE.phases.flatMap(p => p.topics.map(t => [t.id, t]))
);

// ── Inicialización ────────────────────────────────────────────────────────────

function init() {
  applyAccentColor(getAccentColor());
  buildCourseTree();
  bindSidebarControls();
  bindSearch();
  bindFocusMode();
  bindTopicSelect();
  bindTopicComplete();
}

// ── Accent color ──────────────────────────────────────────────────────────────

function applyAccentColor(color) {
  document.documentElement.style.setProperty("--accent-color", color);
}

// ── Construir árbol de temas ──────────────────────────────────────────────────

function buildCourseTree(filter = "") {
  const container = document.getElementById("course-tree");
  container.innerHTML = "";

  const completed = getCompleted();

  COURSE.phases.forEach(phase => {
    const topics = filter
      ? phase.topics.filter(t => t.label.toLowerCase().includes(filter.toLowerCase()))
      : phase.topics;

    if (topics.length === 0) return;

    const doneCount = topics.filter(t => completed.has(t.id)).length;
    const pct = Math.round((doneCount / topics.length) * 100);

    const section = document.createElement("div");
    section.className = "phase-section";
    section.innerHTML = `
      <div class="phase-label">
        <span>${phase.label}</span>
        <span style="color: #6366f1; font-variant-numeric: tabular-nums">${doneCount}/${topics.length}</span>
      </div>
      <div class="phase-progress">
        <div class="phase-progress-fill" style="width: ${pct}%"></div>
      </div>
      <div class="phase-grid" id="grid-${phase.id}"></div>
    `;

    container.appendChild(section);

    const grid = section.querySelector(`#grid-${phase.id}`);
    topics.forEach((topic, i) => {
      const cube = document.createElement("topic-cube");
      cube.setAttribute("topic-id", topic.id);
      cube.setAttribute("label", topic.label);
      cube.setAttribute("icon", topic.icon);
      cube.setAttribute("color", topic.color);
      if (topic.id === currentTopicId) cube.setAttribute("active", "");

      // Stagger animation
      cube.style.animationDelay = `${i * 40}ms`;
      cube.style.opacity = "0";
      cube.style.animation = `fadeInCube 0.3s ease forwards ${i * 40}ms`;

      grid.appendChild(cube);
    });
  });

  injectStaggerStyle();
}

function injectStaggerStyle() {
  if (document.getElementById("stagger-style")) return;
  const style = document.createElement("style");
  style.id = "stagger-style";
  style.textContent = `
    @keyframes fadeInCube {
      from { opacity: 0; transform: scale(0.7); }
      to   { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}

// ── Sidebar toggle ────────────────────────────────────────────────────────────

function bindSidebarControls() {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("sidebar-toggle");

  toggleBtn?.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    const isCollapsed = sidebar.classList.contains("collapsed");
    toggleBtn.querySelector("svg").style.transform = isCollapsed ? "rotate(180deg)" : "";
    toggleBtn.setAttribute("title", isCollapsed ? "Expandir sidebar" : "Colapsar sidebar");
  });
}

// ── Buscador ──────────────────────────────────────────────────────────────────

function bindSearch() {
  const searchToggle = document.getElementById("search-toggle");
  const searchBar = document.getElementById("search-bar");
  const searchInput = document.getElementById("search-input");

  searchToggle?.addEventListener("click", () => {
    searchBar.classList.toggle("hidden");
    if (!searchBar.classList.contains("hidden")) searchInput.focus();
    else {
      searchInput.value = "";
      buildCourseTree();
    }
  });

  searchInput?.addEventListener("input", () => {
    buildCourseTree(searchInput.value);
  });
}

// ── Focus mode ────────────────────────────────────────────────────────────────

function bindFocusMode() {
  on("focus:toggle", () => {
    focusMode = !focusMode;
    document.getElementById("app").classList.toggle("focus-mode", focusMode);
  });
}

// ── Selección de tema ─────────────────────────────────────────────────────────

function bindTopicSelect() {
  on("topic:select", ({ topicId }) => {
    const topic = topicMap.get(topicId);
    if (!topic) return;

    currentTopicId = topicId;

    // Actualizar cubos activos
    document.querySelectorAll("topic-cube").forEach(cube => {
      if (cube.getAttribute("topic-id") === topicId) cube.setAttribute("active", "");
      else cube.removeAttribute("active");
    });

    // Mostrar/ocultar welcome screen
    const welcome = document.getElementById("welcome-screen");
    const viewer = document.getElementById("topic-viewer");
    welcome.style.display = "none";
    viewer.classList.remove("hidden");
    viewer.setTopic(topic);
  });
}

// ── Completar tema ────────────────────────────────────────────────────────────

function bindTopicComplete() {
  on("topic:complete", ({ topicId, isFirstTime }) => {
    // Trigger unlock animation on the cube
    const cube = document.querySelector(`topic-cube[topic-id="${topicId}"]`);
    if (cube && isFirstTime) cube.triggerUnlock?.();

    // Rebuild tree para actualizar la barra de progreso
    buildCourseTree(searchQuery);

    // Re-mark active
    document.querySelectorAll("topic-cube").forEach(c => {
      if (c.getAttribute("topic-id") === currentTopicId) c.setAttribute("active", "");
    });
  });
}

// ── Start ─────────────────────────────────────────────────────────────────────

init();
