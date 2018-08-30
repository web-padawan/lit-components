import { ButtonBase } from '@lit/button-base';
import '@vaadin/vaadin-button/theme/material/vaadin-button-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitButtonMaterial extends ButtonBase {
  static get is() {
    return 'lit-button-material';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('material-button')}
    `;
  }
}

customElements.define(LitButtonMaterial.is, LitButtonMaterial);
