import { CheckboxBase } from '@lit/checkbox-base';
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitCheckboxMaterial extends CheckboxBase {
  static get is() {
    return 'lit-checkbox-material';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [...super.styles, getStyleModule('material-checkbox')];
  }
}

customElements.define(LitCheckboxMaterial.is, LitCheckboxMaterial);
