import { ItemBase } from '@lit/item-base';
import '@vaadin/vaadin-item/theme/lumo/vaadin-item-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitItemLumo extends ItemBase {
  static get is() {
    return 'lit-item-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [super.styles, getStyleModule('lumo-item')];
  }
}

customElements.define(LitItemLumo.is, LitItemLumo);
