import { RadioGroupBase } from '@lit/radio-group-base';
import '@vaadin/vaadin-radio-button/theme/material/vaadin-radio-group-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitRadioGroupMaterial extends RadioGroupBase {
  static get is() {
    return 'lit-radio-group-material';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [...super.styles, getStyleModule('material-radio-group')];
  }
}

customElements.define(LitRadioGroupMaterial.is, LitRadioGroupMaterial);
