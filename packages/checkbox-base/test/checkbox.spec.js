import { LitElement } from 'lit-element';
import { defineCE, fixture, html, unsafeStatic } from '@open-wc/testing-helpers';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import '@polymer/iron-form/iron-form.js';
import { change, downAndUp, spaceDown, spaceUp } from '@lit/test-helpers';
import { CheckboxBase } from '../lit-checkbox-base.js';

const Checkbox = defineCE(class extends CheckboxBase {});

describe('checkbox', () => {
  let checkbox;
  let nativeCheckbox;
  let label;

  beforeEach(async () => {
    checkbox = await fixture(`
      <${Checkbox} name="name">
        Lit <i>Checkbox</i> with <a href="#">Terms &amp; Conditions</a>
      </${Checkbox}>
    `);
    nativeCheckbox = checkbox._nativeCheckbox;
    label = checkbox._labelPart;
  });

  it('should define checkbox label using light DOM', () => {
    const children = FlattenedNodesObserver.getFlattenedNodes(label);
    expect(children[0].textContent.trim()).to.be.equal('Lit');
    expect(children[1].outerHTML).to.be.equal('<i>Checkbox</i>');
  });

  it('should propagate disabled attribute to the native checkbox', async () => {
    checkbox.disabled = true;
    await checkbox.updateComplete;
    expect(nativeCheckbox.hasAttribute('disabled')).to.be.eql(true);
  });

  it('should have default value "on"', () => {
    expect(checkbox.value).to.be.eql('on');
  });

  it('should fire click event', done => {
    checkbox.addEventListener('click', () => {
      done();
    });
    downAndUp(checkbox);
  });

  it('should have proper name', async () => {
    expect(checkbox.name).to.eq('');
    checkbox.checked = true;
    await checkbox.updateComplete;
    expect(checkbox.name).to.eq('name');
  });

  it('should toggle on host click', () => {
    checkbox.click();
    expect(checkbox.checked).to.be.true;

    checkbox.click();
    expect(checkbox.checked).to.be.false;
  });

  it('should not toggle on link inside host click', () => {
    const link = FlattenedNodesObserver.getFlattenedNodes(label)[3];
    expect(link.outerHTML).to.be.equal('<a href="#">Terms &amp; Conditions</a>');
    link.click();
    expect(checkbox.checked).to.be.false;
  });

  it('should not toggle on click when disabled', async () => {
    checkbox.disabled = true;
    await checkbox.updateComplete;
    label.click();
    expect(checkbox.checked).to.be.false;
  });

  it('should dispatch `checked-changed` event when checked changes', async () => {
    const spy = sinon.spy();
    checkbox.addEventListener('checked-changed', spy);
    checkbox.checked = true;
    await checkbox.updateComplete;
    expect(spy).to.be.calledOnce;
  });

  it('should bind checked to the native checkbox and vice versa', async () => {
    checkbox.checked = true;
    await checkbox.updateComplete;
    expect(nativeCheckbox.checked).to.be.eql(true);

    nativeCheckbox.checked = false;
    change(nativeCheckbox);
    await checkbox.updateComplete;
    expect(checkbox.checked).to.be.eql(false);
  });

  it('should bind indeterminate to the native checkbox and vice versa', async () => {
    checkbox.indeterminate = true;
    await checkbox.updateComplete;
    expect(nativeCheckbox.indeterminate).to.be.eql(true);

    nativeCheckbox.indeterminate = false;
    change(nativeCheckbox);
    await checkbox.updateComplete;
    expect(checkbox.indeterminate).to.be.eql(false);
  });

  it('should set aria-checked to "true" when checked', async () => {
    checkbox.checked = true;
    await checkbox.updateComplete;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('true');
  });

  it('should set aria-checked to "false" when unchecked', async () => {
    checkbox.checked = false;
    await checkbox.updateComplete;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('false');
  });

  it('should set aria-checked to "mixed" when indeterminate', async () => {
    checkbox.indeterminate = true;
    await checkbox.updateComplete;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('mixed');
  });

  it('should set indeterminate to false when clicked the first time', () => {
    checkbox.indeterminate = true;
    checkbox.click();
    expect(checkbox.indeterminate).to.be.false;
  });

  it('native checkbox should have the `presentation` role', () => {
    expect(checkbox.getAttribute('role')).to.be.eql('checkbox');
  });

  it('host should have the `checkbox` role', () => {
    expect(checkbox.getAttribute('role')).to.be.eql('checkbox');
  });

  it('should be checked after space when initially checked is false and indeterminate is true', async () => {
    checkbox.checked = false;
    checkbox.indeterminate = true;
    await checkbox.updateComplete;

    spaceDown(checkbox);
    spaceUp(checkbox);

    await checkbox.updateComplete;
    expect(checkbox.checked).to.be.true;
    expect(checkbox.indeterminate).to.be.false;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('true');
  });

  it('should not be checked after space when initially checked is true and indeterminate is true', async () => {
    checkbox.checked = true;
    checkbox.indeterminate = true;
    await checkbox.updateComplete;

    spaceDown(checkbox);
    spaceUp(checkbox);

    await checkbox.updateComplete;
    expect(checkbox.checked).to.be.false;
    expect(checkbox.indeterminate).to.be.false;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('false');
  });

  it('should be checked after click when initially checked is false and indeterminate is true', async () => {
    checkbox.checked = false;
    checkbox.indeterminate = true;
    await checkbox.updateComplete;

    checkbox.click();

    await checkbox.updateComplete;
    expect(checkbox.checked).to.be.true;
    expect(checkbox.indeterminate).to.be.false;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('true');
  });

  it('should not be checked after click when initially checked is true and indeterminate is true', async () => {
    checkbox.checked = true;
    checkbox.indeterminate = true;
    await checkbox.updateComplete;

    checkbox.click();

    await checkbox.updateComplete;
    expect(checkbox.checked).to.be.false;
    expect(checkbox.indeterminate).to.be.false;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('false');
  });

  it('should dispatch `indeterminate-changed` event when indeterminate changes', async () => {
    const spy = sinon.spy();
    checkbox.addEventListener('indeterminate-changed', spy);
    checkbox.indeterminate = true;
    await checkbox.updateComplete;
    expect(spy).to.be.calledOnce;
  });

  it('should not dispatch `change` event when checked changed programmatically', async () => {
    const spy = sinon.spy();
    checkbox.addEventListener('change', spy);
    checkbox.checked = true;
    await checkbox.updateComplete;
    expect(spy).to.not.be.called;
  });

  it('should dispatch `change` event when user checks the element', async () => {
    const spy = sinon.spy();
    checkbox.addEventListener('change', spy);
    checkbox.click();
    await checkbox.updateComplete;
    expect(spy).to.be.calledOnce;
  });

  it('should dispatch `change event when user un-checks the element', async () => {
    checkbox.checked = true;
    await checkbox.updateComplete;
    const spy = sinon.spy();
    checkbox.addEventListener('change', spy);
    checkbox.click();
    await checkbox.updateComplete;
    expect(spy).to.be.calledOnce;
  });
});

