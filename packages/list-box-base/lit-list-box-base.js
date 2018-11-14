import { html } from '@polymer/lit-element';
import { css } from 'lit-css';
import { StyledLitElement } from 'styled-lit-element';
import { ListMixin } from '@lit/list-mixin';
import styles from './lit-list-box-styles.js';

export class ListBoxBase extends ListMixin(StyledLitElement) {
  static get style() {
    return css`
      ${styles}
    `;
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
