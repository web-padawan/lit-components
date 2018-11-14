import { css } from 'lit-css';
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

  static get style() {
    return css`
      ${super.style}
      ${getStyleModule('material-checkbox-group')}
    `;
  }
}

customElements.define(LitCheckboxGroupMaterial.is, LitCheckboxGroupMaterial);
