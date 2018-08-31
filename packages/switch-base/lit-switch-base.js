import { html, LitElement } from '@polymer/lit-element';
import { ControlStateMixin } from '@lit/control-state-mixin';
import { CheckboxMixin } from '@lit/checkbox-mixin';
import { includeStyle } from '@lit/style-utils';
import './lit-switch-styles.js';

export class SwitchBase extends ControlStateMixin(CheckboxMixin(LitElement)) {
  constructor() {
    super();
    this._boundInputChangeHandler = this._inputChangeHandler.bind(this);
  }

  getStyles() {
    return includeStyle('lit-switch-styles');
  }

  render() {
    return html`
      <style>
        ${this.getStyles()}
      </style>
      <label>
        <span part="track">
          <span part="thumb-underlay">
            <span part="thumb"></span>
          </span>
          <input
            type="checkbox"
            ?checked="${this.checked}"
            ?disabled="${this.disabled}"
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

  get focusElement() {
    return this.shadowRoot.querySelector('label');
  }

  firstRendered() {
    super.firstRendered();

    this.setAttribute('role', 'switch');
    this.setAttribute('data-action', 'aria-switch');

    this.addEventListener('click', this._handleClick.bind(this));

    this._setupListeners();
  }

  update(props) {
    if (!this._firstRendered && !this.hasAttribute('checked')) {
      this.checked = false;
    }

    if (props.has('checked')) {
      this._checkedChanged(this.checked);
    }

    super.update(props);
  }

  _checkedChanged(checked) {
    this.setAttribute('aria-checked', checked);
    this.dispatchEvent(
      new CustomEvent('checked-changed', {
        detail: { value: checked }
      })
    );
  }

  _inputChangeHandler(e) {
    const target = e.composedPath()[0];
    this.checked = target.checked;
  }

  _handleClick(e) {
    if (this._interactionsAllowed(e)) {
      e.preventDefault();
      this._toggleChecked();
    }
  }
}
