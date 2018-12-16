import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';

function filterItems(array) {
  return array.filter(e => e.constructor.hasLitItemMixin);
}

/**
 * @polymerMixin
 */
export const ListMixin = superClass =>
  class extends superClass {
    /**
     * Used for mixin detection because `instanceof` does not work with mixins.
     */
    static get hasLitListMixin() {
      return true;
    }

    static get properties() {
      return {
        /**
         * The index of the item selected in the items array
         */
        selected: {
          type: {
            fromAttribute: Number,
            toAttribute: value => (value == null ? null : value.toString())
          },
          reflect: true
        },

        /**
         * Define how items are disposed in the dom.
         * Possible values are: `horizontal|vertical`.
         * It also changes navigation keys from left/right to up/down.
         */
        orientation: {
          type: String,
          reflect: true
        },

        _items: {
          hasChanged: () => true
        }
      };
    }

    get focused() {
      return this.getRootNode().activeElement;
    }

    get items() {
      return this._items;
    }

    /* @override */
    get _scrollerElement() {
      // Returning scroller element of the component
      console.warn(`Please implement the '_scrollerElement' property in <${this.localName}>`);
      return this;
    }

    /* @protected */
    get _vertical() {
      return this.orientation !== 'horizontal';
    }

    update(props) {
      if (props.has('_items') || props.has('orientation') || props.has('selected')) {
        this._enhanceItems(this.items, this.orientation, this.selected);
      }

      super.update(props);
    }

    firstUpdated() {
      super.firstUpdated();
      this.addEventListener('keydown', e => this._onKeydown(e));
      this.addEventListener('click', e => this._onClick(e));

      this._observer = new FlattenedNodesObserver(this, () => {
        this._setItems(filterItems(Array.from(this.children)));
      });
    }

    _setItems(items) {
      this._items = items;
    }

    _enhanceItems(items, orientation, selected) {
      if (items) {
        this.setAttribute('aria-orientation', orientation || 'vertical');
        this.items.forEach(item => {
          if (orientation) {
            item.setAttribute('orientation', orientation);
          } else {
            item.removeAttribute('orientation');
          }
          // TODO: uncomment if needed
          // item.updateStyles();
        });

        this._setFocusable(selected);

        const itemToSelect = items[selected];
        items.forEach(item => {
          item.selected = item === itemToSelect;
        });
        if (itemToSelect && !itemToSelect.disabled) {
          this._scrollToItem(selected);
        }
      }
    }

    _onClick(event) {
      if (event.metaKey || event.shiftKey || event.ctrlKey) {
        return;
      }

      const item = filterItems(event.composedPath())[0];
      if (!item) {
        return;
      }
      const idx = this.items.indexOf(item);
      if (!item.disabled && idx > -1) {
        this.selected = idx;
      }
    }

    _onKeydown(event) {
      if (event.metaKey || event.shiftKey || event.ctrlKey) {
        return;
      }

      // IE names for arrows do not include the Arrow prefix
      const key = event.key.replace(/^Arrow/, '');

      const currentIdx = this.items.indexOf(this.focused);
      let condition = item => !item.disabled;
      let idx;
      let increment;

      if ((this._vertical && key === 'Up') || (!this._vertical && key === 'Left')) {
        increment = -1;
        idx = currentIdx - 1;
      } else if ((this._vertical && key === 'Down') || (!this._vertical && key === 'Right')) {
        increment = 1;
        idx = currentIdx + 1;
      } else if (key === 'Home') {
        increment = 1;
        idx = 0;
      } else if (key === 'End') {
        increment = -1;
        idx = this.items.length - 1;
      } else if (key.length === 1) {
        increment = 1;
        idx = currentIdx + 1;
        condition = item =>
          !item.disabled &&
          item.textContent
            .trim()
            .toLowerCase()
            .indexOf(key.toLowerCase()) === 0;
      }

      idx = this._getAvailableIndex(idx, increment, condition);
      if (idx >= 0) {
        this._focus(idx);
        event.preventDefault();
      }
    }

    _getAvailableIndex(index, increment, condition) {
      const totalItems = this.items.length;
      let idx = index;
      for (let i = 0; typeof idx === 'number' && i < totalItems; i++, idx += increment || 1) {
        if (idx < 0) {
          idx = totalItems - 1;
        } else if (idx >= totalItems) {
          idx = 0;
        }

        const item = this.items[idx];
        if (condition(item)) {
          return idx;
        }
      }
      return -1;
    }

    _setFocusable(index) {
      let idx = index;
      idx = this._getAvailableIndex(idx, 1, item => !item.disabled);
      const itemToFocus = this.items[idx] || this.items[0];
      this.items.forEach(item => {
        item.tabIndex = item === itemToFocus ? 0 : -1;
      });
    }

    _focus(idx) {
      const itemToFocus = this.items[idx];
      this.items.forEach(item => {
        item.focused = item === itemToFocus;
      });
      this._setFocusable(idx);
      this._scrollToItem(idx);
      itemToFocus.focus();
    }

    focus() {
      // In initialization (e.g vaadin-dropdown-menu) observer might not been run yet.
      if (this._observer) {
        this._observer.flush();
      }
      const focusable = this.querySelector('[tabindex="0"]') || this.items[0];
      if (focusable) {
        focusable.focus();
      }
    }

    // Scroll the container to have the next item by the edge of the viewport
    _scrollToItem(idx) {
      const item = this.items[idx];
      if (!item) {
        return;
      }

      const props = this._vertical ? ['top', 'bottom'] : ['left', 'right'];
      const scrollerRect = this._scrollerElement.getBoundingClientRect();
      const nextItemRect = (this.items[idx + 1] || item).getBoundingClientRect();
      const prevItemRect = (this.items[idx - 1] || item).getBoundingClientRect();

      let scrollDistance = 0;
      if (nextItemRect[props[1]] >= scrollerRect[props[1]]) {
        scrollDistance = nextItemRect[props[1]] - scrollerRect[props[1]];
      } else if (prevItemRect[props[0]] <= scrollerRect[props[0]]) {
        scrollDistance = prevItemRect[props[0]] - scrollerRect[props[0]];
      }

      this._scroll(scrollDistance);
    }

    _scroll(pixels) {
      this._scrollerElement[`scroll${this._vertical ? 'Top' : 'Left'}`] += pixels;
    }
  };
