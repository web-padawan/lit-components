import { defineCE, fixture } from '@open-wc/testing-helpers';
import '@polymer/iron-form/iron-form.js';
import { CheckboxBase } from '@lit/checkbox-base';
import { focusout } from '@lit/test-helpers';
import { CheckboxGroupBase } from '../lit-checkbox-group-base.js';

const Checkbox = defineCE(class extends CheckboxBase {});
const CheckboxGroup = defineCE(class extends CheckboxGroupBase {});

describe('checkbox group', () => {
  let checkboxGroup;
  let checkboxList;

  beforeEach(async () => {
    checkboxGroup = await fixture(`
      <${CheckboxGroup}>
        <${Checkbox} value="1">Checkbox <b>1</b></${Checkbox}>
        <${Checkbox} value="2">Checkbox <b>2</b></${Checkbox}>
        <${Checkbox} value="3">Checkbox <b>3</b></${Checkbox}>
      </${CheckboxGroup}>
    `);
    await checkboxGroup.updateComplete;
    checkboxGroup._observer.flush();
    checkboxList = checkboxGroup.querySelectorAll(`${Checkbox}`);
  });

  it('should change aria-disabled on disabled change', async () => {
    checkboxGroup.disabled = true;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.getAttribute('aria-disabled')).to.eq('true');
  });

  it('should set disabled property on the checkboxes when disabled', async () => {
    checkboxGroup.disabled = true;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.hasAttribute('disabled')).to.be.true;
    expect(checkboxList[0].disabled).to.be.true;
  });

  it('should set disabled property to dynamically added checkboxes', async () => {
    checkboxGroup.disabled = true;
    const checkbox = document.createElement(Checkbox);
    checkbox.setAttribute('value', '4');
    checkboxGroup.appendChild(checkbox);
    await checkboxGroup.updateComplete;
    expect(checkbox.disabled).to.be.true;
  });

  it('should warn if dynamically added checkbox does not have value attribute', async () => {
    const stub = sinon.stub(console, 'warn');
    const checkbox = document.createElement(Checkbox);
    checkboxGroup.appendChild(checkbox);
    checkboxGroup._observer.flush();
    await checkbox.updateComplete;
    await checkboxGroup.updateComplete;
    expect(stub.called).to.be.true;
  });

  it('should add dynamically added checked checkbox value to checkbox group value', async () => {
    const checkbox = document.createElement(Checkbox);
    checkbox.value = '4';
    checkbox.checked = true;
    checkboxGroup.appendChild(checkbox);
    await checkbox.updateComplete;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.value).to.include('4');
  });

  it('should remove checked checkbox value from checkbox group value, when checkbox is removed', async () => {
    const checkbox = checkboxList[0];
    checkbox.checked = true;
    checkboxGroup.removeChild(checkbox);
    checkboxGroup._observer.flush();
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.value).to.not.include('1');
  });

  it('should create new array instance for checkbox group value when checkbox is added', async () => {
    const value = { checkboxGroup };
    const checkbox = document.createElement(Checkbox);
    checkbox.setAttribute('value', 'new');
    checkbox.setAttribute('checked', '');
    checkboxGroup.appendChild(checkbox);
    await checkbox.updateComplete;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.value).to.not.equal(value);
  });

  it('should create new array instance for checkbox group value when checkbox is removed', async () => {
    const value = { checkboxGroup };
    const checkbox = checkboxList[0];
    checkbox.checked = true;
    checkboxGroup.removeChild(checkbox);
    checkboxGroup._observer.flush();
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.value).to.not.equal(value);
  });

  it('should not change checkbox group value if a removed checkbox is checked', async () => {
    const checkbox = checkboxList[0];
    checkboxGroup.removeChild(checkbox);
    checkboxGroup._observer.flush();
    checkbox.checked = true;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.value).to.not.include('1');
  });

  it('should set proper value when a checkbox is checked', async () => {
    checkboxList[0].checked = true;
    await checkboxList[0].updateComplete;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.value).to.deep.equal(['1']);

    checkboxList[1].checked = true;
    await checkboxList[1].updateComplete;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.value).to.deep.equal(['1', '2']);
  });

  it('should set proper value when a checkbox is unchecked', async () => {
    checkboxList[0].checked = true;
    checkboxList[1].checked = true;
    await Promise.all([checkboxList[0].updateComplete, checkboxList[1].updateComplete]);
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.value).to.deep.equal(['1', '2']);

    checkboxList[1].checked = false;
    await checkboxList[1].updateComplete;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.value).to.deep.equal(['1']);
  });

  it('should check proper checkbox when value is set', async () => {
    checkboxGroup.value = ['2'];
    await checkboxGroup.updateComplete;
    expect(checkboxList[1].checked).to.be.true;

    checkboxGroup.value = ['1', '3'];
    await checkboxGroup.updateComplete;
    expect(checkboxList[0].checked).to.be.true;
    expect(checkboxList[2].checked).to.be.true;
  });

  it('should uncheck proper checkbox when value is removed', async () => {
    checkboxGroup.value = ['1', '3'];
    await checkboxGroup.updateComplete;
    expect(checkboxList[0].checked).to.be.true;
    expect(checkboxList[2].checked).to.be.true;

    checkboxGroup.value = ['1'];
    await checkboxGroup.updateComplete;
    expect(checkboxList[0].checked).to.be.true;
    expect(checkboxList[2].checked).to.be.false;
  });

  it('should dispatch `value-changed` event when value changes', async () => {
    const spy = sinon.spy();
    checkboxGroup.addEventListener('value-changed', spy);
    checkboxList[0].checked = true;
    await checkboxList[0].updateComplete;
    await checkboxGroup.updateComplete;
    expect(spy).to.be.calledOnce;
  });

  it('should NOT steal focus from currently focused element', () => {
    const focusInput = document.createElement('input');
    document.body.appendChild(focusInput);
    focusInput.focus();
    checkboxGroup.value = ['2'];
    expect(document.activeElement).to.be.equal(focusInput);
    document.body.removeChild(focusInput);
  });

  it('should update has-label attribute when setting label', async () => {
    checkboxGroup.label = 'foo';
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.hasAttribute('has-label')).to.be.true;
    expect(checkboxGroup.label).to.be.equal('foo');
    checkboxGroup.label = undefined;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.hasAttribute('has-label')).to.be.false;
  });

  it('should not have has-value attribute by default', () => {
    expect(checkboxGroup.hasAttribute('has-value')).to.be.false;
  });

  it('should toggle has-value attribute on value change', async () => {
    checkboxGroup.value = ['2'];
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.hasAttribute('has-value')).to.be.true;
    checkboxGroup.value = [];
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.hasAttribute('has-value')).to.be.false;
  });

  it('should add label to checkbox group when a label is dynamically set', async () => {
    checkboxGroup.label = 'foo';
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.shadowRoot.querySelector('label').innerText).to.be.equal('foo');
  });

  it('should be possible to uncheck the checkbox on reattaching of the group', async () => {
    const container = checkboxGroup.parentElement;

    container.removeChild(checkboxGroup);
    container.appendChild(checkboxGroup);

    checkboxGroup._observer.flush();
    checkboxList[0].checked = true;
    checkboxList[0].checked = false;
    await checkboxGroup.updateComplete;

    expect(checkboxList[0].checked).to.be.false;
  });
});

