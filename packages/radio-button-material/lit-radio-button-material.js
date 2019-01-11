import { RadioButtonBase } from '@lit/radio-button-base';
import '@vaadin/vaadin-radio-button/theme/material/vaadin-radio-button-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitRadioButtonMaterial extends RadioButtonBase {
  static get is() {
    return 'lit-radio-button-material';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [...super.styles, getStyleModule('material-radio-button')];
  }
}

customElements.define(LitRadioButtonMaterial.is, LitRadioButtonMaterial);
