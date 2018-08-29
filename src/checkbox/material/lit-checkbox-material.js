import {CheckboxBase} from '../base/lit-checkbox-base.js';
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox-styles.js';
import {includeStyle} from '../../utils/style-utils.js';

class LitCheckboxMaterial extends CheckboxBase {
  static get is() {
    return 'lit-checkbox-material';
  }

  static get version() {
    return '0.0.1';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('material-checkbox')}
    `;
  }
};

customElements.define(LitCheckboxMaterial.is, LitCheckboxMaterial);
