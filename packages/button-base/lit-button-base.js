import { html, LitElement } from '@polymer/lit-element';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { addListener } from '@polymer/polymer/lib/utils/gestures.js';
import { ControlStateMixin } from '@lit/control-state-mixin';
import { includeStyle } from '@lit/style-utils';
import './lit-button-styles.js';

export class ButtonBase extends ControlStateMixin(GestureEventListeners(LitElement)) {
  getStyles() {
    return includeStyle('lit-button-styles');
  }

  render() {
    return html`
      <style>
        ${this.getStyles()}
      </style>
      <div class="vaadin-button-container">
        <div part="prefix">
          <slot name="prefix"></slot>
        </div>
        <div part="label">
          <slot></slot>
        </div>
        <div part="suffix">
          <slot name="suffix"></slot>
        </div>
      </div>
      <button type="button" role="presentation"></button>
    `;
  }

  firstUpdated() {
    super.firstUpdated();

    // Leaving default role in the native button, makes navigation announcement
    // being different when using focus navigation (tab) versus using normal
    // navigation (arrows). The first way announces the label on a button
    // since the focus is moved programmatically, and the second on a group.
    this.setAttribute('role', 'button');

    this._addActiveListeners();
  }

  /**
   * @protected
   */
  disconnectedCallback() {
    super.disconnectedCallback();

    // `active` state is preserved when the element is disconnected between keydown and keyup events.
    // reproducible in `<vaadin-date-picker>` when closing on `Cancel` or `Today` click.
    if (this.hasAttribute('active')) {
      this.removeAttribute('active');
    }
  }

  _addActiveListeners() {
    addListener(this, 'down', () => !this.disabled && this.setAttribute('active', ''));
    addListener(this, 'up', () => this.removeAttribute('active'));
    this.addEventListener(
      'keydown',
      e => !this.disabled && [13, 32].indexOf(e.keyCode) >= 0 && this.setAttribute('active', '')
    );
    this.addEventListener('keyup', () => this.removeAttribute('active'));
    this.addEventListener('blur', () => this.removeAttribute('active'));
  }

  /**
   * @protected
   */
  get focusElement() {
    return this.shadowRoot.querySelector('button');
  }
}
