import { css } from 'lit-css';
import { ButtonBase } from '@lit/button-base';
import '@vaadin/vaadin-button/theme/material/vaadin-button-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitButtonMaterial extends ButtonBase {
  static get is() {
    return 'lit-button-material';
  }

  static get version() {
    return '0.1.0';
  }

  static get style() {
    return css`
      ${super.style}
      ${getStyleModule('material-button')}
    `;
  }
}

customElements.define(LitButtonMaterial.is, LitButtonMaterial);
