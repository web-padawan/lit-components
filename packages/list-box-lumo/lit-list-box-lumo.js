import { ListBoxBase } from '@lit/list-box-base';
import '@vaadin/vaadin-list-box/theme/lumo/vaadin-list-box-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitListBoxLumo extends ListBoxBase {
  static get is() {
    return 'lit-list-box-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [
      ...super.styles,
      getStyleModule('lumo-list-box', css => css.replace(/vaadin-item/g, 'lit-item-lumo'))
    ];
  }
}

customElements.define(LitListBoxLumo.is, LitListBoxLumo);
