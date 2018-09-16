import { LitElement, html } from '@polymer/lit-element';
import { ItemMixin } from '@lit/item-mixin';
import { includeStyle } from '@lit/style-utils';
import './lit-tab-styles.js';

export class TabBase extends ItemMixin(LitElement) {
  getStyles() {
    return includeStyle('lit-tab-styles');
  }

  render() {
    return html`
      <style>
        ${this.getStyles()}
      </style>
      <slot></slot>
    `;
  }

  firstUpdated() {
    super.firstUpdated();
    this.setAttribute('role', 'tab');
  }
}
