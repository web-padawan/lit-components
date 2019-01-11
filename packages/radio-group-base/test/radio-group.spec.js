import { html } from 'lit-element';
import { render } from 'lit-html';
import { RadioButtonBase } from '@lit/radio-button-base';
import { arrowDown, arrowLeft, arrowRight, arrowUp, focusout } from '@lit/test-helpers';
import { RadioGroupBase } from '../lit-radio-group-base.js';

customElements.define('lit-radio-button', class extends RadioButtonBase {});
customElements.define('lit-radio-group', class extends RadioGroupBase {});

describe('radio-group', () => {
  const fixture = html`
    <lit-radio-group>
      <lit-radio-button>Button <b>1</b></lit-radio-button>
      <lit-radio-button value="2">Button <b>2</b></lit-radio-button>
      <lit-radio-button>Button <b>3</b></lit-radio-button>
    </lit-radio-group>
  `;

  let radioGroup;
  let radioList;

  beforeEach(async () => {
    const div = document.createElement('div');
    render(fixture, div);
    radioGroup = div.firstElementChild;
    document.body.appendChild(radioGroup);
    await radioGroup.updateComplete;
    radioList = radioGroup.querySelectorAll('lit-radio-button');
    radioGroup._observer.flush();
  });

  afterEach(() => {
    radioGroup.parentNode.removeChild(radioGroup);
  });

  it('should set focus to the first element by default', () => {
    expect(radioList[0].tabIndex).to.eq(0);
    expect(radioList[1].tabIndex).to.eq(-1);
    expect(radioList[2].tabIndex).to.eq(-1);
  });

  it('should set role properly', () => {
    expect(radioGroup.getAttribute('role')).to.eq('radiogroup');
  });

  it('should change aria-disabled on disabled change', async () => {
    radioGroup.disabled = true;
    await radioGroup.updateComplete;
    expect(radioGroup.getAttribute('aria-disabled')).to.eq('true');
  });

  it('should disable radio buttons when disabled imperatively', async () => {
    radioGroup.disabled = true;
    await radioGroup.updateComplete;
    expect(radioGroup.hasAttribute('disabled')).to.be.true;
    expect(Array.from(radioList).every(radio => radio.hasAttribute('disabled'))).to.be.true;
  });

  it('should set disabled property to dynamically added radio-button', async () => {
    radioGroup.disabled = true;
    const radio = document.createElement('lit-radio-button');
    radio.setAttribute('value', '5');
    radioGroup.appendChild(radio);
    radioGroup._observer.flush();
    await radioGroup.updateComplete;
    expect(radio.disabled).to.be.true;
  });

  it('should have roving tabindex', async () => {
    radioList[1].checked = true;
    await radioGroup.updateComplete;

    expect(radioList[0].tabIndex).to.eq(-1);
    expect(radioList[1].tabIndex).to.eq(0);
    expect(radioList[2].tabIndex).to.eq(-1);

    radioList[2].checked = true;
    await radioGroup.updateComplete;

    expect(radioList[0].tabIndex).to.eq(-1);
    expect(radioList[1].tabIndex).to.eq(-1);
    expect(radioList[2].tabIndex).to.eq(0);
  });

  it('should focus and check next/first radio button after right/down', async () => {
    radioList[1].checked = true;
    await radioGroup.updateComplete;

    arrowRight(radioGroup);
    await radioGroup.updateComplete;

    expect(radioList[2].checked).to.be.true;
    expect(radioList[0].checked).to.be.false;

    arrowDown(radioGroup);
    await radioGroup.updateComplete;

    expect(radioList[0].checked).to.be.true;
    expect(radioList[2].checked).to.be.false;
  });

  it('should check radio button with keyboard if not disabled or readonly', async () => {
    radioList[1].checked = true;
    await radioGroup.updateComplete;
    arrowRight(radioGroup);
    await radioGroup.updateComplete;
    expect(radioList[2].checked).to.be.true;
  });

  it('should not check radio button with keyboard if disabled', async () => {
    radioList[1].checked = true;
    radioGroup.disabled = true;
    await radioGroup.updateComplete;
    arrowRight(radioGroup);
    expect(radioList[2].checked).to.be.false;
  });

  it('should not check radio button with keyboard if readonly', async () => {
    radioList[1].checked = true;
    radioGroup.readonly = true;
    await radioGroup.updateComplete;
    arrowRight(radioGroup);
    await radioGroup.updateComplete;
    expect(radioList[2].checked).to.be.false;
  });

  it('should focus and check previous/last radio button after left/up', async () => {
    radioList[1].checked = true;
    await radioGroup.updateComplete;

    arrowLeft(radioGroup);
    await radioGroup.updateComplete;

    expect(radioList[0].checked).to.be.true;
    expect(radioList[1].checked).to.be.false;

    arrowUp(radioGroup);
    await radioGroup.updateComplete;

    expect(radioList[2].checked).to.be.true;
    expect(radioList[0].checked).to.be.false;
  });

  it('should set focus-ring attribute on next/first radio button after right/down', async () => {
    radioList[1].focus();
    radioList[1].checked = true;
    await radioGroup.updateComplete;

    arrowRight(radioGroup);
    expect(radioList[2].hasAttribute('focus-ring')).to.be.true;

    arrowDown(radioGroup);
    expect(radioList[0].hasAttribute('focus-ring')).to.be.true;
  });

  it('should set focus-ring attribute on previous/last radio button after left/up', async () => {
    radioList[1].focus();
    radioList[1].checked = true;
    await radioGroup.updateComplete;

    arrowLeft(radioGroup);
    expect(radioList[0].hasAttribute('focus-ring')).to.be.true;

    arrowUp(radioGroup);
    expect(radioList[2].hasAttribute('focus-ring')).to.be.true;
  });

  it('should not have enabled buttons', async () => {
    for (let i = 0; i < radioList.length; i++) {
      radioList[i].disabled = true;
    }
    await radioGroup.updateComplete;
    expect(radioGroup._hasEnabledButtons()).to.be.false;

    radioList[1].disabled = false;
    await radioGroup.updateComplete;
    expect(radioGroup._hasEnabledButtons()).to.be.true;
  });

  it('should set proper value to radio-group', async () => {
    radioList[0].checked = true;
    await radioGroup.updateComplete;
    expect(radioGroup.value).to.eq('on');

    radioList[1].checked = true;
    await radioGroup.updateComplete;
    expect(radioGroup.value).to.eq('2');
  });

  it('should check proper button when value is set', async () => {
    radioGroup.value = '2';
    await radioGroup.updateComplete;
    expect(radioList[1].checked).to.be.true;

    radioGroup.value = 'on';
    await radioGroup.updateComplete;
    expect(radioList[0].checked).to.be.true;
  });

  it('should warn when setting value if there are no radio-buttons', async () => {
    const warn = { console };
    const spy = sinon.spy();
    console.warn = spy;
    radioGroup.value = 'nothing';
    await radioGroup.updateComplete;
    console.warn = warn;
    expect(spy.called).to.be.true;
  });

  it('should uncheck all the buttons when value is set to null', async () => {
    radioGroup.value = null;
    await radioGroup.updateComplete;
    expect(Array.from(radioList).every(radio => radio.checked === false)).to.be.true;
  });

  it('should uncheck all the buttons when value is set to empty string', async () => {
    radioGroup.value = '';
    await radioGroup.updateComplete;
    expect(Array.from(radioList).every(radio => radio.checked === false)).to.be.true;
  });

  it('should NOT steal focus from currently focused element', () => {
    const focusInput = document.createElement('input');
    document.body.appendChild(focusInput);
    focusInput.focus();
    radioGroup.value = '2';
    expect(document.activeElement).to.be.equal(focusInput);
    document.body.removeChild(focusInput);
  });

  it('should toggle has-label attribute when setting and removing label', async () => {
    radioGroup.label = 'foo';
    await radioGroup.updateComplete;
    expect(radioGroup.hasAttribute('has-label')).to.be.true;
    radioGroup.label = null;
    await radioGroup.updateComplete;
    expect(radioGroup.hasAttribute('has-label')).to.be.false;
  });

  it('should disable unchecked buttons when readonly', async () => {
    radioGroup.readonly = true;
    await radioGroup.updateComplete;
    expect(radioList[0].disabled).to.be.true;
    expect(radioList[1].disabled).to.be.true;
    expect(radioList[2].disabled).to.be.true;

    radioGroup.readonly = false;
    await radioGroup.updateComplete;
    expect(radioList[0].disabled).to.be.false;
    expect(radioList[1].disabled).to.be.false;
    expect(radioList[2].disabled).to.be.false;
  });

  it('should not have has-value attribute by default', () => {
    expect(radioGroup.hasAttribute('has-value')).to.be.false;
  });

  it('should toggle has-value attribute on value change', async () => {
    radioGroup.value = '2';
    await radioGroup.updateComplete;
    expect(radioGroup.hasAttribute('has-value')).to.be.true;

    radioGroup.value = null;
    await radioGroup.updateComplete;
    expect(radioGroup.hasAttribute('has-value')).to.be.false;
  });

  it('should pass validation when field is not required', () => {
    expect(radioGroup.checkValidity()).to.be.true;
    expect(radioGroup.invalid).to.be.false;
  });

  it('should not set invalid when field is required and user has not blurred yet', async () => {
    radioGroup.required = true;
    await radioGroup.updateComplete;
    expect(radioGroup.checkValidity()).to.be.false;
    expect(radioGroup.invalid).to.be.false;
  });

  it('should set invalid when calling validate()', () => {
    radioGroup.required = true;
    radioGroup.validate();
    expect(radioGroup.invalid).to.be.true;
  });

  it('should validate after changing selected option', async () => {
    radioGroup.required = true;
    radioGroup.validate();
    radioList[1].checked = true;
    await radioGroup.updateComplete;
    expect(radioGroup.invalid).to.be.false;
  });

  it('should set invalid when value is set to null', async () => {
    radioGroup.required = true;
    radioGroup.value = null;
    await radioGroup.updateComplete;
    expect(radioGroup.invalid).to.be.true;
  });

  it('should pass validation and set invalid when field is required and user blurs', async () => {
    radioGroup.required = true;
    await radioGroup.updateComplete;
    focusout(radioGroup);
    expect(radioGroup.checkValidity()).to.be.false;
    expect(radioGroup.invalid).to.be.true;
  });

  it('should set appropriate aria attributes and id on the error part', () => {
    const errorElement = radioGroup.shadowRoot.querySelector('[part="error-message"]');
    expect(errorElement.getAttribute('aria-live')).to.be.equal('assertive');
    expect(errorElement.getAttribute('aria-hidden')).to.be.equal('true');
    expect(/^lit-radio-group-error-\d+$/.test(errorElement.id)).to.be.true;
  });

  it('should remove aria-hidden when error is shown', async () => {
    const errorElement = radioGroup.shadowRoot.querySelector('[part="error-message"]');
    radioGroup.errorMessage = 'Bad input!';
    radioGroup.invalid = true;
    await radioGroup.updateComplete;
    expect(errorElement.getAttribute('aria-hidden')).to.be.equal('false');
  });

  it('should hide error message by default', async () => {
    const errorElement = radioGroup.shadowRoot.querySelector('[part="error-message"]');
    radioGroup.errorMessage = 'Bad input!';
    await radioGroup.updateComplete;
    expect(errorElement.offsetHeight).to.equal(0);
  });

  it('should show error message on invalid', async () => {
    const errorElement = radioGroup.shadowRoot.querySelector('[part="error-message"]');
    radioGroup.required = true;
    radioGroup.errorMessage = 'Bad input!';
    focusout(radioGroup);
    await radioGroup.updateComplete;
    expect(errorElement.offsetHeight).to.be.above(0);
  });
});

