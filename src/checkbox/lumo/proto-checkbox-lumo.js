import {ProtoCheckbox} from '../proto-checkbox.js';
import '@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox-styles.js';
import {includeStyle} from '../../utils/style-utils.js';

class ProtoCheckboxLumo extends ProtoCheckbox {
  static get is() {
    return 'proto-checkbox-lumo';
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
