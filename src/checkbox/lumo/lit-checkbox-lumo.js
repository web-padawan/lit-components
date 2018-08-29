import {CheckboxBase} from '../base/lit-checkbox-base.js';
import '@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox-styles.js';
import {includeStyle} from '../../utils/style-utils.js';

class LitCheckboxLumo extends CheckboxBase {
  static get is() {
    return 'lit-checkbox-lumo';
  }

  static get version() {
    return '0.0.1';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('lumo-checkbox-style')}
      ${includeStyle('lumo-checkbox-effects')}
      ${includeStyle('lumo-checkbox')}
    `;
  }
};

customElements.define(LitCheckboxLumo.is, LitCheckboxLumo);
