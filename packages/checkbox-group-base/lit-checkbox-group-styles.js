import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/polymer/lib/elements/dom-module.js';
import { inject } from '@lit/style-utils';

inject(html`
<dom-module id="lit-checkbox-group-styles">
  <template>
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
  </template>
</dom-module>
`);
