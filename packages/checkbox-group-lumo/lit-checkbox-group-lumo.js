import { CheckboxGroupBase } from '@lit/checkbox-group-base';
import '@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox-group-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitCheckboxGroupLumo extends CheckboxGroupBase {
  static get is() {
    return 'lit-checkbox-group-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [super.styles, getStyleModule('lumo-checkbox-group')];
  }
}

customElements.define(LitCheckboxGroupLumo.is, LitCheckboxGroupLumo);
