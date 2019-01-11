import { css } from 'lit-element';

export default css`
  :host {
    display: flex;
  }

  :host([hidden]) {
    display: none !important;
  }
`;
