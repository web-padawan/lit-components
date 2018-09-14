import { LitElement, html } from '@polymer/lit-element';
import { ListMixin } from '@lit/list-mixin';
import { includeStyle } from '@lit/style-utils';
import './lit-list-box-styles.js';

export class ListBoxBase extends ListMixin(LitElement) {
  getStyles() {
    return includeStyle('lit-list-box-styles');
  }

  render() {
    return html`
      <style>
        ${this.getStyles()}
      </style>
      <div part="items">
        <slot></slot>
      </div>
    `;
  }

  firstUpdated() {
    super.firstUpdated();
    this.setAttribute('role', 'list');
  }

  get _scrollerElement() {
    return this.shadowRoot.querySelector('[part="items"]');
  }
}
