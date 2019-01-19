import { LitElement } from 'lit-element';
import { defineCE, fixture, html, unsafeStatic } from '@open-wc/testing-helpers';
import '@polymer/iron-form/iron-form.js';
import { change, down, up, spaceDown, spaceUp } from '@lit/test-helpers';
import { RadioButtonBase } from '../lit-radio-button-base.js';

const Radio = defineCE(
  class extends RadioButtonBase {
    static get styles() {
      return super.styles;
    }
  }
);

describe('radio-button', () => {
  let radio;
  let nativeRadio;
  let label;

  beforeEach(async () => {
    radio = await fixture(`<${Radio} name="test-radio">Radio <b>Button</b></${Radio}>`);
    nativeRadio = radio.shadowRoot.querySelector('input');
    label = radio.shadowRoot.querySelector('[part="label"]');
  });

  it('should have proper role', () => {
    expect(radio.getAttribute('role')).to.equal('radio');
  });

  it('should have proper name', () => {
    expect(radio.name).to.eq('');
    radio.checked = true;
    expect(radio.name).to.eq('test-radio');
  });

  it('should set aria-checked on check', async () => {
    expect(radio.getAttribute('aria-checked')).to.eq('false');
    radio.checked = true;
    await radio.updateComplete;
    expect(radio.getAttribute('aria-checked')).to.eq('true');
  });

  it('can be disabled imperatively', async () => {
    radio.disabled = true;
    await radio.updateComplete;
    expect(radio.hasAttribute('disabled')).to.be.true;
  });

  it('should set checked on host click', () => {
    radio.click();
    expect(radio.checked).to.be.true;
  });

  it('should not set checked on host click when disabled', () => {
    radio.disabled = true;
    radio.click();
    expect(radio.checked).to.be.false;
  });

  it('should define radio button label using light DOM', () => {
    const children = label.firstElementChild.assignedNodes();
    expect(children[0].textContent).to.be.equal('Radio ');
    expect(children[1].outerHTML).to.be.equal('<b>Button</b>');
  });

  it('should bind checked to the native radio and vice versa', async () => {
    radio.checked = true;
    await radio.updateComplete;
    expect(nativeRadio.checked).to.be.true;

    nativeRadio.checked = false;
    change(nativeRadio);
    await radio.updateComplete;
    expect(radio.checked).to.be.false;
  });

  it('should have active attribute on down', () => {
    down(radio);
    expect(radio.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute after up', () => {
    down(radio);
    up(radio);
    expect(radio.hasAttribute('active')).to.be.false;
  });

  it('should have active attribute on space', () => {
    spaceDown(radio);
    expect(radio.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute after space', () => {
    spaceDown(radio);
    spaceUp(radio);
    expect(radio.hasAttribute('active')).to.be.false;
  });

  it('should have input as focusElement', () => {
    expect(radio.focusElement).to.be.equal(nativeRadio);
  });
});

describe('iron-form radio-button', () => {
  const radioTag = unsafeStatic(Radio);
  const Wrapper = defineCE(
    class extends LitElement {
      render() {
        return html`
          <iron-form>
            <form>
              <${radioTag} id="boundname" name="${this.radioButtonName}"></${radioTag}>
              <${radioTag} id="attrname" name="attrradiobutton"></${radioTag}>
            </form>
          </iron-form>
        `;
      }

      static get properties() {
        return {
          radioButtonName: {
            type: String
          }
        };
      }

      constructor() {
        super();
        this.radioButtonName = 'boundradiobutton';
      }
    }
  );

  let wrapper;
  let radio;
  let form;

  beforeEach(async () => {
    wrapper = await fixture(`<${Wrapper}></${Wrapper}>`);
    form = wrapper.shadowRoot.querySelector('iron-form');
  });

  it('should serialize', () => {
    radio = wrapper.shadowRoot.querySelector('#boundname');
    radio.checked = true;
    expect(radio.name).to.equal('boundradiobutton');
    expect(form.serializeForm().boundradiobutton).to.equal('on');
  });

  it('should serialize with a custom value', () => {
    radio = wrapper.shadowRoot.querySelector('#boundname');
    radio.checked = true;
    radio.value = 'foo';
    expect(form.serializeForm().boundradiobutton).to.equal('foo');
  });

  it('should not serialize when not checked', () => {
    radio = wrapper.shadowRoot.querySelector('#boundname');
    expect(radio.name).to.be.empty;
    expect(form.serializeForm()).to.be.empty;
  });

  it('should not serialize without a name', () => {
    radio = wrapper.shadowRoot.querySelector('#boundname');
    radio.checked = true;
    radio.name = '';
    expect(form.serializeForm()).to.be.empty;
  });

  it('should not serialize after unchecked', () => {
    radio = wrapper.shadowRoot.querySelector('#boundname');
    radio.checked = true;
    radio.checked = false;
    expect(form.serializeForm()).to.be.empty;
  });

  it('should define the name from an attribute', async () => {
    radio = wrapper.shadowRoot.querySelector('#attrname');
    radio.checked = true;
    await radio.updateComplete;
    expect(form.serializeForm().attrradiobutton).to.equal('on');
  });
});
