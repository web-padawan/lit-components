import { SwitchBase } from '@lit/switch-base';
import { includeStyle } from '@lit/style-utils';
import './lit-switch-material-styles.js';

class LitSwitchLumo extends SwitchBase {
  static get is() {
    return 'lit-switch-material';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('material-switch-styles')}
    `;
  }
}

customElements.define(LitSwitchLumo.is, LitSwitchLumo);
