import { injectStyle, html } from '@lit/style-utils';

const style = html`
  <style>
    :host {
      display: flex;
    }

    :host([hidden]) {
      display: none !important;
    }

    [part="items"] {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
  </style>
`;

injectStyle('lit-list-box-styles', style);
