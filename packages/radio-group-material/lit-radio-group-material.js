import { RadioGroupBase } from '@lit/radio-group-base';
import '@vaadin/vaadin-radio-button/theme/material/vaadin-radio-group-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitRadioGroupMaterial extends RadioGroupBase {
  static get is() {
    return 'lit-radio-group-material';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('material-radio-group')}
    `;
  }
}

customElements.define(LitRadioGroupMaterial.is, LitRadioGroupMaterial);
