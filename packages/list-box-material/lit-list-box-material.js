import { ListBoxBase } from '@lit/list-box-base';
import '@vaadin/vaadin-list-box/theme/material/vaadin-list-box-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitListBoxMaterial extends ListBoxBase {
  static get is() {
    return 'lit-list-box-material';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [
      ...super.styles,
      getStyleModule('material-list-box', css => css.replace(/vaadin-item/g, 'lit-item-material'))
    ];
  }
}

customElements.define(LitListBoxMaterial.is, LitListBoxMaterial);
