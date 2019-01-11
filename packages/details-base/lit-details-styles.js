import { css } from 'lit-element';

export default css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  button::-moz-focus-inner {
    border: 0;
  }

  [part='content'] {
    display: none;
    overflow: hidden;
  }

  :host([expanded]) [part='content'] {
    display: block;
    overflow: visible;
  }
`;
