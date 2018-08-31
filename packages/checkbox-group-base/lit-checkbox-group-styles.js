import { injectStyle, html } from '@lit/style-utils';

const style = html`
  <style>
    :host {
      display: inline-flex;
    }

    :host::before {
      content: "\\2003";
      width: 0;
      display: inline-block;
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
  </style>
`;

injectStyle('lit-checkbox-group-styles', style);
