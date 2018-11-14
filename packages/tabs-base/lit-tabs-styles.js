import { css } from 'lit-css';

export default css`
  :host {
    display: flex;
    align-items: center;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([orientation='vertical']) {
    display: block;
  }

  :host([orientation='horizontal']) [part='tabs'] {
    flex-grow: 1;
    display: flex;
    align-self: stretch;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
  }

  @-moz-document url-prefix() {
    :host([orientation='horizontal']) [part='tabs'] {
      overflow: hidden;
    }
  }

  :host([orientation='horizontal']) [part='tabs']::-webkit-scrollbar {
    display: none;
  }

  :host([orientation='vertical']) [part='tabs'] {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  [part='back-button'],
  [part='forward-button'] {
    pointer-events: none;
    opacity: 0;
    cursor: default;
  }

  :host([overflow~='start']) [part='back-button'],
  :host([overflow~='end']) [part='forward-button'] {
    pointer-events: auto;
    opacity: 1;
  }

  [part='back-button']::after {
    content: '◀';
  }

  [part='forward-button']::after {
    content: '▶';
  }

  :host([orientation='vertical']) [part='back-button'],
  :host([orientation='vertical']) [part='forward-button'] {
    display: none;
  }
`;
