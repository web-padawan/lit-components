import { css } from 'lit-css';
import { AccordionBase } from '@lit/accordion-base';
import './lit-accordion-panel-material.js';

export class LitAccordionMaterial extends AccordionBase {
  static get is() {
    return 'lit-accordion-material';
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

customElements.define(LitAccordionMaterial.is, LitAccordionMaterial);