describe('radio-group with disabled button', () => {
  const fixture = html`
    <lit-radio-group>
      <lit-radio-button>Button <b>1</b></lit-radio-button>
      <lit-radio-button>Button <b>2</b></lit-radio-button>
      <lit-radio-button disabled>Button <b>3</b></lit-radio-button>
      <lit-radio-button>Button <b>4</b></lit-radio-button>
    </lit-radio-group>
  `;

  let radioGroup;
  let radioList;

  beforeEach(async () => {
    const div = document.createElement('div');
    render(fixture, div);
    radioGroup = div.firstElementChild;
    document.body.appendChild(radioGroup);
    await radioGroup.updateComplete;
    radioList = radioGroup.querySelectorAll('lit-radio-button');
    radioGroup._observer.flush();
  });

  afterEach(() => {
    radioGroup.parentNode.removeChild(radioGroup);
  });

  it('should miss disabled button after right/down', async () => {
    radioList[1].checked = true;
    await radioGroup.updateComplete;
    arrowRight(radioGroup);
    await radioGroup.updateComplete;
    expect(radioList[3].checked).to.be.true;
  });

  it('should miss disabled button after left/up', async () => {
    radioList[3].checked = true;
    await radioGroup.updateComplete;
    arrowLeft(radioGroup);
    await radioGroup.updateComplete;
    expect(radioList[1].checked).to.be.true;
  });
});

