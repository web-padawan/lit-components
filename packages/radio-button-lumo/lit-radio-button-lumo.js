import { css } from 'lit-css';
import { RadioButtonBase } from '@lit/radio-button-base';
import '@vaadin/vaadin-radio-button/theme/lumo/vaadin-radio-button-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitRadioButtonLumo extends RadioButtonBase {
  static get is() {
    return 'lit-radio-button-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  static get style() {
    return css`
      ${super.style}
      ${getStyleModule('lumo-radio-button')}
    `;
  }
}

customElements.define(LitRadioButtonLumo.is, LitRadioButtonLumo);
