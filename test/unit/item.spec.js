import { ItemBase } from '@lit/item-base';

describe('item', () => {
  customElements.define('test-item', class extends ItemBase {});

  let item;

  beforeEach(async () => {
    item = document.createElement('test-item');
    item.textContent = 'label';
    document.body.appendChild(item);
    await item.updateComplete;
  });

  afterEach(() => {
    item.parentNode.removeChild(item);
  });

  it('should extend item-mixin', () => {
    expect(item.constructor.hasLitItemMixin).to.be.true;
  });

  it('should have an unnamed slot for label', () => {
    const slot = item.shadowRoot.querySelector('slot:not([name])');
    const content = slot.assignedNodes()[0];
    expect(content.nodeType).to.be.equal(3);
    expect(content.textContent.trim()).to.be.equal('label');
  });

  it('should have a content part wrapping slot', () => {
    const slot = item.shadowRoot.querySelector('slot');
    const content = item.shadowRoot.querySelector('[part="content"]');
    expect(content).to.be.instanceof(Element);
    expect(slot.parentElement).to.equal(content);
  });

  it('should have a block context for content part', () => {
    const content = item.shadowRoot.querySelector('[part="content"]');
    expect(getComputedStyle(content).getPropertyValue('display')).to.equal('block');
  });
});
