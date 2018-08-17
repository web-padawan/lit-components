import {html, LitElement, BooleanAttribute} from '@polymer/lit-element';
import {includeStyles} from '../base/include-styles.js';

export const CheckboxBase = elementName => class ProtoCheckbox extends LitElement {

  static get is() {
    return elementName;
  }

  static get properties() {
    return {
      checked: {
        type: BooleanAttribute,
        reflect: true
      },
      disabled: {
        type: BooleanAttribute,
        reflect: true
      },
      value: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this._boundInputChangeHandler = this._inputChangeHandler.bind(this);
  }

  render() {
    return html`
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

      ${includeStyles(elementName)}

      <label>
        <span part="checkbox">
          <input
            type="checkbox"
            part="native-checkbox"
            .checked="${this.checked}"
            @change="${this._boundInputChangeHandler}">
        </span>

        <span part="label">
          <slot></slot>
        </span>
      </label>
    `;
  }

  _inputChangeHandler(e) {
    const target = e.composedPath()[0];
    this.checked = target.checked;
  }
}
