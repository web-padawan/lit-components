import { html } from '@polymer/lit-element';
import { render } from 'lit-html';
import '@polymer/iron-test-helpers/mock-interactions.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { ButtonBase } from '@lit/button-base';

customElements.define('lit-button', class extends ButtonBase {});

describe('button', () => {
  const fixture = html`
    <lit-button>Lit <i>Button</i></lit-button>
  `;

  const down = node => {
    node.dispatchEvent(new CustomEvent('down'));
  };

  const up = node => {
    node.dispatchEvent(new CustomEvent('up'));
  };

  let button, nativeButton, label;

  beforeEach(async () => {
    const div = document.createElement('div');
    render(fixture, div);
    button = div.firstElementChild;
    document.body.appendChild(button);
    await button.updateComplete;
    nativeButton = button.shadowRoot.querySelector('button');
    label = button.shadowRoot.querySelector('[part="label"]');
  });

  afterEach(() => {
    if (button.parentNode) {
      button.parentNode.removeChild(button);
    }
  });

  it('should define button label using light DOM', () => {
    const children = FlattenedNodesObserver.getFlattenedNodes(label);
    expect(children[1].textContent).to.be.equal('Lit ');
    expect(children[2].outerHTML).to.be.equal('<i>Button</i>');
  });

  it('can be disabled imperatively', async () => {
    button.disabled = true;
    await button.updateComplete;
    expect(nativeButton.hasAttribute('disabled')).to.be.eql(true);
  });

  it('fires click event', function(done) {
    button.addEventListener('click', () => {
      done();
    });
    MockInteractions.downAndUp(button);
  });

  it('host should have the `button` role', () => {
    expect(button.getAttribute('role')).to.be.eql('button');
  });

  it('native button should have type="button"', () => {
    expect(nativeButton.getAttribute('type')).to.be.eql('button');
  });

  it('native button should have the `presentation` role', () => {
    expect(nativeButton.getAttribute('role')).to.be.eql('presentation');
  });

  it('should have active attribute on down', () => {
    down(button);

    expect(button.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute after up', () => {
    down(button);

    up(button);

    expect(button.hasAttribute('active')).to.be.false;
  });

  it('should have active attribute on enter', () => {
    MockInteractions.keyDownOn(button, 13);

    expect(button.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute 500ms after enter', () => {
    MockInteractions.keyDownOn(button, 13);

    MockInteractions.keyUpOn(button, 13);

    expect(button.hasAttribute('active')).to.be.false;
  });

  it('should have active attribute on space', () => {
    MockInteractions.keyDownOn(button, 32);

    expect(button.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute after space', () => {
    MockInteractions.keyDownOn(button, 32);

    MockInteractions.keyUpOn(button, 32);

    expect(button.hasAttribute('active')).to.be.false;
  });

  it('should not have active attribute when disabled', async () => {
    button.disabled = true;
    await button.updateComplete;
    down(button);
    MockInteractions.keyDownOn(button, 13);
    MockInteractions.keyDownOn(button, 32);

    expect(button.hasAttribute('active')).to.be.false;
  });

  it('should not have active attribute when disconnected from the DOM', () => {
    MockInteractions.keyDownOn(button, 32);
    button.parentNode.removeChild(button);
    window.ShadyDOM && window.ShadyDOM.flush();
    expect(button.hasAttribute('active')).to.be.false;
  });

  it('should not have active attribute after blur', () => {
    MockInteractions.keyDownOn(button, 32);
    button.dispatchEvent(new CustomEvent('blur'));
    expect(button.hasAttribute('active')).to.be.false;
  });
});