describe('radio-group with initial checked button', () => {
  const fixture = html`
    <lit-radio-group>
      <lit-radio-button>Button <b>1</b></lit-radio-button>
      <lit-radio-button value="1" checked>Button <b>2</b></lit-radio-button>
      <lit-radio-button value="2" checked>Button <b>3</b></lit-radio-button>
      <lit-radio-button>Button <b>4</b></lit-radio-button>
    </lit-radio-group>
  `;

  let radioGroup;
  let radioList;

  beforeEach(async () => {
    const div = document.createElement('div');
    render(fixture, div);
    radioGroup = div.firstElementChild;
    document.body.appendChild(radioGroup);
    await radioGroup.updateComplete;
    radioList = radioGroup.querySelectorAll('lit-radio-button');
    radioGroup._observer.flush();
  });

  afterEach(() => {
    radioGroup.parentNode.removeChild(radioGroup);
  });

  it('should reflect the value of initially checked radio button in radio group value', () => {
    expect(radioGroup.value).to.be.equal('2');
  });

  it('should set the last initially checked button value as the radio group value', () => {
    expect(radioList[1].checked).to.be.false;
    expect(radioList[2].checked).to.be.true;
    expect(radioGroup.value).to.be.equal('2');
  });

  it('should remove reset the value of radio group if the checked radio button is removed', async () => {
    const radioButton = radioList[2];
    radioGroup.removeChild(radioButton);
    radioGroup._observer.flush();
    await radioGroup.updateComplete;
    expect(radioGroup.value).to.not.be.equal('2');
  });
});
