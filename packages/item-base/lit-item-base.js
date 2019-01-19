import { LitElement, html } from 'lit-element';
import { ItemMixin } from '@lit/item-mixin';
import styles from './lit-item-styles.js';

export class ItemBase extends ItemMixin(LitElement) {
  static get styles() {
    return styles;
  }

  render() {
    return html`
      <div part="content"><slot></slot></div>
    `;
  }
}
