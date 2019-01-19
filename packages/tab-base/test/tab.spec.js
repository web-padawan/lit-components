import { defineCE, fixture } from '@open-wc/testing-helpers';
import { TabBase } from '../lit-tab-base.js';

describe('tab', () => {
  const Tab = defineCE(class extends TabBase {});

  let tab;

  beforeEach(async () => {
    tab = await fixture(`<${Tab}>content</${Tab}>`);
  });

  it('should extend item-mixin', () => {
    expect(tab.constructor.hasLitItemMixin).to.be.true;
  });

  it('should have the `tab` role', () => {
    expect(tab.getAttribute('role')).to.be.eql('tab');
  });

  it('should have an unnamed slot for content', () => {
    const slot = tab.shadowRoot.querySelector('slot:not([name])');
    const content = slot.assignedNodes()[0];
    expect(content.nodeType).to.be.equal(3);
    expect(content.textContent.trim()).to.be.equal('content');
  });
});
