import { ItemBase } from '@lit/item-base';
import { ListBoxBase } from '@lit/list-box-base';

describe('list-box', () => {
  customElements.define('list-box', class extends ListBoxBase {});
  customElements.define('list-box-item', class extends ItemBase {});

  let list;

  beforeEach(async () => {
    list = document.createElement('list-box');
    document.body.appendChild(list);
    await list.updateComplete;
  });

  afterEach(() => {
    list.parentNode.removeChild(list);
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
    const item = document.createElement('list-box-item');
    list.appendChild(item);
    await item.updateComplete;
    const slot = list.shadowRoot.querySelector('slot:not([name])');
    expect(slot.assignedNodes().length).to.be.equal(1);
  });
});
