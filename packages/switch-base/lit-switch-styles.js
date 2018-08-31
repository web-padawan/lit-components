import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/polymer/lib/elements/dom-module.js';
import { inject } from '@lit/style-utils';

inject(html`
<dom-module id="lit-switch-styles">
  <template>
    <style>
      :host {
        display: inline-block;
        -webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;
        user-select: none;
        cursor: default;
        outline: none;
      }

      label {
        display: inline-flex;
        align-items: center;
        outline: none;
      }

      :host([label-position="start"]) label {
        flex-direction: row-reverse;
      }

      [part="track"] {
        display: inline-block;
        position: relative;
        flex: none;
        width: 2.75rem;
        height: 1.625rem;
        border-radius: 0.8125rem;
        cursor: pointer;
        background-color: #ddd;
      }

      [part="thumb"] {
        display: inline-block;
        content: "";
        width: calc(1.625rem - 4px);
        height: calc(1.625rem - 4px);
        margin-top: 2px;
        margin-left: 2px;
        position: absolute;
        box-sizing: border-box;
        top: 0;
        left: 0;
        border-radius: calc(calc(1.625rem - 4px) / 2);
        background-color: #fff;
        transition: transform .2s ease-in;
      }

      :host([checked]) [part="track"] {
        background-color: #ccc;
      }

      :host([checked]) [part="thumb"] {
        --translate-x: calc(2.75rem - 1.625rem);
        transform: translateX(var(--translate-x));
        transition: transform .2s ease-in;
      }

      :host([disabled]) {
        pointer-events: none;
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
    </style>
  </template>
</dom-module>
`);
