// js/components/TopicViewer.js — WebComponent: panel de contenido del tema

import { on, emit } from "@modules/eventBus.js";
import { getNote, saveNote, toggleCompleted, getCompleted } from "@modules/storage.js";

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function ytEmbedUrl(youtubeId, startTime = 0) {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?start=${startTime}&rel=0&modestbranding=1`;
}

const STYLE = `
  :host { display: block; }
  :host(.hidden) { display: none; }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .viewer {
    min-height: 100vh;
    padding: 28px 32px;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    color: #e2e2f0;
  }

  /* Header */
  .topic-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
  }
  .topic-title-group { flex: 1; }
  .topic-title {
    font-size: 22px;
    font-weight: 700;
    color: #e2e2f0;
    line-height: 1.2;
    margin-bottom: 6px;
  }
  .topic-meta {
    display: flex;
    gap: 12px;
    align-items: center;
    font-size: 13px;
    color: #8b8baa;
    flex-wrap: wrap;
  }
  .topic-meta .duration {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .topic-meta svg { width: 13px; height: 13px; }

  .header-actions { display: flex; gap: 8px; flex-shrink: 0; }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid #2a2a3e;
    background: #1e1e2e;
    color: #8b8baa;
    transition: all 0.15s;
    font-family: inherit;
  }
  .btn:hover { border-color: #6366f1; color: #e2e2f0; background: #22223a; }
  .btn svg { width: 13px; height: 13px; }
  .btn.primary { background: #6366f1; border-color: #6366f1; color: white; }
  .btn.primary:hover { background: #4f46e5; }
  .btn.complete-btn.done { background: rgba(34,197,94,0.15); border-color: #22c55e; color: #22c55e; }
  .btn.focus-btn.active { background: rgba(236,72,153,0.15); border-color: #ec4899; color: #ec4899; }

  /* Tabs */
  .tabs { display: flex; gap: 0; border-bottom: 1px solid #2a2a3e; margin-bottom: 24px; }
  .tab {
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 500;
    color: #8b8baa;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: color 0.15s, border-color 0.15s;
    margin-bottom: -1px;
    user-select: none;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    font-family: inherit;
  }
  .tab:hover { color: #e2e2f0; }
  .tab.active { color: #6366f1; border-bottom-color: #6366f1; }
  .tab-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: #2a2a3e;
    border-radius: 10px;
    font-size: 10px;
    margin-left: 6px;
    color: #8b8baa;
  }
  .tab.active .tab-badge { background: rgba(99,102,241,0.2); color: #6366f1; }

  .panel { display: none; }
  .panel.active { display: block; }

  /* Video */
  .video-wrap {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    background: #0a0a0f;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #2a2a3e;
  }
  .video-wrap iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }

  /* Highlights */
  .section-title {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #4a4a6a;
    margin: 24px 0 10px;
  }
  .highlights-list { display: flex; flex-direction: column; gap: 6px; }
  .highlight-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: #1e1e2e;
    border: 1px solid #2a2a3e;
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    text-decoration: none;
    color: inherit;
  }
  .highlight-item:hover { border-color: #6366f1; background: #22223a; }
  .highlight-time {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 12px;
    color: #6366f1;
    min-width: 48px;
    font-weight: 600;
  }
  .highlight-label { font-size: 13px; color: #c4c4e0; flex: 1; }
  .highlight-arrow { color: #4a4a6a; font-size: 12px; }

  /* Chapters */
  .chapters-list { display: flex; flex-direction: column; gap: 10px; }
  .chapter-card {
    border: 1px solid #2a2a3e;
    border-radius: 8px;
    overflow: hidden;
    background: #1a1a26;
  }
  .chapter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .chapter-header:hover { background: #1e1e2e; }
  .chapter-title { font-size: 14px; font-weight: 500; color: #e2e2f0; }
  .chapter-toggle { color: #4a4a6a; font-size: 18px; transition: transform 0.2s; }
  .chapter-card.open .chapter-toggle { transform: rotate(180deg); }
  .chapter-video { display: none; }
  .chapter-card.open .chapter-video { display: block; padding: 0 16px 16px; }
  .chapter-highlights {
    padding: 0 16px 12px;
    display: none;
    flex-direction: column;
    gap: 5px;
  }
  .chapter-card.open .chapter-highlights { display: flex; }
  .chapter-hl {
    font-size: 12px;
    color: #8b8baa;
    padding: 5px 10px;
    background: #1e1e2e;
    border-radius: 4px;
    border-left: 2px solid #ec4899;
    display: flex;
    gap: 10px;
  }
  .chapter-hl-time { font-family: monospace; color: #ec4899; min-width: 40px; }

  /* Notes */
  .notes-area {
    width: 100%;
    min-height: 140px;
    background: #1a1a26;
    border: 1px solid #2a2a3e;
    border-radius: 8px;
    padding: 14px;
    color: #e2e2f0;
    font-size: 13px;
    font-family: inherit;
    resize: vertical;
    line-height: 1.6;
    outline: none;
    transition: border-color 0.15s;
    margin-top: 8px;
  }
  .notes-area:focus { border-color: #6366f1; }
  .notes-area::placeholder { color: #4a4a6a; }
  .notes-save {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .saved-indicator {
    font-size: 12px;
    color: #22c55e;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .saved-indicator.show { opacity: 1; }

  /* No chapters message */
  .no-chapters {
    text-align: center;
    padding: 40px 20px;
    color: #4a4a6a;
    font-size: 13px;
  }
  .no-chapters svg { width: 32px; height: 32px; margin-bottom: 12px; display: block; margin-inline: auto; }
`;

export class TopicViewer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._topic = null;
    this._activeTab = "video";
    this._focusMode = false;
  }

  connectedCallback() {
    on("topic:select", ({ topicId }) => this._handleTopicChange(topicId));
    on("focus:toggle", () => this._toggleFocus());
    on("topic:complete", ({ topicId }) => {
      if (this._topic?.id === topicId) this.render();
    });
    on("accent:change", () => this.render());
  }

  setTopic(topic) {
    this._topic = topic;
    this._activeTab = "video";
    this.render();
  }

  _handleTopicChange(topicId) {
    // App will call setTopic from main
  }

  _toggleFocus() {
    this._focusMode = !this._focusMode;
    this.render();
  }

  render() {
    if (!this._topic) return;
    const t = this._topic;
    const completed = getCompleted().has(t.id);
    const hasChapters = t.chapters && t.chapters.length > 0;
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-color").trim() || "#6366f1";

    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <div class="viewer">
        <div class="topic-header">
          <div class="topic-title-group">
            <h1 class="topic-title">${t.video.title}</h1>
            <div class="topic-meta">
              <span class="duration">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${t.video.duration}
              </span>
              <span>${t.highlights.length} highlights</span>
              ${hasChapters ? `<span>${t.chapters.length} capítulos</span>` : ""}
            </div>
          </div>
          <div class="header-actions">
            <button class="btn focus-btn ${this._focusMode ? "active" : ""}" id="focus-btn" title="Modo enfoque">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
              Foco
            </button>
            <button class="btn complete-btn ${completed ? "done" : ""}" id="complete-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              ${completed ? "Completado" : "Completar"}
            </button>
          </div>
        </div>

        <div class="tabs">
          <button class="tab ${this._activeTab === "video" ? "active" : ""}" data-tab="video">Video principal</button>
          ${hasChapters
            ? `<button class="tab ${this._activeTab === "chapters" ? "active" : ""}" data-tab="chapters">Capítulos<span class="tab-badge">${t.chapters.length}</span></button>`
            : ""}
          <button class="tab ${this._activeTab === "highlights" ? "active" : ""}" data-tab="highlights">
            Highlights<span class="tab-badge">${t.highlights.length}</span>
          </button>
          <button class="tab ${this._activeTab === "notes" ? "active" : ""}" data-tab="notes">Mis notas</button>
        </div>

        <!-- PANEL: Video principal -->
        <div class="panel ${this._activeTab === "video" ? "active" : ""}">
          <div class="video-wrap">
            <iframe
              src="${ytEmbedUrl(t.video.youtubeId)}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy"
              title="${t.video.title}"
            ></iframe>
          </div>
          ${t.highlights.length ? `
            <p class="section-title">Momentos clave</p>
            <div class="highlights-list">
              ${t.highlights.map((h, i) => `
                <a class="highlight-item" href="#" data-yt="${t.video.youtubeId}" data-time="${h.time}" data-idx="${i}">
                  <span class="highlight-time">${formatTime(h.time)}</span>
                  <span class="highlight-label">${h.label}</span>
                  <span class="highlight-arrow">▶</span>
                </a>
              `).join("")}
            </div>
          ` : ""}
        </div>

        <!-- PANEL: Capítulos -->
        ${hasChapters ? `
        <div class="panel ${this._activeTab === "chapters" ? "active" : ""}">
          <div class="chapters-list">
            ${t.chapters.map((ch, ci) => {
              const chHighlights = (ch.highlights ?? []).map(idx => t.highlights[idx]).filter(Boolean);
              return `
                <div class="chapter-card" data-chapter="${ci}">
                  <div class="chapter-header">
                    <span class="chapter-title">${ch.title}</span>
                    <span class="chapter-toggle">⌄</span>
                  </div>
                  <div class="chapter-video">
                    <div class="video-wrap">
                      <iframe
                        src="${ytEmbedUrl(ch.youtubeId, ch.startTime)}"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        loading="lazy"
                        title="${ch.title}"
                      ></iframe>
                    </div>
                  </div>
                  ${chHighlights.length ? `
                    <div class="chapter-highlights">
                      ${chHighlights.map(h => `
                        <div class="chapter-hl">
                          <span class="chapter-hl-time">${formatTime(h.time)}</span>
                          <span>${h.label}</span>
                        </div>
                      `).join("")}
                    </div>
                  ` : ""}
                </div>
              `;
            }).join("")}
          </div>
        </div>
        ` : hasChapters === false && this._activeTab === "chapters" ? `
        <div class="panel active">
          <div class="no-chapters">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Este tema no tiene capítulos editados aún
          </div>
        </div>
        ` : ""}

        <!-- PANEL: Highlights -->
        <div class="panel ${this._activeTab === "highlights" ? "active" : ""}">
          <div class="highlights-list">
            ${t.highlights.map((h, i) => `
              <a class="highlight-item" href="#" data-yt="${t.video.youtubeId}" data-time="${h.time}" data-idx="${i}">
                <span class="highlight-time">${formatTime(h.time)}</span>
                <span class="highlight-label">${h.label}</span>
                <span class="highlight-arrow">▶</span>
              </a>
            `).join("")}
          </div>
        </div>

        <!-- PANEL: Notas -->
        <div class="panel ${this._activeTab === "notes" ? "active" : ""}">
          <p style="font-size:13px;color:#8b8baa;margin-bottom:4px;">Tus apuntes para <strong style="color:#e2e2f0">${t.label}</strong> — se guardan automáticamente.</p>
          <textarea
            class="notes-area"
            id="notes-area"
            placeholder="Escribe tus notas aquí… ej: 'El comando git rebase -i funciona para limpiar commits'"
          >${getNote(t.id)}</textarea>
          <div class="notes-save">
            <span class="saved-indicator" id="saved-indicator">Guardado ✓</span>
          </div>
        </div>
      </div>
    `;

    this._bindEvents(t);
  }

  _bindEvents(t) {
    const root = this.shadowRoot;

    // Tab switching
    root.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", () => {
        this._activeTab = tab.dataset.tab;
        this.render();
      });
    });

    // Highlight clicks → jump to timestamp in new iframe
    root.querySelectorAll(".highlight-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const ytId = item.dataset.yt;
        const time = parseInt(item.dataset.time);
        // Replace all iframes in video panels with the timestamped version
        const videoTab = root.querySelector('.panel:first-of-type .video-wrap iframe');
        if (videoTab) videoTab.src = ytEmbedUrl(ytId, time) + "&autoplay=1";
        // Switch to video tab
        this._activeTab = "video";
        this.render();
      });
    });

    // Chapter toggle
    root.querySelectorAll(".chapter-card").forEach(card => {
      const header = card.querySelector(".chapter-header");
      header?.addEventListener("click", () => card.classList.toggle("open"));
    });

    // Complete button
    const completeBtn = root.getElementById("complete-btn");
    completeBtn?.addEventListener("click", () => {
      const { isFirstTime } = toggleCompleted(t.id);
      emit("topic:complete", { topicId: t.id, isFirstTime });
      this.render();
    });

    // Focus button
    const focusBtn = root.getElementById("focus-btn");
    focusBtn?.addEventListener("click", () => {
      emit("focus:toggle");
    });

    // Notes autosave
    const notesArea = root.getElementById("notes-area");
    const savedIndicator = root.getElementById("saved-indicator");
    let saveTimeout;
    notesArea?.addEventListener("input", () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        saveNote(t.id, notesArea.value);
        if (savedIndicator) {
          savedIndicator.classList.add("show");
          setTimeout(() => savedIndicator.classList.remove("show"), 1500);
        }
      }, 600);
    });
  }
}

customElements.define("topic-viewer", TopicViewer);
