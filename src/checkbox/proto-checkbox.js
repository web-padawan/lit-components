import {CheckboxBase} from './proto-checkbox-base.js';
import {includeStyle} from '../utils/style-utils.js';
import './proto-checkbox-styles.js';
export class ProtoCheckbox extends CheckboxBase {
  static get version() {
    return '0.0.1';
  }
  static get is() {
    return 'proto-checkbox';
  }
  getStyles() {
    return includeStyle('proto-checkbox-styles');
  }
};

customElements.define(ProtoCheckbox.is, ProtoCheckbox);
