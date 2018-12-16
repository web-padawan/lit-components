import { html } from '@polymer/lit-element';
import { css } from 'lit-css';
import { StyledLitElement } from 'styled-lit-element';
import { ListMixin } from '@lit/list-mixin';
import styles from './lit-tabs-styles.js';

export class TabsBase extends ListMixin(StyledLitElement) {
  static get style() {
    return css`
      ${styles}
    `;
  }

  constructor() {
    super();

    this.__boundOnResize = this._onResize.bind(this);

    if (!this.hasAttribute('orientation')) {
      this.orientation = 'horizontal';
    }

    if (!this.hasAttribute('selected')) {
      this.selected = 0;
    }
  }

  render() {
    return html`
      <div @click="${this._scrollBack}" part="back-button"></div>
      <div part="tabs"><slot></slot></div>
      <div @click="${this._scrollForward}" part="forward-button"></div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.__boundOnResize);
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    window.removeEventListener('resize', this.__boundOnResize);
  }

  update(props) {
    super.update(props);

    if (props.has('_items') || props.has('orientation')) {
      this._updateOverflow();
    }
  }

  firstUpdated() {
    super.firstUpdated();

    this.setAttribute('role', 'tablist');

    this._scrollerElement.addEventListener('scroll', () => this._updateOverflow());

    this._updateOverflow();
  }

  get _scrollerElement() {
    return this.shadowRoot.querySelector('[part="tabs"]');
  }

  get _scrollOffset() {
    return this._vertical ? this._scrollerElement.offsetHeight : this._scrollerElement.offsetWidth;
  }

  _onResize() {
    this._updateOverflow();
  }

  _scrollForward() {
    this._scroll(this._scrollOffset);
  }

  _scrollBack() {
    this._scroll(-1 * this._scrollOffset);
  }

  _updateOverflow() {
    const scroller = this._scrollerElement;
    const scrollPosition = this._vertical ? scroller.scrollTop : scroller.scrollLeft;
    let scrollSize = this._vertical ? scroller.scrollHeight : scroller.scrollWidth;
    // In Edge we need to adjust the size in 1 pixel
    scrollSize -= 1;

    let overflow = scrollPosition > 0 ? 'start' : '';
    overflow += scrollPosition + this._scrollOffset < scrollSize ? ' end' : '';
    if (overflow) {
      this.setAttribute('overflow', overflow.trim());
    } else {
      this.removeAttribute('overflow');
    }
  }
}
