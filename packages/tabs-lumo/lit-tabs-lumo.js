import { TabsBase } from '@lit/tabs-base';
import '@vaadin/vaadin-tabs/theme/lumo/vaadin-tabs-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitTabsLumo extends TabsBase {
  static get is() {
    return 'lit-tabs-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('lumo-tabs')}
    `;
  }
}

customElements.define(LitTabsLumo.is, LitTabsLumo);
