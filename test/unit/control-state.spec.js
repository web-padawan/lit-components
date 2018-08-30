import '@polymer/iron-test-helpers/mock-interactions.js';
import { ControlStateMixin } from '@lit/control-state-mixin';
import { html, LitElement } from '@polymer/lit-element';

class TestWrapper extends ControlStateMixin(LitElement) {
  render() {
    return html`
      <test-element id="testElement"></test-element>
    `;
  }

  get focusElement() {
    return this.shadowRoot.querySelector('#testElement');
  }
}

customElements.define('test-wrapper', TestWrapper);

class TestElement extends ControlStateMixin(LitElement) {
  render() {
    return html`
      <input id="input">
      <input id="secondInput">
    `;
  }

  get focusElement() {
    return this.shadowRoot.querySelector('#input');
  }
}

customElements.define('test-element', TestElement);

describe('control-state-mixin', () => {
  let customElement, focusElement, secondFocusableElement;

  const focusin = () => {
    focusElement.dispatchEvent(new CustomEvent('focusin', { composed: true, bubbles: true }));
  };

  const focusout = () => {
    focusElement.dispatchEvent(new CustomEvent('focusout', { composed: true, bubbles: true }));
  };

  beforeEach(async () => {
    customElement = document.createElement('test-element');
    document.body.appendChild(customElement);
    await customElement.updateComplete;
    focusElement = customElement.focusElement;
    secondFocusableElement = customElement.shadowRoot.querySelector('#secondInput');
  });

  afterEach(() => {
    if (customElement && customElement.parentNode) {
      customElement.parentNode.removeChild(customElement);
    }
  });

  describe('tabindex', () => {
    it('setting tabIndex should forward the value to the internal element', async () => {
      customElement.tabIndex = 1;
      await customElement.updateComplete;
      expect(focusElement.getAttribute('tabindex')).to.be.equal('1');
    });

    it('we always need a tabindex by default', () => {
      expect(customElement.getAttribute('tabindex')).to.be.equal('0');
    });

    it('setting tabIndex should update the attribute', async () => {
      customElement.tabIndex = 1;
      await customElement.updateComplete;
      expect(customElement.getAttribute('tabindex')).to.be.equal('1');
    });

    it('enabling the element should restore old tabindex', async () => {
      customElement.tabIndex = 1;
      customElement.disabled = true;
      await customElement.updateComplete;
      expect(customElement.getAttribute('tabindex')).to.not.be.ok;

      customElement.disabled = false;
      await customElement.updateComplete;
      expect(customElement.getAttribute('tabindex')).to.be.equal('1');
    });

    it('setting disabled to true should remove tabindex', async () => {
      customElement.tabIndex = 1;
      customElement.disabled = true;
      await customElement.updateComplete;
      expect(customElement.getAttribute('tabindex')).to.not.be.ok;
    });

    it('setting disabled to true and then back to false should restore the previous value of tabindex', async () => {
      customElement.tabIndex = 2;
      customElement.disabled = true;
      await customElement.updateComplete;
      expect(customElement.getAttribute('tabindex')).to.not.be.ok;

      customElement.disabled = false;
      await customElement.updateComplete;
      expect(customElement.getAttribute('tabindex')).to.be.equal('2');
    });
  });

  describe('_tabPressed and focus-ring', () => {
    it('should set and unset _tabPressed when press TAB', () => {
      MockInteractions.keyDownOn(document.body, 9);
      expect(customElement._tabPressed).to.be.true;
      MockInteractions.keyUpOn(document.body, 9);
      expect(customElement._tabPressed).to.be.false;
    });

    it('should set and unset _tabPressed when press SHIFT+TAB', () => {
      MockInteractions.keyDownOn(document.body, 9, 'shift');
      expect(customElement._tabPressed).to.be.true;
      MockInteractions.keyUpOn(document.body, 9, 'shift');
      expect(customElement._tabPressed).to.be.false;
    });

    it('should set _isShiftTabbing when pressing shift-tab', () => {
      const event = MockInteractions.keyboardEventFor('keydown', 9, 'shift');
      customElement.dispatchEvent(event);
      expect(customElement._isShiftTabbing).to.be.true;
    });

    it('should skip setting _isShiftTabbing if event is defaultPrevented', () => {
      const evt = MockInteractions.keyboardEventFor('keydown', 9, 'shift');
      // In Edge just calling preventDefault() does not work because of the polyfilled dispatchEvent
      Object.defineProperty(evt, 'defaultPrevented', {
        get() {
          return true;
        }
      });
      customElement.dispatchEvent(evt);
      expect(customElement._isShiftTabbing).not.to.be.ok;
    });

    it('should not change _tabPressed on any other key except TAB', () => {
      MockInteractions.keyDownOn(document.body, 65);
      expect(customElement._tabPressed).to.be.false;
      MockInteractions.keyUpOn(document.body, 65);
      expect(customElement._tabPressed).to.be.false;
    });

    it('should set the focus-ring attribute when TAB is pressed and focus is received', () => {
      MockInteractions.keyDownOn(document.body, 9);
      focusin();
      expect(customElement.hasAttribute('focus-ring')).to.be.true;
      focusout();
      expect(customElement.hasAttribute('focus-ring')).to.be.false;
    });

    it('should set the focus-ring attribute when SHIFT+TAB is pressed and focus is received', () => {
      MockInteractions.keyDownOn(document.body, 9, 'shift');
      focusin();
      expect(customElement.hasAttribute('focus-ring')).to.be.true;
      focusout();
      expect(customElement.hasAttribute('focus-ring')).to.be.false;
    });

    it('should refocus the field', done => {
      customElement.dispatchEvent(new CustomEvent('focusin'));
      MockInteractions.keyDownOn(customElement, 9, 'shift');

      // Shift + Tab disables refocusing temporarily, normal behavior is restored asynchronously.
      setTimeout(() => {
        var spy = sinon.spy(focusElement, 'focus');
        customElement.dispatchEvent(new CustomEvent('focusin'));
        expect(spy.called).to.be.true;
        done();
      }, 0);
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      customElement.disabled = true;
      await customElement.updateComplete;
    });

    it('should not have tabindex if disabled when first update completed', () => {
      expect(customElement.getAttribute('tabindex')).to.not.be.ok;
    });

    it('should update internal element tabIndex', async () => {
      customElement.tabIndex = 4;
      await customElement.updateComplete;
      expect(customElement.getAttribute('tabindex')).to.be.null;
      expect(focusElement.getAttribute('tabindex')).to.be.equal('4');
    });

    it('should have aria-disabled attribute set to true when disabled', async () => {
      expect(customElement.getAttribute('aria-disabled')).to.be.equal('true');
    });

    it('should not have aria-disabled attribute when is not disabled', async () => {
      customElement.disabled = false;
      await customElement.updateComplete;
      expect(customElement.getAttribute('aria-disabled')).to.not.be.ok;
    });

    it('should apply tabindex value, changed while element was disabled, once it is enabled', async () => {
      customElement.tabIndex = 3;
      await customElement.updateComplete;
      expect(customElement.getAttribute('tabindex')).to.not.be.ok;

      customElement.disabled = false;
      await customElement.updateComplete;
      expect(customElement.getAttribute('tabindex')).to.be.equal('3');
    });
  });

  describe('focus', () => {
    it('should not set focused attribute on host click', () => {
      customElement.click();
      expect(customElement.hasAttribute('focused')).to.be.false;
    });

    it('should set focused attribute on focusin event dispatched', () => {
      focusin();
      expect(customElement.hasAttribute('focused')).to.be.true;
    });

    it('should not set focused attribute on focusin event dispatched when disabled', () => {
      customElement.disabled = true;
      focusin();
      expect(customElement.hasAttribute('focused')).to.be.false;
    });

    it('should not set focused attribute on focusin event dispatched from other focusable element inside component', () => {
      secondFocusableElement.dispatchEvent(
        new CustomEvent('focusin', { composed: true, bubbles: true })
      );
      expect(customElement.hasAttribute('focused')).to.be.false;
    });

    it('should remove focused attribute when disconnected from the DOM', () => {
      focusin();
      customElement.parentNode.removeChild(customElement);
      window.ShadyDOM && window.ShadyDOM.flush();
      expect(customElement.hasAttribute('focused')).to.be.false;
    });
  });
});

