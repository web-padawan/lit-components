import { css } from 'lit-css';

export default css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }
`;
