import { LitElement, html } from '@polymer/lit-element';
import { render } from 'lit-html';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import '@polymer/iron-test-helpers/mock-interactions.js';
import '@polymer/iron-form/iron-form.js';
import { CheckboxBase } from '@lit/checkbox-base';

customElements.define(
  'lit-checkbox',
  class LitCheckbox extends CheckboxBase {
    static get is() {
      return 'lit-checkbox';
    }
  }
);

customElements.define(
  'x-checkbox',
  class XCheckbox extends LitElement {
    render() {
      return html`
      <iron-form id="form">
        <form>
          <lit-checkbox id="boundname" name="${this.checkboxName}"></lit-checkbox>
          <lit-checkbox id="attrname" name="attrcheckbox"></lit-checkbox>
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

const fixture = html`
  <lit-checkbox name="test-checkbox">Vaadin <i>Checkbox</i> with <a href="#">Terms &amp; Conditions</a></lit-checkbox>
`;

describe('checkbox', () => {
  const down = node => {
    node.dispatchEvent(new CustomEvent('down'));
  };

  const up = node => {
    node.dispatchEvent(new CustomEvent('up'));
  };

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
    expect(children[1].textContent).to.be.equal('Vaadin ');
    expect(children[2].outerHTML).to.be.equal('<i>Checkbox</i>');
  });

  it('can be disabled imperatively', async () => {
    checkbox.disabled = true;
    await checkbox.updateComplete;
    expect(nativeCheckbox.hasAttribute('disabled')).to.be.eql(true);
  });

  it('has default value "on"', () => {
    expect(checkbox.value).to.be.eql('on');
  });

  it('fires click event', function(done) {
    checkbox.addEventListener('click', () => {
      done();
    });
    MockInteractions.downAndUp(checkbox);
  });

  it('should have proper name', async () => {
    expect(checkbox.name).to.eq('');
    checkbox.checked = true;
    await checkbox.updateComplete;
    expect(checkbox.name).to.eq('test-checkbox');
  });

  it('should toggle on host click', () => {
    checkbox.click();

    expect(checkbox.checked).to.be.true;

    checkbox.click();

    expect(checkbox.checked).to.be.false;
  });

  it('should not toggle on link inside host click', () => {
    const link = FlattenedNodesObserver.getFlattenedNodes(label)[4];
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

  it('should bind checked to the native checkbox and vice versa', async () => {
    checkbox.checked = true;
    await checkbox.updateComplete;
    expect(nativeCheckbox.checked).to.be.eql(true);

    nativeCheckbox.checked = false;
    nativeCheckbox.dispatchEvent(new CustomEvent('change'));
    await checkbox.updateComplete;
    expect(checkbox.checked).to.be.eql(false);
  });

  it('should bind indeterminate to the native checkbox and vice versa', async () => {
    checkbox.indeterminate = true;
    await checkbox.updateComplete;
    expect(nativeCheckbox.indeterminate).to.be.eql(true);

    nativeCheckbox.indeterminate = false;
    nativeCheckbox.dispatchEvent(new CustomEvent('change'));
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

  it('should have active attribute on down', () => {
    down(checkbox);

    expect(checkbox.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute after up', () => {
    down(checkbox);

    up(checkbox);

    expect(checkbox.hasAttribute('active')).to.be.false;
  });

  it('should have active attribute on space', () => {
    MockInteractions.keyDownOn(checkbox, 32);

    expect(checkbox.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute after space', () => {
    MockInteractions.keyDownOn(checkbox, 32);

    MockInteractions.keyUpOn(checkbox, 32);

    expect(checkbox.hasAttribute('active')).to.be.false;
  });

  it('should be checked after space when initially checked is false and indeterminate is true', async () => {
    checkbox.checked = false;
    checkbox.indeterminate = true;
    await checkbox.updateComplete;

    MockInteractions.keyDownOn(checkbox, 32);
    MockInteractions.keyUpOn(checkbox, 32);

    await checkbox.updateComplete;
    expect(checkbox.checked).to.be.true;
    expect(checkbox.indeterminate).to.be.false;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('true');
  });

  it('should not be checked after space when initially checked is true and indeterminate is true', async () => {
    checkbox.checked = true;
    checkbox.indeterminate = true;
    await checkbox.updateComplete;

    MockInteractions.keyDownOn(checkbox, 32);
    MockInteractions.keyUpOn(checkbox, 32);

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

  it('should set empty attribute on part label when the label was removed', () => {
    while (checkbox.firstChild) {
      checkbox.removeChild(checkbox.firstChild);
    }

    // Workaround for not using timeouts
    const evt = new CustomEvent('slotchange');
    checkbox._labelPart.querySelector('slot').dispatchEvent(evt);

    expect(label.hasAttribute('empty')).to.be.true;
  });
});

describe('empty checkbox label', () => {
  let checkbox, label;

  beforeEach(async () => {
    checkbox = document.createElement('lit-checkbox');
    document.body.appendChild(checkbox);
    await checkbox.updateComplete;
    label = checkbox.shadowRoot.querySelector('[part="label"]');
  });

  afterEach(() => {
    checkbox.parentNode.removeChild(checkbox);
  });

  it('should set empty attribute on part label when there is no label', () => {
    expect(label.hasAttribute('empty')).to.be.true;
  });

  it('should remove empty attribute from part label when the label is added', async () => {
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Added label';

    checkbox.appendChild(paragraph);

    // Workaround for not using timeouts
    const evt = new CustomEvent('slotchange');
    label.querySelector('slot').dispatchEvent(evt);

    await checkbox.updateComplete;
    expect(label.hasAttribute('empty')).to.be.false;
  });
});

describe('change event', () => {
  let checkbox;

  beforeEach(async () => {
    checkbox = document.createElement('lit-checkbox');
    document.body.appendChild(checkbox);
    await checkbox.updateComplete;
  });

  afterEach(() => {
    checkbox.parentNode.removeChild(checkbox);
  });

  it('should not fire change-event when changing checked value programmatically', () => {
    checkbox.addEventListener('change', () => {
      throw new Error('Should not come here!');
    });
    checkbox.checked = true;
  });

  it('should fire change-event when user checks the element', done => {
    checkbox.addEventListener('change', () => done());
    checkbox.click();
  });

  it('should fire change-event when user unchecks the element', done => {
    checkbox.checked = true;
    checkbox.addEventListener('change', () => done());
    checkbox.click();
  });
});

describe('iron-form checkbox', () => {
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
