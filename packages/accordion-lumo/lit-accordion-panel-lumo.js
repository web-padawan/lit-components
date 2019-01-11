import { AccordionPanelBase } from '@lit/accordion-base';
import basicStyles from '@lit/details-lumo/lit-details-lumo-styles.js';
import panelStyles from './lit-accordion-panel-lumo-styles.js';

export class LitAccordionPanelLumo extends AccordionPanelBase {
  static get is() {
    return 'lit-accordion-panel-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [...super.styles, basicStyles, panelStyles];
  }
}

customElements.define(LitAccordionPanelLumo.is, LitAccordionPanelLumo);
