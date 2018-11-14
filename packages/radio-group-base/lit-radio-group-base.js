import { html } from '@polymer/lit-element';
import { css } from 'lit-css';
import { StyledLitElement } from 'styled-lit-element';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { RadioButtonBase } from '@lit/radio-button-base';
import styles from './lit-radio-group-styles.js';

let uniqueId = 0;

export class RadioGroupBase extends StyledLitElement {
  static get style() {
    return css`
      ${styles}
    `;
  }

  constructor() {
    super();
    this._errorId = `lit-radio-group-error-${++uniqueId}`;
    this.invalid = false;
  }

  render() {
    return html`
      <div class="vaadin-group-field-container">
        <label part="label">${this.label}</label>
        <div part="group-field"><slot></slot></div>
        <div
          part="error-message"
          id="${this._errorId}"
          aria-live="assertive"
          aria-hidden="${!(this.invalid && this.errorMessage)}"
        >
          ${this.errorMessage}
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      /**
       * The current disabled state of the radio group. True if group and all internal radio buttons are disabled.
       */
      disabled: {
        type: Boolean,
        reflect: true
      },

      /**
       * This attribute indicates that the user cannot modify the value of the control.
       */
      readonly: {
        type: Boolean,
        reflect: true
      },

      /**
       * This property is set to true when the value is invalid.
       */
      invalid: {
        type: Boolean,
        reflect: true
      },

      /**
       * Specifies that the user must fill in a value.
       */
      required: {
        type: Boolean,
        reflect: true
      },

      /**
       * Error to show when the radio group value is invalid.
       */
      errorMessage: {
        attribute: 'error-message'
      },

      _errorId: {
        type: String
      },

      _checkedButton: {
        hasChanged: () => false
      },

      /**
       * String used for the label element.
       */
      label: {
        type: {
          fromAttribute: String,
          toAttribute: value => (value == null ? null : value.toString())
        },
        reflect: true
      },

      /**
       * Value of the radio group.
       */
      value: {
        type: String
      }
    };
  }

  firstUpdated() {
    this.setAttribute('role', 'radiogroup');

    this._addActiveListeners();

    this._observer = new FlattenedNodesObserver(this, info => {
      const checkedChangedListener = e => {
        if (e.target.checked) {
          this._changeSelectedButton(e.target);
        }
      };

      // reverse() is used to set the last checked radio button value to radio group value
      this._filterRadioButtons(info.addedNodes)
        .reverse()
        .forEach(button => {
          button.addEventListener('checked-changed', checkedChangedListener);
          if (this.disabled) {
            button.disabled = true;
          }
          if (button.checked) {
            this._changeSelectedButton(button);
          }
        });

      this._filterRadioButtons(info.removedNodes).forEach(button => {
        button.removeEventListener('checked-changed', checkedChangedListener);
        if (button.checked) {
          this.value = undefined;
        }
      });
    });

    if (this._radioButtons.length) {
      this._setFocusable(0);
    }

    this.addEventListener('focusout', () => this.validate());
  }

  update(props) {
    if (props.has('disabled')) {
      this._disabledChanged(this.disabled);
    }
    if (props.has('readonly')) {
      this._readonlyChanged(this.readonly, props.get('readonly'));
    }
    if (props.has('value')) {
      this._valueChanged(this.value);
    }
    if (props.has('label')) {
      this._labelChanged(this.label);
    }
    if (props.has('invalid')) {
      this.dispatchEvent(new CustomEvent('invalid-changed', { detail: { value: this.invalid } }));
    }
    super.update(props);
  }

  get _radioButtons() {
    return this._filterRadioButtons(this.querySelectorAll('*'));
  }

  _addActiveListeners() {
    this.addEventListener('keydown', e => {
      // if e.target is vaadin-radio-group then assign to checkedRadioButton currently checked radio button
      var checkedRadioButton = e.target == this ? this._checkedButton : e.target;

      // LEFT, UP - select previous radio button
      if (e.keyCode === 37 || e.keyCode === 38) {
        e.preventDefault();
        this._selectPreviousButton(checkedRadioButton);
      }

      // RIGHT, DOWN - select next radio button
      if (e.keyCode === 39 || e.keyCode === 40) {
        e.preventDefault();
        this._selectNextButton(checkedRadioButton);
      }
    });
  }

  _filterRadioButtons(nodes) {
    return Array.from(nodes).filter(child => child instanceof RadioButtonBase);
  }

  _disabledChanged(disabled) {
    this.setAttribute('aria-disabled', disabled);
    this._updateDisableButtons();
  }

  _readonlyChanged(value, oldValue) {
    if (value || oldValue) {
      this._updateDisableButtons();
    }
  }

  _selectButton(element, setFocusRing) {
    if (this._containsFocus()) {
      element.focus();
      if (setFocusRing) {
        element.setAttribute('focus-ring', '');
      }
    }
    this._changeSelectedButton(element);
  }

  _updateDisableButtons() {
    this._radioButtons.forEach(button => {
      if (this.disabled) {
        button.disabled = true;
      } else if (this.readonly) {
        // it's not possible to set readonly to radio buttons, but we can
        // unchecked ones instead.
        button.disabled = button !== this._checkedButton && this.readonly;
      } else {
        button.disabled = false;
      }
    });
  }

  _containsFocus() {
    const root = this.getRootNode();
    // Safari 9 needs polyfilled `_activeElement` to return correct node
    const activeElement =
      root._activeElement !== undefined ? root._activeElement : root.activeElement;
    return this.contains(activeElement);
  }

  _hasEnabledButtons() {
    return !this._radioButtons.every(button => button.disabled);
  }

  _selectNextButton(element) {
    if (!this._hasEnabledButtons()) {
      return;
    }
    const nextButton = element.nextElementSibling || this.firstElementChild;
    if (nextButton.disabled) {
      this._selectNextButton(nextButton);
    } else {
      this._selectButton(nextButton, true);
    }
  }

  _selectPreviousButton(element) {
    if (!this._hasEnabledButtons()) {
      return;
    }
    const previousButton = element.previousElementSibling || this.lastElementChild;
    if (previousButton.disabled) {
      this._selectPreviousButton(previousButton);
    } else {
      this._selectButton(previousButton, true);
    }
  }

  _changeSelectedButton(checked) {
    this._checkedButton = checked;
    this.readonly && this._updateDisableButtons();
    checked && this._setFocusable(this._radioButtons.indexOf(checked));
    this._radioButtons.forEach(radio => (radio.checked = radio === checked));
    this.value = checked && checked.value;
    this.validate();
  }

  _valueChanged(value) {
    if (!this._checkedButton || value != this._checkedButton.value) {
      const newCheckedButton = this._radioButtons.filter(button => button.value === value)[0];

      if (newCheckedButton) {
        this._selectButton(newCheckedButton);
      } else if (value !== '' && value != null) {
        console.warn(`No radio-button with value ${value} found.`);
      } else {
        this._changeSelectedButton(null);
      }
    }
    if (value !== '' && value != null) {
      this.setAttribute('has-value', '');
    } else {
      this.removeAttribute('has-value');
    }
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value } }));
  }

  /**
   * Returns true if `value` is valid.
   * `<iron-form>` uses this to check the validity or all its elements.
   *
   * @return {boolean} True if the value is valid.
   */
  validate() {
    return !(this.invalid = !this.checkValidity());
  }

  /**
   * Returns true if the current input value satisfies all constraints (if any)
   * @returns {boolean}
   */
  checkValidity() {
    return !this.required || !!this.value;
  }

  _setFocusable(idx) {
    const items = this._radioButtons;
    items.forEach(e => (e.tabIndex = e === items[idx] ? 0 : -1));
  }

  _labelChanged(label) {
    if (label) {
      this.setAttribute('has-label', '');
    } else {
      this.removeAttribute('has-label');
    }
  }
}
