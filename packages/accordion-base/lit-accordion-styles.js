import { css } from 'lit-element';

export default css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }
`;
