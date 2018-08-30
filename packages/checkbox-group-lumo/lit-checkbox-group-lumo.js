import { CheckboxGroupBase } from '@lit/checkbox-group-base';
import '@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox-group-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitCheckboxGroupLumo extends CheckboxGroupBase {
  static get is() {
    return 'lit-checkbox-group-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('lumo-checkbox-group')}
    `;
  }
}

customElements.define(LitCheckboxGroupLumo.is, LitCheckboxGroupLumo);
