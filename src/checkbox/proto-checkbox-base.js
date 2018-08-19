import {html, LitElement, BooleanAttribute} from '@polymer/lit-element';
import {ControlStateMixin} from '../control-state/control-state-mixin.js';
export const CheckboxBase = (elementName, style) => class ProtoCheckbox extends ControlStateMixin(LitElement) {

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
      ${style}

      <label>
        <span part="checkbox">
          <input
            type="checkbox"
            part="native-checkbox"
            ?checked="${this.checked}"
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

  get focusElement() {
    return this.shadowRoot.querySelector('label');
  }
}

