import {CheckboxBase} from '@lit/checkbox-base';
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox-styles.js';
import {includeStyle} from '@lit/style-utils';

class LitCheckboxMaterial extends CheckboxBase {
  static get is() {
    return 'lit-checkbox-material';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('material-checkbox')}
    `;
  }
};

customElements.define(LitCheckboxMaterial.is, LitCheckboxMaterial);
