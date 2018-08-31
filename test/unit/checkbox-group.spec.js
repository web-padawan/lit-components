import { html } from '@polymer/lit-element';
import { render } from 'lit-html';
import '@polymer/iron-test-helpers/mock-interactions.js';
import '@polymer/iron-form/iron-form.js';
import { CheckboxBase } from '@lit/checkbox-base';
import { CheckboxGroupBase } from '@lit/checkbox-group-base';

if (!customElements.get('lit-checkbox')) {
  customElements.define('lit-checkbox', class extends CheckboxBase {});
}

customElements.define('lit-checkbox-group', class extends CheckboxGroupBase {});

describe('checkbox group', () => {
  const fixture = html`
    <lit-checkbox-group>
      <lit-checkbox value="1">Checkbox <b>1</b></lit-checkbox>
      <lit-checkbox value="2">Checkbox <b>2</b></lit-checkbox>
      <lit-checkbox value="3">Checkbox <b>3</b></lit-checkbox>
    </lit-checkbox-group>
  `;

  let checkboxGroup, checkboxList;

  beforeEach(async () => {
    const div = document.createElement('div');
    render(fixture, div);
    checkboxGroup = div.firstElementChild;
    document.body.appendChild(checkboxGroup);
    await checkboxGroup.updateComplete;
    checkboxGroup._observer.flush();
    checkboxList = checkboxGroup.querySelectorAll('lit-checkbox');
  });

  afterEach(() => {
    checkboxGroup.parentNode.removeChild(checkboxGroup);
  });

  it('sets role properly', () => {
    expect(checkboxGroup.getAttribute('role')).to.eq('checkboxgroup');
  });

  it('changes aria-disabled on disabled change', async () => {
    checkboxGroup.disabled = true;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.getAttribute('aria-disabled')).to.eq('true');
  });

  it('can be disabled imperatively', async () => {
    checkboxGroup.disabled = true;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.hasAttribute('disabled')).to.be.true;
    expect(checkboxList[0].hasAttribute('disabled')).to.be.true;
  });

  it('should set disabled property to dynamically added checkboxes', async () => {
    checkboxGroup.disabled = true;
    const checkbox = document.createElement('lit-checkbox');
    checkbox.setAttribute('value', '4');
    checkboxGroup.appendChild(checkbox);
    await checkboxGroup.updateComplete;
    expect(checkbox.disabled).to.be.true;
  });

  it('should warn if dynamically added checkbox does not have value attribute', async () => {
    const warn = console.warn;
    const spy = (console.warn = sinon.spy());
    const checkbox = document.createElement('lit-checkbox');
    checkboxGroup.appendChild(checkbox);
    await checkboxGroup.updateComplete;
    console.warn = warn;
    expect(spy.called).to.be.true;
  });

  it('should add dynamically added checked checkbox value to checkbox group value', async () => {
    const checkbox = document.createElement('lit-checkbox');
    // TODO: only works when setting as attributes
    checkbox.setAttribute('value', '4');
    checkbox.setAttribute('checked', '');
    checkboxGroup.appendChild(checkbox);
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
    const value = checkboxGroup.value;
    const checkbox = document.createElement('lit-checkbox');
    checkbox.setAttribute('value', 'new');
    checkbox.setAttribute('checked', '');
    checkboxGroup.appendChild(checkbox);
    await checkbox.updateComplete;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.value).to.not.equal(value);
  });

  it('should create new array instance for checkbox group value when checkbox is removed', async () => {
    const value = checkboxGroup.value;
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
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.value).to.deep.equal(['1']);

    checkboxList[1].checked = true;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.value).to.deep.equal(['1', '2']);
  });

  it('should set proper value when a checkbox is unchecked', async () => {
    checkboxList[0].checked = true;
    checkboxList[1].checked = true;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.value).to.deep.equal(['1', '2']);

    checkboxList[1].checked = false;
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
    expect(checkboxGroup.hasAttribute('has-label')).to.be.false;

    checkboxGroup.label = 'foo';
    await checkboxGroup.updateComplete;

    expect(checkboxGroup.hasAttribute('has-label')).to.be.true;
    expect(checkboxGroup.label).to.be.equal('foo');
  });

  it('should not have the has-value attribute by default', () => {
    expect(checkboxGroup.hasAttribute('has-value')).to.be.false;
  });

  it('should change the has-value attribute on value', async () => {
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
  let checkboxGroup, checkboxList, ironForm;

  const fixture = html`
    <iron-form>
      <form>
        <lit-checkbox-group>
          <lit-checkbox name="language" value="en">English</lit-checkbox>
          <lit-checkbox name="language" value="fr">Français</lit-checkbox>
          <lit-checkbox name="language" value="de">Deutsch</lit-checkbox>
        </lit-checkbox-group>
      </form>
    </iron-form>
  `;

  beforeEach(async () => {
    const div = document.createElement('div');
    render(fixture, div);
    ironForm = div.firstElementChild;
    document.body.appendChild(ironForm);
    checkboxGroup = ironForm.querySelector('lit-checkbox-group');
    await checkboxGroup.updateComplete;
    checkboxGroup._observer.flush();
    checkboxList = checkboxGroup.querySelectorAll('lit-checkbox');
  });

  afterEach(() => {
    ironForm.parentNode.removeChild(ironForm);
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
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.hasAttribute('invalid')).to.be.true;
  });

  it('should dispatch `invalid-changed` event when invalid changes', async () => {
    const spy = sinon.spy();
    checkboxGroup.addEventListener('invalid-changed', spy);
    checkboxGroup.required = true;
    checkboxList[0].checked = true;
    checkboxList[0].checked = false;
    await checkboxGroup.updateComplete;
    expect(spy).to.be.calledOnce;
  });

  it('should remove invalid attribute if value is not empty', async () => {
    checkboxGroup.required = true;
    checkboxList[0].checked = true;
    await checkboxGroup.updateComplete;

    checkboxList[0].checked = false;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.hasAttribute('invalid')).to.be.true;

    checkboxList[0].checked = true;
    await checkboxGroup.updateComplete;
    expect(checkboxGroup.hasAttribute('invalid')).to.be.false;
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
