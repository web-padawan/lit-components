import { html } from '@polymer/lit-element';
import { css } from 'lit-css';
import { StyledLitElement } from 'styled-lit-element';
import { ItemMixin } from '@lit/item-mixin';
import styles from './lit-tab-styles.js';

export class TabBase extends ItemMixin(StyledLitElement) {
  static get style() {
    return css`
      ${styles}
    `;
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
