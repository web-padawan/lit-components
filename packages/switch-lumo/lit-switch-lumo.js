import { SwitchBase } from '@lit/switch-base';
import styles from './lit-switch-lumo-styles.js';

class LitSwitchLumo extends SwitchBase {
  static get is() {
    return 'lit-switch-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [...super.styles, styles];
  }
}

customElements.define(LitSwitchLumo.is, LitSwitchLumo);
