import { injectStyle, html } from '@lit/style-utils';

const style = html`
  <style>
    :host {
      display: inline-flex;
    }

    :host::before {
      display: inline-block;
      content: "\\2003";
      width: 0;
    }

    :host([hidden]) {
      display: none !important;
    }

    .vaadin-group-field-container {
      display: flex;
      flex-direction: column;
    }

    [part="label"]:empty {
      display: none;
    }

    :host(:not([invalid])) [part="error-message"] {
      max-height: 0;
      overflow: hidden;
    }
  </style>
`;

injectStyle('lit-radio-group-styles', style);
