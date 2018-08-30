import {ButtonBase} from '@lit/button-base';
import '@vaadin/vaadin-button/theme/lumo/vaadin-button-styles.js';
import {includeStyle} from '@lit/style-utils';

class LitButtonLumo extends ButtonBase {
  static get is() {
    return 'lit-button-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('lumo-button')}
    `;
  }
};

customElements.define(LitButtonLumo.is, LitButtonLumo);
