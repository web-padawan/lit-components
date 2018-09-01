import { LitElement, html } from '@polymer/lit-element';
import '@polymer/iron-test-helpers/mock-interactions.js';
import { CheckboxMixin } from '@lit/checkbox-mixin';

customElements.define(
  'lit-check',
  class extends CheckboxMixin(LitElement) {
    render() {
      return html`
        <label>
          <span part="label">
            <slot></slot>
          </span>
          <input type="checkbox">
        </label>
      `;
    }
    get focusElement() {
      return this._nativeCheckbox;
    }
  }
);

describe('checkbox-mixin active', () => {
  const down = node => {
    node.dispatchEvent(new CustomEvent('down'));
  };

  const up = node => {
    node.dispatchEvent(new CustomEvent('up'));
  };

  let checkbox;

  beforeEach(async () => {
    checkbox = document.createElement('lit-check');
    document.body.appendChild(checkbox);
    await checkbox.updateComplete;
  });

  afterEach(() => {
    checkbox.parentNode.removeChild(checkbox);
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
});

describe('checkbox-mixin label', () => {
  let checkbox, label;

  beforeEach(async () => {
    checkbox = document.createElement('lit-check');
    document.body.appendChild(checkbox);
    await checkbox.updateComplete;
    label = checkbox._labelPart;
  });

  afterEach(() => {
    checkbox.parentNode.removeChild(checkbox);
  });

  it('should exist in the shadow DOM on the component', () => {
    expect(label).to.be.ok;
  });

  it('should have a <slot> child element for slotted content', () => {
    expect(label.querySelector('slot')).to.be.ok;
  });

  it('should have "empty" attribute when there is no slotted content', () => {
    expect(label.hasAttribute('empty')).to.be.true;
  });

  it('should toggle "empty" attribute when slotted content added and removed', async () => {
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Added label';

    checkbox.appendChild(paragraph);
    await checkbox.updateComplete;
    expect(label.hasAttribute('empty')).to.be.false;

    checkbox.removeChild(paragraph);
    await checkbox.updateComplete;

    expect(label.hasAttribute('empty')).to.be.true;
  });
});
