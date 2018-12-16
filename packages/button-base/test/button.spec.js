import { html } from '@polymer/lit-element';
import { render } from 'lit-html';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import {
  blur,
  down,
  up,
  downAndUp,
  enterDown,
  enterUp,
  spaceDown,
  spaceUp
} from '@lit/test-helpers';
import { ButtonBase } from '../lit-button-base.js';

customElements.define('lit-button', class extends ButtonBase {});

describe('button', () => {
  const fixture = html`
    <lit-button>Lit <i>Button</i></lit-button>
  `;

  let button;
  let nativeButton;
  let label;

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
    expect(children[0].textContent).to.be.equal('Lit ');
    expect(children[1].outerHTML).to.be.equal('<i>Button</i>');
  });

  it('can be disabled imperatively', async () => {
    button.disabled = true;
    await button.updateComplete;
    expect(nativeButton.hasAttribute('disabled')).to.be.eql(true);
  });

  it('should fire click event', done => {
    button.addEventListener('click', () => {
      done();
    });
    downAndUp(button);
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
    enterDown(button);
    expect(button.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute 500ms after enter', () => {
    enterDown(button);
    enterUp(button);
    expect(button.hasAttribute('active')).to.be.false;
  });

  it('should have active attribute on space', () => {
    spaceDown(button);
    expect(button.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute after space', () => {
    spaceDown(button);
    spaceUp(button);
    expect(button.hasAttribute('active')).to.be.false;
  });

  it('should not have active attribute when disabled', async () => {
    button.disabled = true;
    await button.updateComplete;
    down(button);
    enterDown(button);
    spaceDown(button);
    expect(button.hasAttribute('active')).to.be.false;
  });

  it('should not have active attribute when disconnected from the DOM', () => {
    spaceDown(button);
    button.parentNode.removeChild(button);
    window.ShadyDOM && window.ShadyDOM.flush();
    expect(button.hasAttribute('active')).to.be.false;
  });

  it('should not have active attribute after blur', () => {
    spaceDown(button);
    blur(button);
    expect(button.hasAttribute('active')).to.be.false;
  });
});
