import { CheckboxBase } from '@lit/checkbox-base';
import '@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitCheckboxLumo extends CheckboxBase {
  static get is() {
    return 'lit-checkbox-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('lumo-checkbox-style')}
      ${includeStyle('lumo-checkbox-effects')}
      ${includeStyle('lumo-checkbox')}
    `;
  }
}

customElements.define(LitCheckboxLumo.is, LitCheckboxLumo);
