import { CheckboxGroupBase } from '@lit/checkbox-group-base';
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox-group-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitCheckboxGroupMaterial extends CheckboxGroupBase {
  static get is() {
    return 'lit-checkbox-group-material';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [super.styles, getStyleModule('material-checkbox-group')];
  }
}

customElements.define(LitCheckboxGroupMaterial.is, LitCheckboxGroupMaterial);
