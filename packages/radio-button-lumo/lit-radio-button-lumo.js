import { RadioButtonBase } from '@lit/radio-button-base';
import '@vaadin/vaadin-radio-button/theme/lumo/vaadin-radio-button-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitRadioButtonLumo extends RadioButtonBase {
  static get is() {
    return 'lit-radio-button-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('lumo-radio-button')}
    `;
  }
}

customElements.define(LitRadioButtonLumo.is, LitRadioButtonLumo);
