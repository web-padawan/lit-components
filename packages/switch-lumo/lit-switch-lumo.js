import { SwitchBase } from '@lit/switch-base';
import { includeStyle } from '@lit/style-utils';
import './lit-switch-lumo-styles.js';

class LitSwitchLumo extends SwitchBase {
  static get is() {
    return 'lit-switch-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('lumo-switch-styles')}
    `;
  }
}

customElements.define(LitSwitchLumo.is, LitSwitchLumo);
