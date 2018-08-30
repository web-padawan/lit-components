import { CheckboxGroupBase } from '@lit/checkbox-group-base';
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox-group-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitCheckboxGroupMaterial extends CheckboxGroupBase {
  static get is() {
    return 'lit-checkbox-group-material';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('material-checkbox-group')}
    `;
  }
}

customElements.define(LitCheckboxGroupMaterial.is, LitCheckboxGroupMaterial);
