import { ItemBase } from '@lit/item-base';
import '@vaadin/vaadin-item/theme/lumo/vaadin-item-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitItemLumo extends ItemBase {
  static get is() {
    return 'lit-item-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('lumo-item')}
    `;
  }
}

customElements.define(LitItemLumo.is, LitItemLumo);
