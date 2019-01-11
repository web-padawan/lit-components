import { TabsBase } from '@lit/tabs-base';
import '@vaadin/vaadin-tabs/theme/lumo/vaadin-tabs-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitTabsLumo extends TabsBase {
  static get is() {
    return 'lit-tabs-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [...super.styles, getStyleModule('lumo-tabs')];
  }
}

customElements.define(LitTabsLumo.is, LitTabsLumo);
