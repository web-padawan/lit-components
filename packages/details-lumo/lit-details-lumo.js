import { DetailsBase } from '@lit/details-base';
import styles from './lit-details-lumo-styles.js';

export class LitDetailsLumo extends DetailsBase {
  static get is() {
    return 'lit-details-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [...super.styles, styles];
  }
}

customElements.define(LitDetailsLumo.is, LitDetailsLumo);