describe('iron-form checkbox', () => {
  const checkboxTag = unsafeStatic(Checkbox);
  const Wrapper = defineCE(
    class extends LitElement {
      render() {
        return html`
          <iron-form>
            <form>
              <${checkboxTag} id="boundname" name="${this.checkboxName}"></${checkboxTag}>
              <${checkboxTag} id="attrname" name="attrcheckbox"></${checkboxTag}>
            </form>
          </iron-form>
        `;
      }

      static get properties() {
        return {
          checkboxName: {
            type: String
          }
        };
      }

      constructor() {
        super();
        this.checkboxName = 'boundcheckbox';
      }
    }
  );

  let wrapper;
  let checkbox;
  let form;

  beforeEach(async () => {
    wrapper = await fixture(`<${Wrapper}></${Wrapper}>`);
    form = wrapper.shadowRoot.querySelector('iron-form');
  });

  it('should serialize', () => {
    checkbox = wrapper.shadowRoot.querySelector('#boundname');
    checkbox.checked = true;
    expect(checkbox.name).to.equal('boundcheckbox');
    expect(form.serializeForm().boundcheckbox).to.equal('on');
  });

  it('should serialize with a custom value', () => {
    checkbox = wrapper.shadowRoot.querySelector('#boundname');
    checkbox.checked = true;
    checkbox.value = 'foo';
    expect(form.serializeForm().boundcheckbox).to.equal('foo');
  });

  it('should not serialize when not checked', () => {
    checkbox = wrapper.shadowRoot.querySelector('#boundname');
    expect(checkbox.name).to.be.empty;
    expect(form.serializeForm()).to.be.empty;
  });

  it('should not serialize without a name', () => {
    checkbox = wrapper.shadowRoot.querySelector('#boundname');
    checkbox.checked = true;
    checkbox.name = '';
    expect(form.serializeForm()).to.be.empty;
  });

  it('should not serialize after unchecked', () => {
    checkbox = wrapper.shadowRoot.querySelector('#boundname');
    checkbox.checked = true;
    checkbox.checked = false;
    expect(form.serializeForm()).to.be.empty;
  });

  it('should define the name from an attribute', async () => {
    checkbox = wrapper.shadowRoot.querySelector('#attrname');
    checkbox.checked = true;
    await checkbox.updateComplete;
    expect(form.serializeForm().attrcheckbox).to.equal('on');
  });
});
