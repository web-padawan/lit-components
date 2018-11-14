import { css } from 'lit-css';

export default css`
  :host {
    display: inline-block;
  }

  :host([hidden]) {
    display: none !important;
  }
`;
