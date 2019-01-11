import { CheckboxBase } from '@lit/checkbox-base';
import '@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitCheckboxLumo extends CheckboxBase {
  static get is() {
    return 'lit-checkbox-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [
      ...super.styles,
      getStyleModule('lumo-checkbox-style'),
      getStyleModule('lumo-checkbox-effects'),
      getStyleModule('lumo-checkbox')
    ];
  }
}

customElements.define(LitCheckboxLumo.is, LitCheckboxLumo);
