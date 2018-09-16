import { TabBase } from '@lit/tab-base';
import '@vaadin/vaadin-tabs/theme/lumo/vaadin-tab-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitTabLumo extends TabBase {
  static get is() {
    return 'lit-tab-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('lumo-tab')}
    `;
  }
}

customElements.define(LitTabLumo.is, LitTabLumo);
