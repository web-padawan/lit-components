import { RadioButtonBase } from '@lit/radio-button-base';
import '@vaadin/vaadin-radio-button/theme/material/vaadin-radio-button-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitRadioButtonMaterial extends RadioButtonBase {
  static get is() {
    return 'lit-radio-button-material';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('material-radio-button')}
    `;
  }
}

customElements.define(LitRadioButtonMaterial.is, LitRadioButtonMaterial);