describe('checkbox group validation', () => {
  let checkboxGroup;
  let checkboxList;
  let ironForm;

  beforeEach(async () => {
    ironForm = await fixture(`
      <iron-form>
        <form>
          <${CheckboxGroup}>
            <${Checkbox} name="language" value="en">English</${Checkbox}>
            <${Checkbox} name="language" value="fr">Français</${Checkbox}>
            <${Checkbox} name="language" value="de">Deutsch</${Checkbox}>
          </${CheckboxGroup}>
        </form>
      </iron-form>
    `);
    checkboxGroup = ironForm.querySelector(CheckboxGroup);
    await checkboxGroup.updateComplete;
    checkboxGroup._observer.flush();
    checkboxList = checkboxGroup.querySelectorAll(Checkbox);
  });

  it('should not have invalid attribute initially', () => {
    expect(checkboxGroup.hasAttribute('invalid')).to.be.false;
  });

  it('should not add invalid attribute if required attribute is not present', async () => {
    checkboxList[0].checked = true;
    checkboxList[0].checked = false;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.hasAttribute('invalid')).to.be.false;
  });

  it('should add invalid attribute if required attribute is present and value is empty', async () => {
    checkboxGroup.required = true;
    checkboxList[0].checked = true;
    checkboxList[0].checked = false;
    await checkboxList[0].updateComplete;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.hasAttribute('invalid')).to.be.true;
  });

  it('should dispatch `invalid-changed` event when invalid changes', async () => {
    const spy = sinon.spy();
    checkboxGroup.addEventListener('invalid-changed', spy);
    checkboxGroup.required = true;
    checkboxList[0].checked = true;
    checkboxList[0].checked = false;
    await checkboxList[0].updateComplete;
    await checkboxGroup.updateComplete;
    expect(spy).to.be.calledOnce;
  });

  it('should remove invalid attribute if value is not empty', async () => {
    checkboxGroup.required = true;
    checkboxList[0].checked = true;
    await checkboxList[0].updateComplete;
    await checkboxGroup.updateComplete;

    checkboxList[0].checked = false;
    await checkboxList[0].updateComplete;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.hasAttribute('invalid')).to.be.true;

    checkboxList[0].checked = true;
    await checkboxList[0].updateComplete;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.hasAttribute('invalid')).to.be.false;
  });

  it('should run validation and set invalid on blur when required', () => {
    checkboxGroup.required = true;
    focusout(checkboxGroup, document.body);
    expect(checkboxGroup.invalid).to.be.true;
  });

  it('should not run validation while tabbing between checkboxes', () => {
    checkboxGroup.required = true;
    const spy = sinon.spy(checkboxGroup, 'validate');
    focusout(checkboxGroup, checkboxList[1].focusElement);
    expect(spy).to.be.not.called;
  });

  it('should prevent submitting form when value is empty', () => {
    checkboxGroup.required = true;
    expect(ironForm.validate()).to.be.false;
  });

  it('should not prevent submitting form when value is not empty or required is false', async () => {
    expect(ironForm.validate()).to.be.true;

    checkboxGroup.required = true;
    checkboxGroup.value = ['en'];
    await checkboxGroup.updateComplete;

    expect(ironForm.validate()).to.be.true;
  });

  it('should not show the error message initially', async () => {
    checkboxGroup.errorMessage = 'Error message';
    await checkboxGroup.updateComplete;
    expect(
      checkboxGroup.shadowRoot.querySelector('[part="error-message"]').getAttribute('aria-hidden')
    ).to.be.equal('true');
  });

  it('should show the error message if validation status is invalid', async () => {
    checkboxGroup.errorMessage = 'Error message';
    checkboxGroup.invalid = true;
    await checkboxGroup.updateComplete;
    expect(
      checkboxGroup.shadowRoot.querySelector('[part="error-message"]').getAttribute('aria-hidden')
    ).to.be.equal('false');
  });
});
