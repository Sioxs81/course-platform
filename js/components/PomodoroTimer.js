// js/components/PomodoroTimer.js — WebComponent: temporizador Pomodoro

const STYLE = `
  :host { display: block; }

  .pomo {
    border-top: 1px solid #2a2a3e;
    padding: 12px 14px;
    user-select: none;
  }

  .pomo-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .pomo-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #4a4a6a;
  }

  .pomo-mode {
    display: flex;
    gap: 4px;
  }

  .mode-btn {
    font-size: 10px;
    padding: 2px 7px;
    border-radius: 3px;
    border: 1px solid #2a2a3e;
    background: transparent;
    color: #4a4a6a;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
  }
  .mode-btn:hover { color: #8b8baa; border-color: #3a3a55; }
  .mode-btn.active { background: rgba(99,102,241,0.15); border-color: #6366f1; color: #6366f1; }

  .pomo-display {
    text-align: center;
    margin: 4px 0 8px;
  }

  .pomo-time {
    font-size: 28px;
    font-weight: 700;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    letter-spacing: 2px;
    color: #e2e2f0;
    transition: color 0.3s;
  }

  .pomo-time.urgent { color: #ec4899; }

  .pomo-progress {
    height: 3px;
    background: #2a2a3e;
    border-radius: 2px;
    margin-bottom: 8px;
    overflow: hidden;
  }

  .pomo-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #ec4899);
    border-radius: 2px;
    transition: width 1s linear;
  }

  .pomo-controls {
    display: flex;
    justify-content: center;
    gap: 6px;
  }

  .ctrl-btn {
    padding: 5px 14px;
    border-radius: 5px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid #2a2a3e;
    background: #1e1e2e;
    color: #8b8baa;
    transition: all 0.15s;
    font-family: inherit;
  }
  .ctrl-btn:hover { border-color: #6366f1; color: #e2e2f0; }
  .ctrl-btn.start { background: rgba(99,102,241,0.15); border-color: #6366f1; color: #6366f1; }
  .ctrl-btn.pause { background: rgba(236,72,153,0.1); border-color: #ec4899; color: #ec4899; }
  .ctrl-btn.reset { color: #4a4a6a; }
`;

const MODES = {
  work:       { label: "25:00", seconds: 25 * 60, name: "Trabajo" },
  shortBreak: { label: "5:00",  seconds:  5 * 60, name: "Pausa" },
  longBreak:  { label: "15:00", seconds: 15 * 60, name: "Descanso" }
};

export class PomodoroTimer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._mode = "work";
    this._remaining = MODES.work.seconds;
    this._running = false;
    this._interval = null;
  }

  connectedCallback() { this.render(); }
  disconnectedCallback() { clearInterval(this._interval); }

  _tick() {
    if (this._remaining <= 0) {
      clearInterval(this._interval);
      this._running = false;
      this._beep();
      this.render();
      return;
    }
    this._remaining--;
    this._updateDisplay();
  }

  _beep() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.2);
    } catch {}
  }

  _start() {
    if (this._remaining <= 0) return;
    this._running = true;
    this._interval = setInterval(() => this._tick(), 1000);
    this.render();
  }

  _pause() {
    this._running = false;
    clearInterval(this._interval);
    this.render();
  }

  _reset() {
    clearInterval(this._interval);
    this._running = false;
    this._remaining = MODES[this._mode].seconds;
    this.render();
  }

  _setMode(mode) {
    clearInterval(this._interval);
    this._running = false;
    this._mode = mode;
    this._remaining = MODES[mode].seconds;
    this.render();
  }

  _updateDisplay() {
    const total = MODES[this._mode].seconds;
    const pct = ((total - this._remaining) / total) * 100;
    const m = Math.floor(this._remaining / 60);
    const s = this._remaining % 60;
    const timeStr = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

    const timeEl = this.shadowRoot.querySelector(".pomo-time");
    const fillEl = this.shadowRoot.querySelector(".pomo-fill");
    if (timeEl) {
      timeEl.textContent = timeStr;
      timeEl.classList.toggle("urgent", this._remaining <= 60);
    }
    if (fillEl) fillEl.style.width = `${pct}%`;
  }

  render() {
    const total = MODES[this._mode].seconds;
    const pct = ((total - this._remaining) / total) * 100;
    const m = Math.floor(this._remaining / 60);
    const s = this._remaining % 60;
    const timeStr = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <div class="pomo">
        <div class="pomo-header">
          <span class="pomo-label">Pomodoro</span>
          <div class="pomo-mode">
            ${Object.entries(MODES).map(([key, val]) => `
              <button class="mode-btn ${this._mode === key ? "active" : ""}" data-mode="${key}">${val.name}</button>
            `).join("")}
          </div>
        </div>
        <div class="pomo-display">
          <div class="pomo-time ${this._remaining <= 60 ? "urgent" : ""}">${timeStr}</div>
        </div>
        <div class="pomo-progress">
          <div class="pomo-fill" style="width: ${pct}%"></div>
        </div>
        <div class="pomo-controls">
          ${!this._running
            ? `<button class="ctrl-btn start" id="start-btn">▶ Iniciar</button>`
            : `<button class="ctrl-btn pause" id="pause-btn">⏸ Pausar</button>`
          }
          <button class="ctrl-btn reset" id="reset-btn">↺</button>
        </div>
      </div>
    `;

    this.shadowRoot.querySelectorAll(".mode-btn").forEach(btn => {
      btn.addEventListener("click", () => this._setMode(btn.dataset.mode));
    });
    this.shadowRoot.getElementById("start-btn")?.addEventListener("click", () => this._start());
    this.shadowRoot.getElementById("pause-btn")?.addEventListener("click", () => this._pause());
    this.shadowRoot.getElementById("reset-btn")?.addEventListener("click", () => this._reset());
  }
}

customElements.define("pomodoro-timer", PomodoroTimer);
