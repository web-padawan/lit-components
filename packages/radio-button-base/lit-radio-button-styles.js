import { css } from 'lit-element';

export default css`
  :host {
    display: inline-block;
    outline: none;
  }

  label {
    display: inline-flex;
    align-items: baseline;
    outline: none;
  }

  [part='radio'] {
    position: relative;
    display: inline-block;
    flex: none;
  }

  input[type='radio'] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: inherit;
    margin: 0;
  }

  :host([disabled]) {
    pointer-events: none;
    -webkit-tap-highlight-color: transparent;
  }
`;
