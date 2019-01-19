import { LitElement, html } from 'lit-element';
import { CheckboxMixin } from '@lit/checkbox-mixin';
import styles from './lit-switch-styles.js';

export class SwitchBase extends CheckboxMixin(LitElement) {
  static get styles() {
    return styles;
  }

  constructor() {
    super();
    this.checked = false;
  }

  render() {
    return html`
      <label>
        <span part="track">
          <span part="thumb"></span>
          <input
            type="checkbox"
            ?checked="${this.checked}"
            ?disabled="${this.disabled}"
            @change="${this._inputChangeHandler}"
            role="presentation"
            tabindex="-1"
          />
        </span>
        <span part="label"><slot></slot></span>
      </label>
    `;
  }

  get focusElement() {
    return this.shadowRoot.querySelector('label');
  }

  firstUpdated() {
    super.firstUpdated();

    this.setAttribute('role', 'switch');
    this.setAttribute('data-action', 'aria-switch');

    this.addEventListener('click', this._handleClick.bind(this));
  }

  update(props) {
    super.update(props);

    if (props.has('checked')) {
      this._checkedChanged(this.checked);
    }
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
    if (this._interactionsAllowed(e) && e.composedPath()[0] !== this._nativeCheckbox) {
      e.preventDefault();
      this._toggleChecked();
    }
  }
}
