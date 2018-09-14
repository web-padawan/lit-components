import { ListBoxBase } from '@lit/list-box-base';
import '@vaadin/vaadin-list-box/theme/material/vaadin-list-box-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitListBoxMaterial extends ListBoxBase {
  static get is() {
    return 'lit-list-box-material';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('material-list-box').replace(/vaadin-item/g, 'lit-item-material')}
    `;
  }
}

customElements.define(LitListBoxMaterial.is, LitListBoxMaterial);
