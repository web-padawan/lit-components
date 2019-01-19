import { LitElement, html } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map.js';
import { ControlStateMixin } from '@lit/control-state-mixin';
import styles from './lit-details-styles.js';

export class DetailsBase extends ControlStateMixin(LitElement) {
  constructor() {
    super();
    this.expanded = false;
  }

  static get styles() {
    return styles;
  }

  static get properties() {
    return {
      expanded: {
        type: Boolean,
        reflect: true
      },
      summary: {
        type: String
      }
    };
  }

  render() {
    return html`
      <div role="heading">
        <button
          type="button"
          part="header"
          @click="${this._onToggleClick}"
          ?disabled="${this.disabled}"
          aria-expanded="${this.expanded ? 'true' : 'false'}"
        >
          <span part="toggle"></span><span part="summary">${this.summary}</span>
        </button>
      </div>
      <div
        part="content"
        style="${styleMap({ maxHeight: this.expanded ? '' : '0px' })}"
        aria-hidden="${this.expanded ? 'false' : 'true'}"
      >
        <slot></slot>
      </div>
    `;
  }

  get collapsible() {
    return this.shadowRoot.querySelector('[part="content"]');
  }

  get focusElement() {
    return this.shadowRoot.querySelector('button');
  }

  firstUpdated() {
    // prevent Shift + Tab on content from host blur
    this.collapsible.addEventListener('keydown', e => {
      if (e.shiftKey && e.keyCode === 9) {
        e.stopPropagation();
      }
    });

    super.firstUpdated();
  }

  updated(props) {
    super.updated(props);

    if (props.has('expanded')) {
      this.dispatchEvent(
        new CustomEvent('expanded-changed', {
          detail: { value: this.expanded }
        })
      );
    }
  }

  _onToggleClick() {
    this.expanded = !this.expanded;
  }
}
