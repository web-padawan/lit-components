import { injectStyle, html } from '@lit/style-utils';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';

const style = html`
  <style>
    [part="track"] {
      width: var(--lumo-size-l);
      height: var(--lumo-size-xs);
      border-radius: calc(var(--lumo-size-xs) / 2);
      background-color: var(--lumo-contrast-40pct);
    }

    [part="thumb"] {
      width: calc(var(--lumo-size-xs) - 4px);
      height: calc(var(--lumo-size-xs) - 4px);
      margin-top: 2px;
      margin-left: 2px;
      border-radius: calc(calc(var(--lumo-size-xs) - 4px) / 2);
      background-color: var(--lumo-base-color);
    }

    :host([checked]) [part="track"] {
      background-color: var(--lumo-primary-color);
    }

    :host([checked]) [part="thumb"] {
      --translate-x: calc(var(--lumo-size-l) - var(--lumo-size-xs));
      transform: translateX(var(--translate-x));
    }

    :host([checked][disabled]) [part="track"] {
      background-color: var(--lumo-primary-color);
      opacity: 0.3;
    }

    [part="label"]:not([empty]) {
      margin: 0.1875em 0.875em 0.1875em 0.375em;
    }

    :host([focus-ring]) [part="track"] {
      box-shadow: 0 0 0 3px var(--lumo-primary-color-50pct);
    }

    :host([disabled]) {
      color: var(--lumo-disabled-text-color);
    }

    :host([disabled]) [part="label"] ::slotted(*) {
      color: inherit;
    }
  </style>
`;

injectStyle('lumo-switch-styles', style);
