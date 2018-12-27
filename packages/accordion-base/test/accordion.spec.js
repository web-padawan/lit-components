import { html } from '@polymer/lit-element';
import { render } from 'lit-html';
import { arrowDown, arrowDownIE, arrowUp, home, end } from '@lit/test-helpers';
import { AccordionBase, AccordionPanelBase } from '../lit-accordion-base.js';

customElements.define('lit-accordion', class extends AccordionBase {});
customElements.define('lit-accordion-panel', class extends AccordionPanelBase {});

describe('accordion', () => {
  const fixture = html`
    <lit-accordion>
      <lit-accordion-panel summary="Panel 1"><input /></lit-accordion-panel>
      <lit-accordion-panel summary="Panel 2">Content 2</lit-accordion-panel>
      <lit-accordion-panel summary="Panel 3">Content 3</lit-accordion-panel>
    </lit-accordion>
  `;

  let accordion;
  let heading;

  function getHeading(idx) {
    return accordion.items[idx].focusElement;
  }

  beforeEach(async () => {
    const div = document.createElement('div');
    render(fixture, div);
    accordion = div.firstElementChild;
    document.body.appendChild(accordion);
    await accordion.updateComplete;
  });

  afterEach(() => {
    if (accordion.parentNode) {
      accordion.parentNode.removeChild(accordion);
    }
  });

  describe('items', () => {
    it('should set `items` to the array of child panels', () => {
      expect(accordion.items).to.be.an('array');
      expect(accordion.items.length).to.be.equal(3);
    });

    it('should update `items` value when removing nodes', () => {
      accordion.removeChild(accordion.items[2]);
      accordion._observer.flush();
      expect(accordion.items.length).to.be.equal(2);
    });

    it('should update `items` value when adding nodes', async () => {
      const panel = document.createElement('lit-accordion-panel');
      accordion.appendChild(panel);
      await panel.updateComplete;
      await accordion.updateComplete;
      expect(accordion.items.length).to.be.equal(4);
    });

    it('should update `items` value when moving nodes', () => {
      const [p0, p2] = [accordion.items[0], accordion.items[2]];
      accordion.insertBefore(p2, p0);
      accordion._observer.flush();
      expect(accordion.items[0]).to.be.equal(p2);
      expect(accordion.items[1]).to.be.equal(p0);
    });
  });

  describe('focus', () => {
    beforeEach(() => accordion.focus());

    it('should focus the first panel heading by default', () => {
      expect(accordion.items[0].hasAttribute('focused')).to.be.true;
    });

    it('should move focus to next panel on "arrow-down" keydown', () => {
      heading = getHeading(0);
      arrowDown(heading);
      expect(accordion.items[1].hasAttribute('focused')).to.be.true;
    });

    it('should move focus when event.key name does not include the Arrow prefix (IE)', () => {
      heading = getHeading(0);
      arrowDownIE(heading);
      expect(accordion.items[1].hasAttribute('focused')).to.be.true;
    });

    it('should move focus to prev element on "arrow-up" keydown', () => {
      heading = getHeading(0);
      arrowDown(heading);
      heading = getHeading(1);
      arrowUp(heading);
      expect(accordion.items[0].hasAttribute('focused')).to.be.true;
    });

    it('should move focus to first element on "home" keydown', () => {
      accordion.items[2].focus();
      heading = getHeading(2);
      home(heading);
      expect(accordion.items[0].hasAttribute('focused')).to.be.true;
    });

    it('should move focus to second element if first is disabled on "home" keydown', () => {
      accordion.items[0].disabled = true;
      accordion.items[2].focus();
      heading = getHeading(2);
      home(heading);
      expect(accordion.items[1].hasAttribute('focused')).to.be.true;
    });

    it('should move focus to last element on "end" keydown', () => {
      heading = getHeading(0);
      end(heading);
      expect(accordion.items[2].hasAttribute('focused')).to.be.true;
    });

    it('should move focus to the closest enabled element if last is disabled on "end" keydown', () => {
      accordion.items[2].disabled = true;
      heading = getHeading(0);
      end(heading);
      expect(accordion.items[1].hasAttribute('focused')).to.be.true;
    });

    it('should move focus to first element on "arrow-down", if last element has focus', () => {
      accordion.items[2].focus();
      heading = getHeading(2);
      arrowDown(heading);
      expect(accordion.items[0].hasAttribute('focused')).to.be.true;
    });

    it('should move focus to last element on "arrow-up", if first element has focus', () => {
      heading = getHeading(0);
      arrowUp(heading);
      expect(accordion.items[2].hasAttribute('focused')).to.be.true;
    });

    it('should not move focus on keydown event from the panel content', () => {
      const spy = sinon.spy(accordion.items[1], 'focus');
      arrowDown(accordion.items[0].querySelector('input'));
      expect(spy).to.not.be.called;
    });

    it('should not throw when calling `focus()` before items are set', () => {
      const focus = () => document.createElement('lit-accordion').focus();
      expect(focus()).to.not.throw;
    });
  });

  describe('expanded', () => {
    it('should expand the first panel by default', () => {
      expect(accordion.expanded).to.equal(0);
      expect(accordion.items[0].expanded).to.be.true;
    });

    it('should update `expanded` to new index when other panel is expanded', async () => {
      getHeading(1).click();
      await accordion.updateComplete;
      expect(accordion.items[1].expanded).to.be.true;
      expect(accordion.expanded).to.equal(1);
    });

    it('should collapse currently expanded panel when other one is expanded', async () => {
      getHeading(1).click();
      await accordion.updateComplete;
      expect(accordion.items[1].expanded).to.be.true;
      expect(accordion.items[0].expanded).to.be.false;
    });

    it('should set `expanded` to null when the expanded panel is collapsed', async () => {
      getHeading(0).click();
      await accordion.updateComplete;
      expect(accordion.items[0].expanded).to.be.false;
      expect(accordion.expanded).to.equal(null);
    });

    it('should collapse currently expanded panel when `expanded` set to null', async () => {
      accordion.expanded = null;
      await accordion.updateComplete;
      expect(accordion.items[0].expanded).to.be.false;
    });

    it('should collapse the panel once other one is expanded', async () => {
      const panel = accordion.items[1];
      accordion.removeChild(panel);
      accordion._observer.flush();
      panel.expanded = true;
      await accordion.updateComplete;
      expect(accordion.expanded).to.equal(0);
    });
  });
});
