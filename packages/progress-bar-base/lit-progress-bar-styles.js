import { injectStyle, html } from '@lit/style-utils';

const style = html`
  <style>
    :host {
      display: block;
      width: 100%; /* prevent collapsing inside non-stretching column flex */
      height: 8px;
    }

    :host([hidden]) {
      display: none !important;
    }

    [part="bar"] {
      height: 100%;
    }

    [part="value"] {
      height: 100%;
      transform-origin: 0 50%;
      transform: scaleX(var(--vaadin-progress-value));
    }
  </style>
`;

injectStyle('lit-progress-bar-styles', style);
