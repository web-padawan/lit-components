import { RadioGroupBase } from '@lit/radio-group-base';
import '@vaadin/vaadin-radio-button/theme/lumo/vaadin-radio-group-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitRadioGroupLumo extends RadioGroupBase {
  static get is() {
    return 'lit-radio-group-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [...super.styles, getStyleModule('lumo-radio-group')];
  }
}

customElements.define(LitRadioGroupLumo.is, LitRadioGroupLumo);
