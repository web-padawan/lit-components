import {BooleanAttribute} from '@polymer/lit-element';

/**
 * @polymerMixin
 */
export const ControlStateMixin = superClass => class extends superClass {
  static get properties() {
    return {
      /**
       * Specify that this control should have input focus when the page loads.
       */
      autofocus: {
        type: BooleanAttribute,
        reflect: true
      },

      /**
       * Internal property needed to listen to `tabindex` attribute changes.
       *
       * For changing the tabindex of this component use the native `tabIndex` property.
       * @private
       */
      tabindex: {
        type: {
          fromAttribute: parseInt,
          toAttribute: value => {
            if (value === undefined) {
              return null;
            }
            return isNaN(parseInt(value)) ? 0 : value.toString()
          }
        },
        reflect: true,
      },

      /**
       * If true, the user cannot interact with this element.
       */
      disabled: {
        type: BooleanAttribute,
        reflect: true
      },

      _previousTabIndex: {
        attribute: false
      },

      _isShiftTabbing: {
        attribute: false
      }
    };
  }

  constructor() {
    super();
    this._boundKeydownListener = this._bodyKeydownListener.bind(this);
    this._boundKeyupListener = this._bodyKeyupListener.bind(this);
  }

  /**
   * @protected
   */
  connectedCallback() {
    super.connectedCallback();

    if (!this.hasAttribute('tabindex')) {
      this.tabindex = 0;
    }

    document.body.addEventListener('keydown', this._boundKeydownListener, true);
    document.body.addEventListener('keyup', this._boundKeyupListener, true);
  }

  /**
   * @protected
   */
  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }

    document.body.removeEventListener('keydown', this._boundKeydownListener, true);
    document.body.removeEventListener('keyup', this._boundKeyupListener, true);

    // in non-Chrome browsers, blur does not fire on the element when it is disconnected.
    // reproducible in `<vaadin-date-picker>` when closing on `Cancel` or `Today` click.
    if (this.hasAttribute('focused')) {
      this._setFocused(false);
    }
  }


  finishFirstUpdate() {
    this.addEventListener('focusin', e => {
      if (e.composedPath()[0] === this) {
        this._focus(e);
      } else if (e.composedPath().indexOf(this.focusElement) !== -1 && !this.disabled) {
        this._setFocused(true);
      }
    });

    this.addEventListener('focusout', e => this._setFocused(false));

    // This fixes the bug in Firefox 61 (https://bugzilla.mozilla.org/show_bug.cgi?id=1472887)
    // where focusout event does not go out of shady DOM because composed property in the event is not true
    const ensureEventComposed = e => {
      if (!e.composed) {
        e.target.dispatchEvent(new CustomEvent(e.type, {
          bubbles: true,
          composed: true,
          cancelable: false
        }));
      }
    };
    this.shadowRoot.addEventListener('focusin', ensureEventComposed);
    this.shadowRoot.addEventListener('focusout', ensureEventComposed);

    this.addEventListener('keydown', e => {
      if (!e.defaultPrevented && e.shiftKey && e.keyCode === 9) {
        // Flag is checked in _focus event handler.
        this._isShiftTabbing = true;
        HTMLElement.prototype.focus.apply(this);
        this._setFocused(false);
        // Event handling in IE is asynchronous and the flag is removed asynchronously as well
        setTimeout(() => this._isShiftTabbing = false, 0);
      }
    });

    if (this.autofocus && !this.focused && !this.disabled) {
      window.requestAnimationFrame(() => {
        this._focus();
        this._setFocused(true);
        this.setAttribute('focus-ring', '');
      });
    }
  }

  finishUpdate(props) {
    if (props.has('disabled')) {
      this._disabledChanged(this.disabled);
    }
    if (props.has('tabindex')) {
      this._tabindexChanged(this.tabindex);
    }
  }

  _setFocused(focused) {
    if (focused) {
      this.setAttribute('focused', '');
    } else {
      this.removeAttribute('focused');
    }

    // focus-ring is true when the element was focused from the keyboard.
    // Focus Ring [A11ycasts]: https://youtu.be/ilj2P5-5CjI
    if (focused && this._tabPressed) {
      this.setAttribute('focus-ring', '');
    } else {
      this.removeAttribute('focus-ring');
    }
  }

  _bodyKeydownListener(e) {
    this._tabPressed = e.keyCode === 9;
  }

  _bodyKeyupListener() {
    this._tabPressed = false;
  }

  /**
   * Any element extending this mixin is required to implement this getter.
   * It returns the actual focusable element in the component.
   */
  get focusElement() {
    window.console.warn(`Please implement the 'focusElement' property in <${this.localName}>`);
    return this;
  }

  _focus() {
    if (this._isShiftTabbing) {
      return;
    }

    this.focusElement.focus();
    this._setFocused(true);
  }

  /**
   * Moving the focus from the host element causes firing of the blur event what leads to problems in IE.
   * @private
   */
  focus() {
    if (this.disabled) {
      return;
    }

    this.focusElement.focus();
    this._setFocused(true);
  }

  /**
   * Native bluring in the host element does nothing because it does not have the focus.
   * In chrome it works, but not in FF.
   * @private
   */
  blur() {
    this.focusElement.blur();
    this._setFocused(false);
  }

  _disabledChanged(disabled) {
    this.focusElement.disabled = disabled;
    if (disabled) {
      this.blur();
      this._previousTabIndex = this.tabindex;
      this.tabindex = -1;
      this.setAttribute('aria-disabled', 'true');
    } else {
      if (typeof this._previousTabIndex !== 'undefined') {
        this.tabindex = this._previousTabIndex;
      }
      this.removeAttribute('aria-disabled');
    }
  }

  _tabindexChanged(tabindex) {
    if (tabindex !== undefined) {
      this.focusElement.tabIndex = tabindex;
    }

    if (this.disabled && tabindex) {
      // If tabindex attribute was changed while checkbox was disabled
      if (tabindex !== -1) {
        this._previousTabIndex = tabindex;
      }
      this.tabindex = tabindex = undefined;
    }
  }
};
