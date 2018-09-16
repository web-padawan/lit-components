import { TabBase } from '@lit/tab-base';
import '@vaadin/vaadin-tabs/theme/material/vaadin-tab-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitTabMaterial extends TabBase {
  static get is() {
    return 'lit-tab-material';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('material-tab')}
    `;
  }
}

customElements.define(LitTabMaterial.is, LitTabMaterial);
