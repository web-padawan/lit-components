import {ComponentBase, html, renderThemeStyles} from '../base/component-base.js';
import {until} from 'lit-html/lib/until.js';

// FIXME: default theme overrides the loaded theme in Shady mode
const checkboxDefaultTheme = html`
  <style>
    :host {
      display: block;
    }

    :host([hidden]) {
      display: none !important;
    }
  </style>
`;

export class ProtoCheckbox extends ComponentBase {

  static get is() {
    return 'proto-checkbox';
  }

  static get properties() {
    return {
      checked: Boolean,
      indeterminate: Boolean,
      disabled: Boolean,
      value: String,
    };
  }

  constructor() {
    super();
    this.checked = false;
    this.disabled = false;
    this.value = '';
    this._boundInputChangeHandler = this._inputChangeHandler.bind(this);
  }

  _render({checked, value}) {
    return html`
      ${until(
        renderThemeStyles(this.constructor.is),
        html`${checkboxDefaultTheme}`)}

      <style>
        :host {
          display: inline-block;
        }

        label {
          display: inline-flex;
          align-items: baseline;
          outline: none;
        }

        [part="checkbox"] {
          position: relative;
          display: inline-block;
          flex: none;
        }

        input[type="checkbox"] {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: inherit;
        }

        :host([disabled]) {
          -webkit-tap-highlight-color: transparent;
        }
      </style>

      <label>
        <span part="checkbox">
          <input
            type="checkbox"
            part="native-checkbox"
            checked="${checked}"
            value="${value}"
            on-change="${this._boundInputChangeHandler}">
        </span>

        <span part="label">
          <slot></slot>
        </span>
      </label>
    `;
  }

  _didRender(props, changed) {
    if ('checked' in changed) {
      if (this.checked) {
        this.setAttribute('checked', '');
      } else {
        this.removeAttribute('checked');
      }
    }
  }

  _inputChangeHandler(e) {
    this.checked = e.target.checked;
  }
}

customElements.define(ProtoCheckbox.is, ProtoCheckbox);
