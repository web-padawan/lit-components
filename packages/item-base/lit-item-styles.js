import { injectStyle, html } from '@lit/style-utils';

const style = html`
  <style>
    :host {
      display: inline-block;
    }

    :host([hidden]) {
      display: none !important;
    }
  </style>
`;

injectStyle('lit-item-styles', style);
