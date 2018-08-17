import {CheckboxStyle} from './proto-checkbox-style.js';
import {CheckboxBase} from './proto-checkbox-base.js';

const elementName = 'proto-checkbox';
class ProtoCheckbox extends CheckboxBase(elementName, CheckboxStyle) {
  static get version() {
    return '0.0.1';
  }
};

customElements.define(elementName, ProtoCheckbox);
