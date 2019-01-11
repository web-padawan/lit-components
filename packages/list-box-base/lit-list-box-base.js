import { LitElement, html } from 'lit-element';
import { ListMixin } from '@lit/list-mixin';
import styles from './lit-list-box-styles.js';

export class ListBoxBase extends ListMixin(LitElement) {
  static get styles() {
    return [styles];
  }

  render() {
    return html`
      <div part="items"><slot></slot></div>
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
