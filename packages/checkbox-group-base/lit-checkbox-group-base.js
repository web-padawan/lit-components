import { LitElement, html } from 'lit-element';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { CheckboxBase } from '@lit/checkbox-base';
import styles from './lit-checkbox-group-styles.js';

function filterCheckboxes(nodes) {
  return Array.from(nodes).filter(child => child instanceof CheckboxBase);
}

export class CheckboxGroupBase extends LitElement {
  static get styles() {
    return styles;
  }

  static get properties() {
    return {
      /**
       * The current disabled state of the checkbox group. True if group and all internal checkboxes are disabled.
       */
      disabled: {
        type: Boolean,
        reflect: true
      },

      /**
       * String used for the label element.
       */
      label: {
        type: String,
        reflect: true
      },

      /**
       * Value of the checkbox group.
       * Note: toggling the checkboxes modifies the value
       * by creating new array instance each time.
       */
      value: {
        type: Array,
        hasChanged: () => true
      },

      /**
       * Error to show when the checkbox group value is invalid.
       */
      errorMessage: {
        attribute: 'error-message'
      },

      /**
       * Specifies that the user must fill in a value.
       */
      required: {
        type: Boolean,
        reflect: true
      },

      /**
       * This property is set to true when the control value is invalid.
       */
      invalid: {
        type: Boolean,
        reflect: true
      },

      _updatingValue: {
        hasChanged: () => false
      }
    };
  }

  constructor() {
    super();
    this.value = [];
  }

  render() {
    return html`
      <div class="vaadin-group-field-container">
        <label part="label">${this.label}</label>
        <div part="group-field"><slot id="slot"></slot></div>
        <div
          part="error-message"
          aria-live="assertive"
          aria-hidden="${!this.errorMessage || !this.invalid}"
        >
          ${this.errorMessage}
        </div>
      </div>
    `;
  }

  firstUpdated() {
    const checkedChangedListener = e => this._changeSelectedCheckbox(e.target);

    this._observer = new FlattenedNodesObserver(this, info => {
      const addedCheckboxes = filterCheckboxes(info.addedNodes);

      addedCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('checked-changed', checkedChangedListener);
        if (this.disabled) {
          checkbox.disabled = true;
        }

        if (checkbox.checked) {
          this._addCheckboxToValue(checkbox.value);
        }
      });

      filterCheckboxes(info.removedNodes).forEach(checkbox => {
        checkbox.removeEventListener('checked-changed', checkedChangedListener);
        if (checkbox.checked) {
          this._removeCheckboxFromValue(checkbox.value);
        }
      });

      if (addedCheckboxes.some(checkbox => !checkbox.hasAttribute('value'))) {
        console.warn('Please add value attribute to all checkboxes in checkbox group');
      }
    });

    this.addEventListener('focusout', e => {
      // validate when stepping out of the checkbox group
      if (
        !this._checkboxes.some(
          checkbox => e.relatedTarget === checkbox || checkbox.shadowRoot.contains(e.relatedTarget)
        )
      ) {
        this.validate();
      }
    });
  }

  update(props) {
    if (props.has('label')) {
      this._labelChanged(this.label);
    }

    if (props.has('value')) {
      this._valueChanged(this.value, props.get('value'));
    }

    if (props.has('invalid')) {
      this.dispatchEvent(new CustomEvent('invalid-changed', { detail: { value: this.invalid } }));
    }

    if (props.has('disabled')) {
      this._disabledChanged(this.disabled);
    }

    super.update(props);
  }

  get updateComplete() {
    return super.updateComplete.then(() =>
      Promise.all(this._checkboxes.map(cb => cb.updateComplete))
    );
  }

  get _checkboxes() {
    return filterCheckboxes(this.querySelectorAll('*'));
  }

  /**
   * Returns true if `value` is valid.
   * `<iron-form>` uses this to check the validity or all its elements.
   *
   * @return {boolean} True if the value is valid.
   */
  validate() {
    this.invalid = this.required && this.value.length === 0;
    return !this.invalid;
  }

  _disabledChanged(disabled) {
    this.setAttribute('aria-disabled', disabled);

    this._checkboxes.forEach(checkbox => {
      checkbox.disabled = disabled;
    });
  }

  _addCheckboxToValue(value) {
    const update = this.value.slice(0);
    update.push(value);
    this.value = update;
  }

  _removeCheckboxFromValue(value) {
    const update = this.value.slice(0);
    const index = update.indexOf(value);
    update.splice(index, 1);
    this.value = update;
  }

  _changeSelectedCheckbox(checkbox) {
    if (this._updatingValue) {
      return;
    }

    if (checkbox.checked) {
      this._addCheckboxToValue(checkbox.value);
    } else {
      this._removeCheckboxFromValue(checkbox.value);
    }
  }

  _valueChanged(value, oldValue) {
    if (this._updatingValue) {
      return;
    }

    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value } }));

    // setting initial value to empty array, skip validation
    if (value.length === 0 && oldValue === undefined) {
      return;
    }

    if (value && value.length) {
      this.setAttribute('has-value', '');
    } else {
      this.removeAttribute('has-value');
    }

    // set a flag to avoid updating loop
    this._updatingValue = true;

    // reflect the value array to checkboxes
    this._checkboxes.forEach(checkbox => {
      checkbox.checked = value.indexOf(checkbox.value) > -1;
    });

    this.validate();

    this.updateComplete.then(() => {
      this._updatingValue = false;
    });
  }

  _labelChanged(label) {
    if (label) {
      this.setAttribute('has-label', '');
    } else {
      this.removeAttribute('has-label');
    }
  }
}
