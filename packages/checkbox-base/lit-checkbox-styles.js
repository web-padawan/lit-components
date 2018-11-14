import { css } from 'lit-css';

export default css`
  :host {
    display: inline-block;
  }

  label {
    display: inline-flex;
    align-items: baseline;
    outline: none;
  }

  [part='checkbox'] {
    position: relative;
    display: inline-block;
    flex: none;
  }

  input[type='checkbox'] {
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
    -webkit-tap-highlight-color: transparent;
  }
`;
