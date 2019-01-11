import { LitElement, html } from 'lit-element';
import styles from './lit-progress-bar-styles.js';

export class ProgressBarBase extends LitElement {
  static get styles() {
    return [styles];
  }

  constructor() {
    super();
    if (!this.hasAttribute('indeterminate')) {
      this.indeterminate = false;
    }
    if (!this.hasAttribute('min')) {
      this.min = 0;
    }
    if (!this.hasAttribute('max')) {
      this.max = 1;
    }
  }

  static get properties() {
    return {
      /**
       * Current progress value.
       */
      value: {
        type: Number
      },

      /**
       * Minimum bound of the progress bar.
       */
      min: {
        type: Number
      },

      /**
       * Maximum bound of the progress bar.
       */
      max: {
        type: Number
      },

      /**
       * Indeterminate state of the progress bar.
       * This property takes precedence over other state properties (min, max, value).
       */
      indeterminate: {
        type: Boolean,
        reflect: true
      }
    };
  }

  render() {
    return html`
      <div part="bar"><div part="value"></div></div>
    `;
  }

  firstUpdated() {
    this.setAttribute('role', 'progressbar');
  }

  updated(props) {
    super.updated(props);

    const minChanged = props.has('min');
    if (minChanged) {
      this._minChanged(this.min);
    }

    const maxChanged = props.has('max');
    if (maxChanged) {
      this._maxChanged(this.max);
    }

    const valueChanged = props.has('value');
    if (valueChanged) {
      this._valueChanged(this.value);
    }

    if (valueChanged || minChanged || maxChanged) {
      this._normalizedValueChanged(this.value, this.min, this.max);
    }
  }

  _normalizedValueChanged(value, min, max) {
    const newValue = this.constructor._normalizeValue(value, min, max);
    const prop = '--vaadin-progress-value';

    if (window.ShadyCSS && window.ShadyCSS.nativeCss === false) {
      const props = {};
      props[prop] = String(newValue);
      window.ShadyCSS.styleSubtree(this, props);
    } else {
      this.style.setProperty(prop, newValue);
    }
  }

  _valueChanged(value) {
    this.setAttribute('aria-valuenow', value);
  }

  _minChanged(value) {
    this.setAttribute('aria-valuemin', value);
  }

  _maxChanged(value) {
    this.setAttribute('aria-valuemax', value);
  }

  /**
   * Percent of current progress relative to whole progress bar (max - min)
   */
  static _normalizeValue(value, min, max) {
    let nV;

    if (!value && value !== 0) {
      nV = 0;
    } else if (min >= max) {
      nV = 1;
    } else {
      nV = (value - min) / (max - min);

      nV = Math.min(Math.max(nV, 0), 1);
    }

    return nV;
  }
}
