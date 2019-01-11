import { AccordionBase } from '@lit/accordion-base';
import './lit-accordion-panel-lumo.js';

export class LitAccordionLumo extends AccordionBase {
  static get is() {
    return 'lit-accordion-lumo';
  }

  static get version() {
    return '0.1.0';
  }
}

customElements.define(LitAccordionLumo.is, LitAccordionLumo);
