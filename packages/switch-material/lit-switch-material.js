import { css } from 'lit-css';
import { SwitchBase } from '@lit/switch-base';
import styles from './lit-switch-material-styles.js';

class LitSwitchLumo extends SwitchBase {
  static get is() {
    return 'lit-switch-material';
  }

  static get version() {
    return '0.1.0';
  }

  static get style() {
    return css`
      ${super.style}
      ${styles}
    `;
  }
}

customElements.define(LitSwitchLumo.is, LitSwitchLumo);
