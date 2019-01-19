import { defineCE, fixture } from '@open-wc/testing-helpers';
import { ItemBase } from '@lit/item-base';
import { ListBoxBase } from '../lit-list-box-base.js';

describe('list-box', () => {
  const ListBox = defineCE(
    class extends ListBoxBase {
      static get styles() {
        return super.styles;
      }
    }
  );

  const Item = defineCE(
    class extends ItemBase {
      static get styles() {
        return super.styles;
      }
    }
  );

  let list;

  beforeEach(async () => {
    list = await fixture(`<${ListBox}></${ListBox}>`);
  });

  it('should have a role attribute', () => {
    expect(list.getAttribute('role')).to.be.equal('list');
  });

  it('should implement list-mixin', () => {
    expect(list.constructor.hasLitListMixin).to.be.true;
  });

  it('should set _scrollerElement to the items part', () => {
    const items = list.shadowRoot.querySelector('[part="items"]');
    expect(items).to.be.instanceof(Element);
    expect(list._scrollerElement).to.equal(items);
  });

  it('should have an unnamed slot for content', async () => {
    const item = document.createElement(Item);
    list.appendChild(item);
    await item.updateComplete;
    const slot = list.shadowRoot.querySelector('slot:not([name])');
    expect(slot.assignedNodes().length).to.be.equal(1);
  });
});
