import { ListBoxBase } from '@lit/list-box-base';
import '@vaadin/vaadin-list-box/theme/lumo/vaadin-list-box-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitListBoxLumo extends ListBoxBase {
  static get is() {
    return 'lit-list-box-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('lumo-list-box').replace(/vaadin-item/g, 'lit-item-lumo')}
    `;
  }
}

customElements.define(LitListBoxLumo.is, LitListBoxLumo);
