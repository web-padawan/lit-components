import { injectStyle, html } from '@lit/style-utils';

const style = html`
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
      width: 1.625rem;
      height: 1.625rem;
      position: absolute;
      box-sizing: border-box;
      top: 0;
      left: 0;
      border-radius: 0.8125rem;
      background-color: #fff;
      transition: transform .2s ease-in;
    }

    :host([checked]) [part="track"] {
      background-color: #ccc;
    }

    :host([checked]) [part="thumb"] {
      transform: translateX(1.125rem);
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
`;

injectStyle('lit-switch-styles', style);
