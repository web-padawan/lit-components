import { RadioGroupBase } from '@lit/radio-group-base';
import '@vaadin/vaadin-radio-button/theme/lumo/vaadin-radio-group-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitRadioGroupLumo extends RadioGroupBase {
  static get is() {
    return 'lit-radio-group-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('lumo-radio-group')}
    `;
  }
}

customElements.define(LitRadioGroupLumo.is, LitRadioGroupLumo);
