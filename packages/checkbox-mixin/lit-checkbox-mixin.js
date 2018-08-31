import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';

/**
 * @polymerMixin
 */
export const CheckboxMixin = superClass =>
  class extends GestureEventListeners(superClass) {
    static get properties() {
      return {
        /**
         * True if the checkbox is checked.
         */
        checked: {
          type: Boolean,
          reflect: true
        },

        _labelPart: {
          shouldInvalidate: () => false
        }
      };
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
        }
      });
    }

    _addLabelListener() {
      this._labelPart = this.shadowRoot.querySelector('[part~="label"]');

      this._labelPart
        .querySelector('slot')
        .addEventListener('slotchange', this._updateLabelAttribute.bind(this));

      this._updateLabelAttribute();
    }

    _toggleChecked() {
      this.checked = !this.checked;
    }

    _setupListeners() {
      this._addActiveListeners();
      this._addLabelListener();
    }

    _updateLabelAttribute() {
      const label = this._labelPart;
      if (label.firstElementChild.assignedNodes().length === 0) {
        label.setAttribute('empty', '');
      } else {
        label.removeAttribute('empty');
      }
    }
  };
