import {CheckboxBase} from './proto-checkbox-base.js';
import './proto-checkbox-styles.js';

const elementName = 'proto-checkbox';
class ProtoCheckbox extends CheckboxBase(elementName) {
  static get version() {
    return '0.0.1';
  }
};

customElements.define(elementName, ProtoCheckbox);
