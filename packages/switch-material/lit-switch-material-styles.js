import { injectStyle, html } from '@lit/style-utils';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/shadow.js';

const style = html`
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

    [part="thumb"] {
      display: block;
      position: absolute;
      width: 20px;
      height: 20px;
      top: -3px;
      left: -3px;
      border-radius: 50%;
      box-shadow: var(--material-shadow-elevation-2dp);
      background-color: var(--material-background-color);
      transition: transform 0.08s;
    }

    /* ripple effects */
    [part="thumb"]::before,
    [part="thumb"]::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: 0;
      border-radius: 50%;
      transition: all 0.08s;
      z-index: -1;
    }

    :host([focused]) [part="thumb"]::before,
    :host(:hover) [part="thumb"]::before {
      transform: scale(2.4);
      opacity: 0.08;
    }

    :host([active]) [part="thumb"]::after {
      transform: scale(2.4);
      opacity: 0.15;
      transition-duration: 0.2s;
    }

    /* checked state: fill color */
    :host([checked]) [part="track"]::before,
    :host([checked]) [part="thumb"] {
      background-color: var(--material-primary-color);
      border-color: var(--material-primary-color);
    }

    :host([checked]) [part="thumb"] {
      transform: translateX(18px);
    }

    :host([checked]) [part="thumb"]::before,
    :host([checked]) [part="thumb"]::after {
      background-color: inherit;
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
`;

injectStyle('material-switch-styles', style);
