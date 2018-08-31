import { html, LitElement } from '@polymer/lit-element';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { ControlStateMixin } from '@lit/control-state-mixin';
import { includeStyle } from '@lit/style-utils';
import './lit-radio-button-styles.js';

export class RadioButtonBase extends ControlStateMixin(GestureEventListeners(LitElement)) {
  static get properties() {
    return {
      /**
       * True if the radio button is checked.
       */
      checked: {
        type: Boolean,
        reflect: true
      },

      /**
       * The value for this element.
       */
      value: {
        reflect: true
      }
    };
  }

  constructor() {
    super();
    this._boundInputChangeHandler = this._inputChangeHandler.bind(this);
    if (!this.hasAttribute('checked')) {
      this.checked = false;
    }
    if (!this.hasAttribute('value')) {
      this.value = 'on';
    }
  }

  getStyles() {
    return includeStyle('lit-radio-button-styles');
  }

  render() {
    return html`
      <style>
        ${this.getStyles()}
      </style>

      <label @click="_preventDefault">
        <span part="radio">
          <input
            type="radio"
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
    return this.shadowRoot.querySelector('input');
  }

  get name() {
    return this.checked ? this._storedName : '';
  }

  set name(name) {
    this._storedName = name;
  }

  firstUpdated() {
    super.firstUpdated();

    this.setAttribute('role', 'radio');

    this._addActiveListeners();

    const attrName = this.getAttribute('name');
    if (attrName) {
      this.name = attrName;
    }
  }

  update(props) {
    super.update(props);

    if (props.has('checked')) {
      this._checkedChanged(this.checked);
    }
  }

  _addActiveListeners() {
    this._addEventListenerToNode(this, 'down', e => {
      if (!this.disabled) {
        this.setAttribute('active', '');
      }
    });

    this._addEventListenerToNode(this, 'up', e => {
      this.removeAttribute('active');

      if (!this.checked && !this.disabled) {
        this.checked = true;
      }
    });

    this.addEventListener('keydown', e => {
      if (!this.disabled && e.keyCode === 32) {
        e.preventDefault();
        this.setAttribute('active', '');
      }
    });

    this.addEventListener('keyup', e => {
      if (!this.disabled && e.keyCode === 32) {
        e.preventDefault();
        this.checked = true;
        this.removeAttribute('active');
      }
    });
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

  _preventDefault(e) {
    e.preventDefault();
  }
}
