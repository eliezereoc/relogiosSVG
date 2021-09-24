const tpl = document.createElement("template");
tpl.innerHTML = `
    <svg width="100" height="100">
      <g transform="translate(50, 50)" stroke="black" fill="none" stroke-width="2">
        <circle cx="0" cy="0" r="45" />
        ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
          .map((a) => `<path d="M 0 -42 v -3" transform="rotate(${a})" />`)
          .join("\n")}
        <path id="ph" d="M 0 0 v -32" stroke-width="4" />
        <path id="pm" d="M 0 0 v -40" />
        <circle cx="0" cy="0" r="4" fill="black" stroke="none" />
        <path id="ps" d="M 0 0 v -40" stroke="red" />
        <circle cx="0" cy="0" r="2" fill="red" stroke="none" />
      </g>
    </svg>`;

class WcRelogio extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const tipo = this.getAttribute("tipo");
    if (tipo === "analogico") {
      this.shadowRoot.append(tpl.content.cloneNode(true));
      this.atualizaRelogioAnalogico();
      this.intervalId = setInterval(() => {
        this.atualizaRelogioAnalogico();
      }, 1000);
    } else {
      this.span = document.createElement("span");
      this.shadowRoot.append(this.span);
      this.atualizaRelogioDigital();
      this.intervalId = setInterval(() => {
        this.atualizaRelogioDigital();
      }, 1000);
    }
  }

  disconnectedCallback() {
    clearInterval(this.intervalId);
  }

  atualizaRelogioDigital() {
    const date = new Date();
    this.span.textContent = date.toLocaleTimeString();
  }

  atualizaRelogioAnalogico() {
    const date = new Date();
    const s = date.getSeconds();
    const m = date.getMinutes() + s / 60;
    const h = (date.getHours() % 12) + m / 60;
    this.ponteiro("ps").setAttribute("transform", `rotate(${(s * 360) / 60})`);
    this.ponteiro("pm").setAttribute("transform", `rotate(${(m * 360) / 60})`);
    this.ponteiro("ph").setAttribute("transform", `rotate(${(h * 360) / 12})`);
  }

  ponteiro(id) {
    return this.shadowRoot.getElementById(id);
  }
}

customElements.define("wc-relogio", WcRelogio);
