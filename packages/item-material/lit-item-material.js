import { ItemBase } from '@lit/item-base';
import '@vaadin/vaadin-item/theme/material/vaadin-item-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitItemMaterial extends ItemBase {
  static get is() {
    return 'lit-item-material';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('material-item')}
    `;
  }
}

customElements.define(LitItemMaterial.is, LitItemMaterial);
