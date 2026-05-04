// js/components/TopicCube.js — WebComponent: cubo de tema estilo Street Fighter

import { emit } from "@modules/eventBus.js";
import { getIcon } from "@modules/icons.js";
import { getCompleted } from "@modules/storage.js";

const STYLE = `
  :host { display: block; }

  .cube {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    cursor: pointer;
    border: 1px solid #2a2a3e;
    border-radius: 3px;
    background: #1e1e2e;
    position: relative;
    overflow: hidden;
    transition: border-color 0.15s, background 0.15s, transform 0.1s;
    user-select: none;
    padding: 4px 2px;
  }

  .cube::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    background: var(--accent, #6366f1);
    transition: opacity 0.15s;
  }

  .cube:hover::before { opacity: 0.08; }
  .cube:hover { border-color: var(--accent, #6366f1); transform: scale(1.04); }
  .cube:active { transform: scale(0.96); }

  .cube.active {
    border-color: var(--accent, #6366f1);
    background: #22223a;
  }
  .cube.active::before { opacity: 0.15; }

  .cube.active .cube-icon { color: var(--accent, #6366f1); }

  .cube.completed .check {
    display: flex;
  }

  .cube-icon {
    width: 16px;
    height: 16px;
    color: #8b8baa;
    transition: color 0.15s;
    flex-shrink: 0;
  }
  .cube-icon svg { width: 100%; height: 100%; }

  .cube-label {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: #8b8baa;
    text-align: center;
    line-height: 1.1;
    transition: color 0.15s;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cube.active .cube-label { color: #e2e2f0; }

  .check {
    display: none;
    position: absolute;
    top: 3px;
    right: 3px;
    width: 10px;
    height: 10px;
    background: #22c55e;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
  }
  .check svg { width: 7px; height: 7px; color: white; }

  @keyframes unlock {
    0%   { box-shadow: 0 0 0 0 var(--glow, rgba(99,102,241,0.6)); transform: scale(1); }
    40%  { box-shadow: 0 0 0 10px rgba(99,102,241,0); transform: scale(1.15); }
    100% { box-shadow: none; transform: scale(1); }
  }
  .cube.just-unlocked { animation: unlock 0.55s ease forwards; }
`;

export class TopicCube extends HTMLElement {
  static get observedAttributes() { return ["topic-id", "label", "icon", "color", "active"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  get topicId()  { return this.getAttribute("topic-id"); }
  get label()    { return this.getAttribute("label") ?? ""; }
  get iconName() { return this.getAttribute("icon") ?? "js"; }
  get isActive() { return this.hasAttribute("active"); }

  render() {
    const completed = getCompleted().has(this.topicId);
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-color").trim() || "#6366f1";

    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <div
        class="cube ${this.isActive ? "active" : ""} ${completed ? "completed" : ""}"
        style="--accent: ${accentColor}"
        part="cube"
        title="${this.label}"
        role="button"
        tabindex="0"
        aria-pressed="${this.isActive}"
        aria-label="${this.label}${completed ? " (completado)" : ""}"
      >
        <div class="cube-icon">${getIcon(this.iconName)}</div>
        <span class="cube-label">${this.label}</span>
        <div class="check" aria-hidden="true">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="2,6 5,9 10,3"/>
          </svg>
        </div>
      </div>
    `;

    const cube = this.shadowRoot.querySelector(".cube");
    cube.addEventListener("click", () => emit("topic:select", { topicId: this.topicId }));
    cube.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        emit("topic:select", { topicId: this.topicId });
      }
    });
  }

  triggerUnlock() {
    const cube = this.shadowRoot.querySelector(".cube");
    if (!cube) return;
    cube.classList.remove("just-unlocked");
    void cube.offsetWidth; // reflow
    cube.classList.add("just-unlocked");
    cube.addEventListener("animationend", () => cube.classList.remove("just-unlocked"), { once: true });
  }
}

customElements.define("topic-cube", TopicCube);
