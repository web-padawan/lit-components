import { LitElement, html } from 'lit-element';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { AccordionPanelBase } from './lit-accordion-panel-base.js';
import styles from './lit-accordion-styles.js';

function filterItems(arr) {
  return arr.filter(el => el instanceof AccordionPanelBase);
}

export class AccordionBase extends LitElement {
  constructor() {
    super();
    this.expanded = 0;
  }

  static get styles() {
    return [styles];
  }

  static get properties() {
    return {
      /**
       * The index of the item expanded in the items array
       */
      expanded: {
        type: Number,
        reflect: true
      },

      _items: {
        type: Array,
        hasChanged: () => true
      }
    };
  }

  render() {
    return html`
      <slot></slot>
    `;
  }

  get focused() {
    return this.getRootNode().activeElement;
  }

  get items() {
    return this._items;
  }

  update(props) {
    if (props.has('_items') || props.has('expanded')) {
      if (this.items) {
        const itemToExpand = this.items[this.expanded];
        this.items.forEach(item => {
          item.expanded = item === itemToExpand;
        });
      }
    }

    super.update(props);
  }

  firstUpdated() {
    super.firstUpdated();

    this.addEventListener('keydown', e => this._onKeydown(e));

    this._boundUpdateExpanded = this._updateExpanded.bind(this);

    this._observer = new FlattenedNodesObserver(this, info => {
      this._items = filterItems(Array.from(this.children));

      filterItems(info.addedNodes).forEach(el => {
        el.addEventListener('expanded-changed', this._boundUpdateExpanded);
      });
    });
  }

  focus() {
    // In initialization (e.g vaadin-dropdown-menu) observer might not been run yet.
    if (this._observer) {
      this._observer.flush();
    }
    const focusable = Array.isArray(this.items) && this.items[0];
    if (focusable) {
      focusable.focus();
    }
  }

  _onKeydown(event) {
    // only check keyboard events on details toggle buttons
    const item = event.composedPath()[0];
    if (!this.items.some(el => el.focusElement === item)) {
      return;
    }

    // IE names for arrows do not include the Arrow prefix
    const key = event.key.replace(/^Arrow/, '');

    const currentIdx = this.items.indexOf(this.focused);
    let idx;
    let increment;

    switch (key) {
      case 'Up':
        increment = -1;
        idx = currentIdx - 1;
        break;
      case 'Down':
        increment = 1;
        idx = currentIdx + 1;
        break;
      case 'Home':
        increment = 1;
        idx = 0;
        break;
      case 'End':
        increment = -1;
        idx = this.items.length - 1;
        break;
      default:
      // do nothing.
    }

    idx = this._getAvailableIndex(idx, increment);
    if (idx >= 0) {
      this.items[idx].focus();
      event.preventDefault();
    }
  }

  _getAvailableIndex(index, increment) {
    const totalItems = this.items.length;
    let idx = index;
    for (let i = 0; typeof idx === 'number' && i < totalItems; i++, idx += increment || 1) {
      if (idx < 0) {
        idx = totalItems - 1;
      } else if (idx >= totalItems) {
        idx = 0;
      }

      const item = this.items[idx];
      if (!item.disabled) {
        return idx;
      }
    }
    return -1;
  }

  _updateExpanded(e) {
    const target = filterItems(e.composedPath())[0];
    const idx = this.items.indexOf(target);
    if (e.detail.value) {
      if (target.disabled || idx === -1) {
        return;
      }

      this.expanded = idx;

      this.items.forEach(item => {
        if (item !== target && item.expanded) {
          item.expanded = false;
        }
      });
    } else if (!this.items.some(item => item.expanded)) {
      this.expanded = null;
    }
  }
}

export { AccordionPanelBase } from './lit-accordion-panel-base.js';
