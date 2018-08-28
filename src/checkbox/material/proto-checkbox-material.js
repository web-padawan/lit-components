import {CheckboxBase} from '../base/proto-checkbox-base.js';
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox-styles.js';
import {includeStyle} from '../../utils/style-utils.js';

class ProtoCheckboxMaterial extends CheckboxBase {
  static get is() {
    return 'proto-checkbox-material';
  }

  static get version() {
    return '0.0.1';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('material-checkbox')}
    `;
  }
};

customElements.define(ProtoCheckboxMaterial.is, ProtoCheckboxMaterial);