describe('autofocus', () => {
  let customElement;

  beforeEach(async () => {
    customElement = document.createElement('test-element');
    customElement.setAttribute('autofocus', '');
    document.body.appendChild(customElement);
    await customElement.updateComplete;
  });

  afterEach(() => {
    if (customElement && customElement.parentNode) {
      customElement.parentNode.removeChild(customElement);
    }
  });

  it('should have focused and focus-ring set', done => {
    window.requestAnimationFrame(() => {
      expect(customElement.hasAttribute('focused')).to.be.true;
      expect(customElement.hasAttribute('focus-ring')).to.be.true;
      done();
    });
  });
});

describe('focused with nested focusable elements', () => {
  let customElementWrapper, customElement, focusElement;

  const focusin = () => {
    focusElement.dispatchEvent(new CustomEvent('focusin', { composed: true, bubbles: true }));
  };

  const focusout = () => {
    focusElement.dispatchEvent(new CustomEvent('focusout', { composed: true, bubbles: true }));
  };

  beforeEach(async () => {
    customElementWrapper = document.createElement('test-wrapper');
    document.body.appendChild(customElementWrapper);
    await customElementWrapper.updateComplete;
    customElement = customElementWrapper.focusElement;
    await customElement.updateComplete;
    focusElement = customElement.focusElement;
  });

  afterEach(() => {
    document.body.removeChild(customElementWrapper);
  });

  it('should set focused attribute on focusin event dispatched from an element inside focusElement', () => {
    focusin();
    expect(customElementWrapper.hasAttribute('focused')).to.be.true;
  });

  it('should remove focused attribute on focusout event dispatched from an element inside focusElement', () => {
    focusin();
    expect(customElementWrapper.hasAttribute('focused')).to.be.true;

    focusout();
    expect(customElementWrapper.hasAttribute('focused')).to.be.false;
  });
});
