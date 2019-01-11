import { html } from 'lit-element';
import { render } from 'lit-html';
import { shiftTabDown } from '@lit/test-helpers';
import { DetailsBase } from '../lit-details-base.js';

customElements.define('lit-details', class extends DetailsBase {});

describe('details', () => {
  const fixture = html`
    <lit-details summary="Summary">Content</lit-details>
  `;

  let details;
  let toggle;
  let content;

  beforeEach(async () => {
    const div = document.createElement('div');
    render(fixture, div);
    details = div.firstElementChild;
    document.body.appendChild(details);
    await details.updateComplete;
    toggle = details.focusElement;
    content = details.collapsible;
  });

  afterEach(() => {
    if (details.parentNode) {
      details.parentNode.removeChild(details);
    }
  });

  it('should disable toggle button when `disabled` is true', async () => {
    details.disabled = true;
    await details.updateComplete;
    expect(toggle.hasAttribute('disabled')).to.equal(true);
  });

  it('should set type="button" on the toggle button', () => {
    expect(toggle.getAttribute('type')).to.equal('button');
  });

  it('should set role="heading" on the toggle button wrapper', () => {
    expect(toggle.parentElement.getAttribute('role')).to.equal('heading');
  });

  it('should set `summary` as the toggle button text content', async () => {
    details.summary = 'Cool';
    await details.updateComplete;
    expect(toggle.textContent.trim()).to.equal('Cool');
  });

  it('should update `expanded` on toggle button click', async () => {
    toggle.click();
    await details.updateComplete;
    expect(details.expanded).to.equal(true);
    toggle.click();
    await details.updateComplete;
    expect(details.expanded).to.equal(false);
  });

  it('should hide the content when `expanded` is false', () => {
    const style = getComputedStyle(content);
    expect(style.display).to.equal('none');
    expect(style.overflow).to.equal('hidden');
    expect(style.maxHeight).to.equal('0px');
  });

  it('should show the content when `expanded` is true', async () => {
    details.expanded = true;
    await details.updateComplete;
    const style = getComputedStyle(content);
    expect(style.display).to.equal('block');
    expect(style.overflow).to.equal('visible');
    expect(style.maxHeight).to.equal('none');
  });

  it('should dispatch `expanded-changed` event when `expanded changes', async () => {
    const spy = sinon.spy();
    details.addEventListener('expanded-changed', spy);
    toggle.click();
    await details.updateComplete;
    expect(spy).to.be.calledOnce;
    expect(spy.firstCall.args[0].detail).to.be.an('object');
    expect(spy.firstCall.args[0].detail.value).to.equal(true);
  });

  it('should update aria-expanded on toggle button when `expanded` changes', async () => {
    expect(toggle.getAttribute('aria-expanded')).to.equal('false');
    details.expanded = true;
    await details.updateComplete;
    expect(toggle.getAttribute('aria-expanded')).to.equal('true');
  });

  it('should update aria-hidden on the content when `expanded` changes', async () => {
    expect(content.getAttribute('aria-hidden')).to.equal('true');
    details.expanded = true;
    await details.updateComplete;
    expect(content.getAttribute('aria-hidden')).to.equal('false');
  });

  it('should stop Shift + Tab on the content from propagating to the host', async () => {
    const spy = sinon.spy();
    details.addEventListener('keydown', spy);
    shiftTabDown(content);
    expect(spy).to.not.be.called;
  });
});
