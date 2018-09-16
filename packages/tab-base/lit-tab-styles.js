import { injectStyle, html } from '@lit/style-utils';

const style = html`
  <style>
    :host {
      display: flex;
    }

    :host([hidden]) {
      display: none !important;
    }
  </style>
`;

injectStyle('lit-tab-styles', style);
