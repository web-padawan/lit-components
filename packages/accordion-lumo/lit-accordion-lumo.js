import { css } from 'lit-css';
import { AccordionBase } from '@lit/accordion-base';
import './lit-accordion-panel-lumo.js';

export class LitAccordionLumo extends AccordionBase {
  static get is() {
    return 'lit-accordion-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  static get style() {
    return css`
      ${super.style}
    `;
  }
}

customElements.define(LitAccordionLumo.is, LitAccordionLumo);
