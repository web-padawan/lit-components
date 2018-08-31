import { injectStyle, html } from '@lit/style-utils';

const style = html`
  <style>
    :host {
      display: inline-block;
      position: relative;
      outline: none;
      white-space: nowrap;
    }

    :host([hidden]) {
      display: none !important;
    }

    /* Ensure the button is always aligned on the baseline */
    .vaadin-button-container::before {
      content: "\\2003";
      display: inline-block;
      width: 0;
    }

    .vaadin-button-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: 100%;
      height: 100%;
      min-height: inherit;
      text-shadow: inherit;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }

    [part="prefix"],
    [part="suffix"] {
      flex: none;
    }

    [part="label"] {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    button {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: inherit;
    }
  </style>
`;

injectStyle('lit-button-styles', style);
