import { css } from 'lit-css';
import { DetailsBase } from '@lit/details-base';

export class AccordionPanelBase extends DetailsBase {
  static get style() {
    return css`
      ${super.style}
    `;
  }
}
