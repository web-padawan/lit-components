import { TabsBase } from '@lit/tabs-base';
import '@vaadin/vaadin-tabs/theme/material/vaadin-tabs-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitTabsMaterial extends TabsBase {
  static get is() {
    return 'lit-tabs-material';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('material-tabs')}
    `;
  }
}

customElements.define(LitTabsMaterial.is, LitTabsMaterial);
