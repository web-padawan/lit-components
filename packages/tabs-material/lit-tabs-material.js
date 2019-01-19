import { TabsBase } from '@lit/tabs-base';
import '@vaadin/vaadin-tabs/theme/material/vaadin-tabs-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitTabsMaterial extends TabsBase {
  static get is() {
    return 'lit-tabs-material';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [super.styles, getStyleModule('material-tabs')];
  }
}

customElements.define(LitTabsMaterial.is, LitTabsMaterial);
