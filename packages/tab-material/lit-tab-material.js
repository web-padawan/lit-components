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

  static get styles() {
    return [...super.styles, getStyleModule('material-tab')];
  }
}

customElements.define(LitTabMaterial.is, LitTabMaterial);
