import {ProtoCheckbox} from '../proto-checkbox.js';
import {includeStyle} from '../../utils/style-utils.js';
import './proto-checkbox-lumo-styles.js';

class ProtoCheckboxLumo extends ProtoCheckbox {
  static get is() {
    return 'proto-checkbox-lumo';
  }
  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('proto-checkbox-lumo-styles')}
    `;
  }
};

customElements.define(ProtoCheckboxLumo.is, ProtoCheckboxLumo);
