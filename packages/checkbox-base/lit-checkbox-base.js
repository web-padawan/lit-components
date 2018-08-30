import { html, LitElement } from '@polymer/lit-element';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { ControlStateMixin } from '@lit/control-state-mixin';
import { includeStyle } from '@lit/style-utils';
import './lit-checkbox-styles.js';

export class CheckboxBase extends ControlStateMixin(GestureEventListeners(LitElement)) {
  static get properties() {
    return {
      /**
       * True if the checkbox is checked.
       */
      checked: {
        type: Boolean,
        reflect: true
      },

      /**
       * Indeterminate state of the checkbox when it's neither checked nor unchecked, but undetermined.
       * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Indeterminate_state_checkboxes
       */
      indeterminate: {
        type: Boolean,
        reflect: true
      },

      /**
       * The value given to the data submitted with the checkbox's name
       * to the server when the control is inside a form.
       */
      value: {
        reflect: true
      },

      _nativeCheckbox: {
        shouldInvalidate: () => false
      },

      _labelPart: {
        shouldInvalidate: () => false
      }
    };
  }

  constructor() {
    super();
    this._boundInputChangeHandler = this._inputChangeHandler.bind(this);
  }

  getStyles() {
    return includeStyle('lit-checkbox-styles');
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
            ?checked="${this.checked}"
            ?disabled="${this.disabled}"
            .indeterminate="${this.indeterminate}"
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

  get name() {
    return this.checked ? this._storedName : '';
  }

  set name(name) {
    this._storedName = name;
  }

  firstRendered() {
    super.firstRendered();

    const attrName = this.getAttribute('name');
    if (attrName) {
      this.name = attrName;
    }

    this.setAttribute('role', 'checkbox');

    this._nativeCheckbox = this.shadowRoot.querySelector('input');
    this._labelPart = this.shadowRoot.querySelector('[part~="label"]');

    this.addEventListener('click', this._handleClick.bind(this));

    this._addActiveListeners();

    this._labelPart
      .querySelector('slot')
      .addEventListener('slotchange', this._updateLabelAttribute.bind(this));

    this._updateLabelAttribute();
  }

  update(props) {
    if (!this._firstRendered && !this.hasAttribute('checked')) {
      this.checked = false;
    }

    if (!this._firstRendered && !this.hasAttribute('value')) {
      this.value = 'on';
    }

    if (props.has('indeterminate')) {
      this._indeterminateChanged(this.indeterminate);
    }

    if (props.has('checked')) {
      this._checkedChanged(this.checked);
    }

    super.update(props);
  }

  _addActiveListeners() {
    // DOWN
    this._addEventListenerToNode(this, 'down', e => {
      if (this._interactionsAllowed(e)) {
        this.setAttribute('active', '');
      }
    });

    // UP
    this._addEventListenerToNode(this, 'up', () => this.removeAttribute('active'));

    // KEYDOWN
    this.addEventListener('keydown', e => {
      if (this._interactionsAllowed(e) && e.keyCode === 32) {
        e.preventDefault();
        this.setAttribute('active', '');
      }
    });

    // KEYUP
    this.addEventListener('keyup', e => {
      if (this._interactionsAllowed(e) && e.keyCode === 32) {
        e.preventDefault();
        this._toggleChecked();
        this.removeAttribute('active');
        if (this.indeterminate) {
          this.indeterminate = false;
        }
      }
    });
  }

  _checkedChanged(checked) {
    if (this.indeterminate) {
      this.setAttribute('aria-checked', 'mixed');
    } else {
      this.setAttribute('aria-checked', checked);
    }
    this.dispatchEvent(
      new CustomEvent('checked-changed', {
        detail: { value: checked }
      })
    );
  }

  _indeterminateChanged(indeterminate) {
    if (indeterminate) {
      this.setAttribute('aria-checked', 'mixed');
    } else {
      this.setAttribute('aria-checked', this.checked);
    }
    this.dispatchEvent(
      new CustomEvent('indeterminate-changed', {
        detail: { value: indeterminate }
      })
    );
  }

  _inputChangeHandler(e) {
    const target = e.composedPath()[0];
    this.checked = target.checked;
    this.indeterminate = target.indeterminate;
  }

  _handleClick(e) {
    if (this._interactionsAllowed(e)) {
      if (!this.indeterminate) {
        if (e.composedPath()[0] !== this._nativeCheckbox) {
          e.preventDefault();
          this._toggleChecked();
        }
      } else {
        /*
         * Required for IE 11 and Edge.
         * See issue here: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7344418/
         */
        this.indeterminate = false;
        e.preventDefault();
        this._toggleChecked();
      }
    }
  }

  /**
   * True if users' interactions (mouse or keyboard)
   * should toggle the checkbox
   */
  _interactionsAllowed(e) {
    if (this.disabled) {
      return false;
    }
    // https://github.com/vaadin/vaadin-checkbox/issues/63
    if (e.target.localName === 'a') {
      return false;
    }
    return true;
  }

  _toggleChecked() {
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('change', { composed: true, bubbles: true }));
  }

  _updateLabelAttribute() {
    const label = this._labelPart;
    if (label.firstElementChild.assignedNodes().length === 0) {
      label.setAttribute('empty', '');
    } else {
      label.removeAttribute('empty');
    }
  }
}
