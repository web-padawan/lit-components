import { LitElement, html } from '@polymer/lit-element';
import { render } from 'lit-html';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import '@polymer/iron-form/iron-form.js';
import { CheckboxBase } from '@lit/checkbox-base';
import { downAndUp, spaceDown, spaceUp } from '../helpers/keys.js';
import { change } from '../helpers/events.js';

customElements.define('lit-check', class extends CheckboxBase {});

describe('checkbox', () => {
  const fixture = html`
    <lit-check name="name"
      >Lit <i>Checkbox</i> with <a href="#">Terms &amp; Conditions</a></lit-check
    >
  `;

  let checkbox, nativeCheckbox, label;

  beforeEach(async () => {
    const div = document.createElement('div');
    render(fixture, div);
    checkbox = div.firstElementChild;
    document.body.appendChild(checkbox);
    await checkbox.updateComplete;
    nativeCheckbox = checkbox._nativeCheckbox;
    label = checkbox._labelPart;
  });

  afterEach(() => {
    checkbox.parentNode.removeChild(checkbox);
  });

  it('should define checkbox label using light DOM', () => {
    const children = FlattenedNodesObserver.getFlattenedNodes(label);
    expect(children[0].textContent).to.be.equal('Lit ');
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
});

describe('checkbox change event', () => {
  let checkbox;

  beforeEach(async () => {
    checkbox = document.createElement('lit-check');
    document.body.appendChild(checkbox);
    await checkbox.updateComplete;
  });

  afterEach(() => {
    checkbox.parentNode.removeChild(checkbox);
  });

  it('should not be dispatched when changing checked value programmatically', () => {
    checkbox.addEventListener('change', () => {
      throw new Error('Should not come here!');
    });
    checkbox.checked = true;
  });

  it('should be dispatched when user checks the element', done => {
    checkbox.addEventListener('change', () => done());
    checkbox.click();
  });

  it('should be dispatched when user unchecks the element', done => {
    checkbox.checked = true;
    checkbox.addEventListener('change', () => done());
    checkbox.click();
  });
});

describe('iron-form checkbox', () => {
  customElements.define(
    'x-checkbox',
    class XCheckbox extends LitElement {
      render() {
        return html`
          <iron-form id="form">
            <form>
              <lit-check id="boundname" name="${this.checkboxName}"></lit-check>
              <lit-check id="attrname" name="attrcheckbox"></lit-check>
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

  let xCheckbox, boundNameCheckbox, attrNameCheckbox, form;

  beforeEach(async () => {
    xCheckbox = document.createElement('x-checkbox');
    document.body.appendChild(xCheckbox);
    await xCheckbox.updateComplete;
    form = xCheckbox.shadowRoot.querySelector('iron-form');
    boundNameCheckbox = xCheckbox.shadowRoot.querySelector('#boundname');
    attrNameCheckbox = xCheckbox.shadowRoot.querySelector('#attrname');
    await Promise.all([boundNameCheckbox.updateComplete, attrNameCheckbox.updateComplete]);
  });

  afterEach(() => {
    xCheckbox.parentNode.removeChild(xCheckbox);
  });

  it('should serialize', () => {
    boundNameCheckbox.checked = true;
    expect(boundNameCheckbox.name).to.equal('boundcheckbox');
    expect(form.serializeForm().boundcheckbox).to.equal('on');
  });

  it('should serialize with a custom value', () => {
    boundNameCheckbox.checked = true;
    boundNameCheckbox.value = 'foo';
    expect(form.serializeForm().boundcheckbox).to.equal('foo');
  });

  it('should not serialize when not checked', () => {
    expect(boundNameCheckbox.name).to.be.empty;
    expect(form.serializeForm()).to.be.empty;
  });

  it('should not serialize without a name', () => {
    boundNameCheckbox.checked = true;
    boundNameCheckbox.name = '';
    expect(form.serializeForm()).to.be.empty;
  });

  it('should not serialize after unchecked', () => {
    boundNameCheckbox.checked = true;
    boundNameCheckbox.checked = false;
    expect(form.serializeForm()).to.be.empty;
  });

  it('should define the name from an attribute', async () => {
    attrNameCheckbox.checked = true;
    await attrNameCheckbox.updateComplete;
    expect(form.serializeForm().attrcheckbox).to.equal('on');
  });
});
