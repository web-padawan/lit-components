import { css } from 'lit-css';
import { TabBase } from '@lit/tab-base';
import '@vaadin/vaadin-tabs/theme/lumo/vaadin-tab-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitTabLumo extends TabBase {
  static get is() {
    return 'lit-tab-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  static get style() {
    return css`
      ${super.style}
      ${getStyleModule('lumo-tab')}
    `;
  }
}

customElements.define(LitTabLumo.is, LitTabLumo);
