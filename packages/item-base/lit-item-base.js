import { LitElement, html } from '@polymer/lit-element';
import { ItemMixin } from '@lit/item-mixin';
import { includeStyle } from '@lit/style-utils';
import './lit-item-styles.js';

export class ItemBase extends ItemMixin(LitElement) {
  getStyles() {
    return includeStyle('lit-item-styles');
  }

  render() {
    return html`
      <style>
        ${this.getStyles()}
      </style>
      <div part="content">
        <slot></slot>
      </div>
    `;
  }
}
