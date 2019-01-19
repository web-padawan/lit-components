import { ItemBase } from '@lit/item-base';
import '@vaadin/vaadin-item/theme/material/vaadin-item-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitItemMaterial extends ItemBase {
  static get is() {
    return 'lit-item-material';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [super.styles, getStyleModule('material-item')];
  }
}

customElements.define(LitItemMaterial.is, LitItemMaterial);
