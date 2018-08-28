import {ProtoCheckbox} from '../proto-checkbox.js';
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox-styles.js';
import {includeStyle} from '../../utils/style-utils.js';

class ProtoCheckboxMaterial extends ProtoCheckbox {
  static get is() {
    return 'proto-checkbox-material';
  }
  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('material-checkbox')}
    `;
  }
};

customElements.define(ProtoCheckboxMaterial.is, ProtoCheckboxMaterial);
