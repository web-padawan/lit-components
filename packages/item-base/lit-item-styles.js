import { css } from 'lit-element';

export default css`
  :host {
    display: inline-block;
  }

  :host([hidden]) {
    display: none !important;
  }
`;
