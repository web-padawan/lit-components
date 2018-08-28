import {html, LitElement} from '@polymer/lit-element';
import {ControlStateMixin} from '../../control-state/control-state-mixin.js';
import {includeStyle} from '../../utils/style-utils.js';
import './proto-checkbox-styles.js';

export class CheckboxBase extends ControlStateMixin(LitElement) {

  static get properties() {
    return {
      checked: {
        type: Boolean,
        reflect: true
      },
      disabled: {
        type: Boolean,
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

  getStyles() {
    return includeStyle('proto-checkbox-styles');
  }

  render() {
    return html`
      <style>
        ${this.getStyles()}
      </style>
      <label>
        <span part="checkbox">
          <input
            type="checkbox"
            part="native-checkbox"
            ?checked="${this.checked}"
            @change="${this._boundInputChangeHandler}"
            role="presentation"
            tabindex="-1">
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
