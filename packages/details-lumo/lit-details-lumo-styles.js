import { css } from 'lit-css';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';

export default css`
  /* stylelint-disable font-family-no-missing-generic-family-keyword */
  :host {
    font-family: var(--lumo-font-family);
    outline: none;
  }

  [part='header'] {
    width: 100%;
    outline: none;
    position: relative;
    text-align: left;
    border: none;
    box-shadow: none;
    height: var(--lumo-size-m);
    padding: 0;
    box-sizing: border-box;
    font-size: var(--lumo-font-size-m);
    font-weight: 500;
    color: var(--lumo-secondary-text-color);
    background-color: var(--lumo-contrast-5pct);
    border-radius: var(--lumo-border-radius);
    cursor: default;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :host([focus-ring]) [part='header'] {
    box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
  }

  :host([disabled]) [part='header'] {
    color: var(--lumo-disabled-text-color);
  }

  [part='summary'] {
    padding-left: var(--lumo-size-m);
  }

  [part='toggle'] {
    position: absolute;
    top: 50%;
    font-size: 1.5em;
    line-height: 1;
    width: 1em;
    height: 1em;
    text-align: center;
    color: var(--lumo-contrast-50pct);
    padding: calc(1em / 4);
    transform: translateY(-50%);
  }

  @media (hover: hover) {
    :host(:hover) [part='toggle'] {
      color: var(--lumo-contrast-80pct);
    }
  }

  [part='toggle']::before {
    font-family: 'lumo-icons';
    display: inline-block;
    height: 100%;
  }

  :host(:not([expanded])) [part='toggle']::before {
    content: var(--lumo-icons-angle-right);
  }

  :host([expanded]) [part='toggle']::before {
    content: var(--lumo-icons-angle-right);
    transform: rotate(90deg);
  }

  [part='content'] {
    padding: calc(var(--lumo-size-m) / 3);
  }
`;
