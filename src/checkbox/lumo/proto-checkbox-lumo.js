import {CheckboxBase} from '../base/proto-checkbox-base.js';
import '@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox-styles.js';
import {includeStyle} from '../../utils/style-utils.js';

class ProtoCheckboxLumo extends CheckboxBase {
  static get is() {
    return 'proto-checkbox-lumo';
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

customElements.define(ProtoCheckboxLumo.is, ProtoCheckboxLumo);
