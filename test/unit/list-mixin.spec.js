import { LitElement, html } from '@polymer/lit-element';
import { render } from 'lit-html';
import { ItemMixin } from '@lit/item-mixin';
import { ListMixin } from '@lit/list-mixin';
import {
  arrowDown,
  arrowDownIE,
  arrowLeft,
  arrowRight,
  arrowUp,
  home,
  end,
  keyDownChar
} from '../helpers/keys.js';

describe('list-mixin', () => {
  function click(target, modifier) {
    const props = {
      bubbles: true,
      composed: true
    };
    props[`${modifier}Key`] = true;
    const event = new MouseEvent('click', props);
    target.dispatchEvent(event);
  }

  customElements.define(
    'list-item',
    class extends ItemMixin(LitElement) {
      render() {
        return html`
          <div>
            <slot></slot>
          </div>
        `;
      }
    }
  );

  customElements.define(
    'x-list',
    class extends ListMixin(LitElement) {
      render() {
        return html`
          <style>
            :host {
              display: block;
            }

            #scroll {
              overflow: auto;
              display: flex;
            }

            :host([orientation="vertical"]) #scroll {
              height: 100%;
              flex-direction: column;
            }
          </style>
          <div id="scroll">
            <slot></slot>
          </div>
        `;
      }
      get _scrollerElement() {
        return this.shadowRoot.getElementById('scroll');
      }
    }
  );

  const fixture = html`
    <x-list style="width: 400px; height: 400px;">
      <list-item>Foo</list-item>
      <list-item>Bar</list-item>
      <hr>
      <list-item disabled>Bay</list-item>
      <list-item><span>Baz</span></list-item>
      <hr>
      <list-item disabled>Qux</list-item>
      <list-item>
        <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
        <span>Xyzzy</span>
      </list-item>
    </x-list>
  `;

  let list;

  beforeEach(async () => {
    const div = document.createElement('div');
    render(fixture, div);
    list = div.firstElementChild;
    document.body.appendChild(list);
    await list.updateComplete;
  });

  afterEach(() => {
    if (list.parentNode) {
      list.parentNode.removeChild(list);
    }
  });

  it('should have a list of valid items after the DOM `_observer` has been run', () => {
    expect(list.items.length).to.be.equal(6);
  });

  describe('items', () => {
    beforeEach(() => list._observer.flush());

    it('should update items list when removing nodes', () => {
      expect(list.items.length).to.be.equal(6);

      list.removeChild(list.items[3]);
      list._observer.flush();
      expect(list.items.length).to.be.equal(5);
    });

    it('should update items list when adding nodes', async () => {
      const item = document.createElement('list-item');
      list.appendChild(item);
      await item.updateComplete;
      await list.updateComplete;
      expect(list.items.length).to.be.equal(7);
    });

    it('should update items list when moving nodes', () => {
      const [e2, e4] = [list.items[2], list.items[4]];

      list.insertBefore(e4, e2);
      list._observer.flush();
      expect(list.items[2]).to.be.equal(e4);
      expect(list.items[3]).to.be.equal(e2);
    });
  });

  describe('selection', () => {
    it('should not select any item by default', () => {
      list.items.forEach(e => expect(!!list.items[0].selected).to.be.false);
    });

    it('should select an item when `selected` property is set', async () => {
      list.selected = 3;
      await list.updateComplete;
      expect(list.items[3].selected).to.be.true;
    });

    it('should clear selection when `selected` property is set to not numeric value', async () => {
      list.selected = 3;
      list.selected = undefined;
      await list.updateComplete;
      expect(list.items[3].selected).to.be.false;
    });

    it('should be selectable with mouse click', () => {
      list.items[3].click();
      expect(list.selected).to.be.equal(3);
    });

    it('should be selectable with mouse click in child elements', () => {
      list.items[3].firstElementChild.click();
      expect(list.selected).to.be.equal(3);
    });

    it('should not select item on with mouse click with ctrl key', () => {
      click(list.items[3], 'ctrl');
      expect(list.items[3].selected).to.be.false;
    });

    it('should not select item on with mouse click with shift key', () => {
      click(list.items[3], 'shift');
      expect(list.items[3].selected).to.be.false;
    });

    it('should not select item on with mouse click with meta key', () => {
      click(list.items[3], 'meta');
      expect(list.items[3].selected).to.be.false;
    });
  });

  describe('tabIndex', () => {
    it('should set tabIndex=-1 to all items, but the first', () => {
      [0, -1, -1, -1].forEach((val, idx) => expect(list.items[idx].tabIndex).to.be.equal(val));
    });

    it('should move tabIndex when moving focus', () => {
      list._focus(3);
      [-1, -1, -1, 0].forEach((val, idx) => expect(list.items[idx].tabIndex).to.be.equal(val));
    });

    it('should not set tabIndex=0 to disabled items, but the next one in the loop', () => {
      list._focus(2);
      [-1, -1, -1, 0].forEach((val, idx) => expect(list.items[idx].tabIndex).to.be.equal(val));
    });

    it('should have a `focus()` method focusing item with `tabIndex=0`', done => {
      list._setFocusable(3);
      list.items[3].focus = () => done();
      list.focus();
    });
  });

  describe('focus', () => {
    beforeEach(() => list._focus(0));

    it('should move focus to next element on "arrow-down" keydown', () => {
      arrowDown(list);
      expect(list.items[1].focused).to.be.true;
    });

    it('should move focus when event.key name does not include the Arrow prefix (IE)', () => {
      arrowDownIE(list);
      expect(list.items[1].focused).to.be.true;
    });

    it('should move focus to prev element on "arrow-up" keydown', () => {
      arrowDown(list);
      arrowUp(list);
      expect(list.items[0].focused).to.be.true;
    });

    it('should move focus to next element on "arrow-right" keydown', () => {
      list.orientation = 'horizontal';
      arrowRight(list);
      expect(list.items[1].focused).to.be.true;
    });

    it('should move focus to prev element on "arrow-right" keydown', () => {
      list.orientation = 'horizontal';
      arrowRight(list);
      arrowLeft(list);
      expect(list.items[0].focused).to.be.true;
    });

    it('should move focus to first element on "home" keydown', () => {
      list._focus(3);
      home(list);
      expect(list.items[0].focused).to.be.true;
    });

    it('should move focus to second element if first is disabled on "home" keydown', () => {
      list.items[0].disabled = true;
      list._focus(3);
      home(list);
      expect(list.items[1].focused).to.be.true;
    });

    it('should move focus to last element on "end" keydown', () => {
      end(list);
      expect(list.items[5].focused).to.be.true;
    });

    it('should move focus to the most closed enabled element if last is disabled on "end" keydown', () => {
      list.items[5].disabled = true;
      end(list);
      expect(list.items[3].focused).to.be.true;
    });

    it('if focus is in last element should move focus to first element on arrow-down', () => {
      list._focus(list.items.length - 1);
      arrowDown(list);
      expect(list.items[0].focused).to.be.true;
    });

    it('if focus is in first element should move focus to last element on arrow-up', () => {
      arrowUp(list);
      expect(list.items[list.items.length - 1].focused).to.be.true;
    });

    it('focus loop should skip disabled items', () => {
      arrowDown(list);
      arrowDown(list);
      expect(list.items[3].focused).to.be.true;
    });

    it('should focus the next item whose first letter matches the key pressed', () => {
      keyDownChar(list, 'b');
      expect(list.items[1].focused).to.be.true;
    });

    it('key search should be case insensitive', () => {
      keyDownChar(list, 'B');
      expect(list.items[1].focused).to.be.true;
    });

    it('key search should not happen if a modifier key is pressed', () => {
      keyDownChar(list, 'b', 'shift');
      expect(list.items[0].focused).to.be.true;
    });

    it('key search should skip disabled items', () => {
      keyDownChar(list, 'b');
      keyDownChar(list, 'b');
      expect(list.items[3].focused).to.be.true;
    });

    it('key search should accept items having non-text content before text', () => {
      keyDownChar(list, 'x');
      expect(list.items[5].focused).to.be.true;
    });

    it('focus should loop when search by first letter', () => {
      list._focus(list.items.length - 1);
      keyDownChar(list, 'b');
      expect(list.items[1].focused).to.be.true;
    });
  });

  describe('orientation', () => {
    it('if no orientation set, aria-orientation attribute should set to vertical', () => {
      expect(list.getAttribute('aria-orientation')).to.be.equal('vertical');
    });

    it('if horizontally oriented, aria-orientation attribute should be set to horizontal', async () => {
      list.orientation = 'horizontal';
      await list.updateComplete;
      expect(list.getAttribute('aria-orientation')).to.be.equal('horizontal');
    });

    it('if vertically oriented, aria-orientation attribute should be set to vertical', async () => {
      list.orientation = 'vertical';
      await list.updateComplete;
      expect(list.getAttribute('aria-orientation')).to.be.equal('vertical');
    });

    it('should not have orientation attribute on each item if orientation is not set', () => {
      list.items.forEach(item => {
        expect(item.hasAttribute('orientation')).to.be.false;
      });
    });

    it('should have orientation attribute on each item', async () => {
      list.orientation = 'horizontal';
      await list.updateComplete;
      list.items.forEach(item => {
        expect(item.getAttribute('orientation')).to.be.equal('horizontal');
      });
    });

    it('should change orientation attribute on each item', async () => {
      list.orientation = 'horizontal';
      list.orientation = 'vertical';
      await list.updateComplete;
      list.items.forEach(item => {
        expect(item.getAttribute('orientation')).to.be.equal('vertical');
      });
    });

    it('should set orientation attribute on newly added item', async () => {
      list.orientation = 'vertical';
      await list.updateComplete;

      const item = document.createElement('list-item');
      item.textContent = 'foo';
      list.appendChild(item);
      await item.updateComplete;
      await list.updateComplete;

      expect(item.hasAttribute('orientation')).to.be.true;
    });

    it('should have a protected boolean property to check vertical orientation', async () => {
      expect(list._vertical).to.be.true;
      list.orientation = 'horizontal';
      await list.updateComplete;
      expect(list._vertical).to.be.false;
    });
  });

  describe('scroll', () => {
    beforeEach(() => {
      list.style.width = list.style.height = '50px';
    });

    it('should move scroll horizontally when orientation is horizontal', () => {
      list.orientation = 'horizontal';
      expect(list._scrollerElement.scrollLeft).to.be.equal(0);
      list._scrollToItem(1);
      expect(list._scrollerElement.scrollLeft).to.be.greaterThan(0);
    });

    it('should move scroll vertically when orientation is vertical', async () => {
      list.orientation = 'vertical';
      await list.updateComplete;
      expect(list._scrollerElement.scrollTop).to.be.equal(0);

      // iOS 10 needs change the display to work
      list.style.display = 'flex';

      // FIXME: using _scroll because _scrollToItem does not work in IE11 in vertical mode.
      // list._scrollToItem(1);
      list._scroll(1);

      expect(list._scrollerElement.scrollTop).to.be.greaterThan(0);
    });

    it('should not move if the element does not exist', () => {
      list.orientation = 'horizontal';
      expect(list._scrollerElement.scrollLeft).to.be.equal(0);
      list._scrollToItem(10);
      expect(list._scrollerElement.scrollLeft).to.be.equal(0);
    });
  });
});
