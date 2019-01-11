import { LitElement, html } from 'lit-element';
import { ItemMixin } from '@lit/item-mixin';
import styles from './lit-tab-styles.js';

export class TabBase extends ItemMixin(LitElement) {
  static get styles() {
    return [styles];
  }

  render() {
    return html`
      <slot></slot>
    `;
  }

  firstUpdated() {
    super.firstUpdated();
    this.setAttribute('role', 'tab');
  }
}
