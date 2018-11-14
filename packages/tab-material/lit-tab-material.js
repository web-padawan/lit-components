import { css } from 'lit-css';
import { TabBase } from '@lit/tab-base';
import '@vaadin/vaadin-tabs/theme/material/vaadin-tab-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitTabMaterial extends TabBase {
  static get is() {
    return 'lit-tab-material';
  }

  static get version() {
    return '0.1.0';
  }

  static get style() {
    return css`
      ${super.style}
      ${getStyleModule('material-tab')}
    `;
  }
}

customElements.define(LitTabMaterial.is, LitTabMaterial);
