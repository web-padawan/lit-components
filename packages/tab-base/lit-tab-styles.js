import { css } from 'lit-css';

export default css`
  :host {
    display: flex;
  }

  :host([hidden]) {
    display: none !important;
  }
`;
