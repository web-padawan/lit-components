import { html } from '@polymer/lit-element';
import { css } from 'lit-css';
import { StyledLitElement } from 'styled-lit-element';
import { ItemMixin } from '@lit/item-mixin';
import styles from './lit-item-styles.js';

export class ItemBase extends ItemMixin(StyledLitElement) {
  static get style() {
    return css`
      ${styles}
    `;
  }

  render() {
    return html`
      <div part="content"><slot></slot></div>
    `;
  }
}
