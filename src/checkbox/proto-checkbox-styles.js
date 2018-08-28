import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/polymer/lib/elements/dom-module.js'
import {inject} from '../utils/style-utils.js';

inject(html`
<dom-module id="proto-checkbox-styles">
  <template>
    <style>
      :host {
        display: inline-block;
      }
      label {
        display: inline-flex;
        align-items: baseline;
        outline: none;
      }
      [part="checkbox"] {
        position: relative;
        display: inline-block;
        flex: none;
      }
      input[type="checkbox"] {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: inherit;
        margin: 0;
      }
      :host([disabled]) {
        -webkit-tap-highlight-color: transparent;
      }
    </style>
  </template>
</dom-module>
`);
