import { LitElement, html } from '@polymer/lit-element';
import { render } from 'lit-html';
import { ItemMixin } from '@lit/item-mixin';
import { enter, spaceDown, spaceUp, space } from '../helpers/keys.js';

describe('item-mixin', () => {
  customElements.define(
    'x-item',
    class extends ItemMixin(LitElement) {
      render() {
        return html`
          <div>
            <slot></slot>
          </div>
        `;
      }
    }
  );

  function fire(target, type) {
    target.dispatchEvent(new CustomEvent(type, { composed: true, bubbles: true }));
  }

  let item;

  describe('with value', () => {
    const fixture = html`
      <x-item value="foo">text-content</x-item>
    `;

    beforeEach(async () => {
      const div = document.createElement('div');
      render(fixture, div);
      item = div.firstElementChild;
      document.body.appendChild(item);
      await item.updateComplete;
    });

    afterEach(() => {
      if (item.parentNode) {
        item.parentNode.removeChild(item);
      }
    });

    it('should have value property', () => {
      expect(item.value).to.be.equal('foo');
    });

    it('should not have focused attribute when not focused', () => {
      expect(item.hasAttribute('focused')).to.be.false;
    });

    it('should have focused attribute when focused', () => {
      fire(item, 'focus');
      expect(item.hasAttribute('focused')).to.be.true;
    });

    it('should not have focused attribute when blurred', () => {
      fire(item, 'focus');
      fire(item, 'blur');
      expect(item.hasAttribute('focused')).to.be.false;
    });

    it('should have active attribute on mousedown', () => {
      fire(item, 'mousedown');
      expect(item.hasAttribute('active')).to.be.true;
      expect(item._mousedown).to.be.true;
    });

    it('should not have active attribute after mouseup', () => {
      fire(item, 'mousedown');
      fire(item, 'mouseup');
      expect(item.hasAttribute('active')).to.be.false;
      expect(item._mousedown).to.be.false;
    });

    it('should have active attribute on space down', () => {
      spaceDown(item);
      expect(item.hasAttribute('active')).to.be.true;
    });

    it('should not have active attribute after space up', () => {
      spaceDown(item);
      spaceUp(item);
      expect(item.hasAttribute('active')).to.be.false;
    });

    it('should not have active attribute when disconnected from the DOM', () => {
      spaceDown(item);
      item.parentNode.removeChild(item);
      window.ShadyDOM && window.ShadyDOM.flush();
      expect(item.hasAttribute('active')).to.be.false;
    });

    it('should not have focus-ring if not focused', () => {
      expect(item.hasAttribute('focus-ring')).to.be.false;
    });

    it('should not have focus-ring attribute when not focused with keyboard', () => {
      item.click();
      expect(item.hasAttribute('focus-ring')).to.be.false;
    });

    it('should have focus-ring attribute when focused with keyboard', () => {
      fire(item, 'focus');
      expect(item.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not have focus-ring after blur', () => {
      fire(item, 'focus');
      fire(item, 'blur');
      expect(item.hasAttribute('focus-ring')).to.be.false;
    });

    it('set this._mousedown to false if mouseup was outside', () => {
      fire(item, 'mousedown');
      expect(item._mousedown).to.be.true;
      fire(document, 'mouseup');
      expect(item._mousedown).to.be.false;
    });

    it('should be not selected if disabled', () => {
      space(item);
      item.disabled = true;
      expect(item.selected).to.be.false;
    });

    it('should not be selectable if disabled', async () => {
      item.disabled = true;
      await item.updateComplete;
      space(item);
      expect(item.selected).to.be.false;
    });

    it('should have aria-disabled when disabled', async () => {
      item.disabled = true;
      await item.updateComplete;
      expect(item.getAttribute('aria-disabled')).to.equal('true');

      item.disabled = false;
      await item.updateComplete;
      expect(item.getAttribute('aria-disabled')).to.be.null;
    });

    it('should unselect the current item', () => {
      item.click();
      item.click();
      expect(item.selected).to.be.false;
    });

    it('should fire click event when it is selected with keyboard', () => {
      const clickSpy = sinon.spy();
      item.addEventListener('click', clickSpy);
      enter(item);
      expect(clickSpy).to.be.calledOnce;
    });

    it('should not fire click event if keyup does not happen after a keydown in the element', () => {
      const clickSpy = sinon.spy();
      item.addEventListener('click', clickSpy);
      spaceUp(item);
      expect(clickSpy).not.to.be.called;
    });
  });

  describe('without value', () => {
    const fixture = html`
      <x-item>text-content</x-item>
    `;

    beforeEach(async () => {
      const div = document.createElement('div');
      render(fixture, div);
      item = div.firstElementChild;
      document.body.appendChild(item);
      await item.updateComplete;
    });

    afterEach(() => {
      item.parentNode.removeChild(item);
    });

    it('should use trimmed textContent', () => {
      expect(item.value).to.equal('text-content');
    });

    it('should reflect changes of content', () => {
      item.innerHTML = 'foo';
      expect(item.value).to.equal('foo');
    });
  });

  describe('with clickable child', () => {
    const fixture = html`
      <x-item>
        <button>text-content</button>
      </x-item>
    `;

    beforeEach(async () => {
      const div = document.createElement('div');
      render(fixture, div);
      item = div.firstElementChild;
      document.body.appendChild(item);
      await item.updateComplete;
    });

    afterEach(() => {
      item.parentNode.removeChild(item);
    });

    it('should not set active attribute if keydown was prevented', () => {
      const button = item.querySelector('button');
      button.addEventListener('keydown', e => {
        e.preventDefault();
      });
      spaceDown(button);
      expect(item.hasAttribute('active')).to.be.false;
    });
  });
});
