import { DetailsBase } from '@lit/details-base';
import styles from './lit-details-material-styles.js';

export class LitDetailsMaterial extends DetailsBase {
  static get is() {
    return 'lit-details-material';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [...super.styles, styles];
  }
}

customElements.define(LitDetailsMaterial.is, LitDetailsMaterial);
