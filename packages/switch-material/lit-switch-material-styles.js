import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/polymer/lib/elements/dom-module.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/shadow.js';
import { inject } from '@lit/style-utils';

inject(html`
<dom-module id="material-switch-styles">
  <template>
    <style>
      /* track container */
      [part="track"] {
        width: 32px;
        height: 14px;
        border-radius: 7px;
      }

      /* track background */
      [part="track"]::before {
        display: block;
        content: '';
        box-sizing: border-box;
        position: absolute;
        width: 100%;
        height: 100%;
        border: 1px solid;
        border-radius: 7px;
        background-color: #000;
        border-color: #000;
        opacity: 0.38;
      }

      :host([checked]) [part="track"]::before {
        opacity: 0.54;
      }

      /* ripple container */
      [part="thumb-underlay"] {
        display: block;
        position: relative;
        width: 20px;
        height: 20px;
        top: -3px;
        left: -3px;
        border-radius: 50%;
        transition: transform 0s 0.8s;
        will-change: transform;
      }

      [part="thumb"] {
        width: 100%;
        height: 100%;
        margin: 0;
        border-radius: 50%;
        box-shadow: var(--material-shadow-elevation-2dp);
        position: absolute;
        border: 10px solid;
        background-color: var(--material-background-color);
        border-color: var(--material-background-color);
        z-index: 1;
      }

      /* ripple */
      [part="thumb-underlay"]::before {
        display: block;
        content: '';
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        border: 10px solid;
        border-radius: 50%;
        background-color: var(--material-disabled-text-color);
        transform: scale(1);
        opacity: 0;
        transition: transform 0s 0.8s, opacity 0.8s;
        will-change: transform, opacity;
      }

      :host([focused]) [part="thumb-underlay"],
      :host([active]) [part="thumb-underlay"],
      :host(:hover) [part="thumb-underlay"] {
        transition-duration: 0.08s, 0.01s;
        transition-delay: 0s, 0s;
      }

      :host([focused]) [part="thumb-underlay"]::before,
      :host([active]) [part="thumb-underlay"]::before,
      :host(:hover) [part="thumb-underlay"]::before {
        transition-duration: 0.08s, 0.01s;
        transition-delay: 0s, 0s;
        transform: scale(2.4);
        opacity: 0.08;
      }

      :host([active]) [part="thumb-underlay"]::before {
        opacity: 0.15;
      }

      /* checked state: fill color */
      :host([checked]) [part="track"]::before,
      :host([checked]) [part="thumb-underlay"]::before,
      :host([checked]) [part="thumb"] {
        background-color: var(--material-primary-color);
        border-color: var(--material-primary-color);
      }

      :host([checked]) [part="thumb-underlay"] {
        transform: translateX(18px);
      }

      :host([checked]) [part="thumb"] {
        transform: none;
      }

      [part="label"]:not([empty]) {
        margin: 0 0 0 10px;
      }

      :host([label-position="start"]) [part="label"]:not([empty]) {
        margin: 0 10px 0 0;
      }

      :host([disabled]) {
        opacity: 0.38;
        pointer-events: none;
      }
    </style>
  </template>
</dom-module>
`);
