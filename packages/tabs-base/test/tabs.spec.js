import { defineCE, fixture } from '@open-wc/testing-helpers';
import { TabBase } from '@lit/tab-base';
import { arrowDown, arrowLeft, arrowRight, arrowUp } from '@lit/test-helpers';
import { TabsBase } from '../lit-tabs-base.js';

const Tabs = defineCE(
  class extends TabsBase {
    static get styles() {
      return super.styles;
    }
  }
);

const Tab = defineCE(
  class extends TabBase {
    static get styles() {
      return super.styles;
    }
  }
);

describe('tabs', () => {
  let tabs;

  beforeEach(async () => {
    tabs = await fixture(`
      <${Tabs} style="width: 400px; height: 400px;">
        <${Tab}>Tab one</${Tab}>
        <${Tab}>Tab two</${Tab}>
        <${Tab} disabled>Tab three</${Tab}>
        <${Tab}>Tab four</${Tab}>
      </${Tabs}>
    `);
  });

  it('should have role="tablist"', () => {
    expect(tabs.getAttribute('role')).to.equal('tablist');
  });

  it('should not have attribute overflow when items fit in the viewport', () => {
    expect(tabs.hasAttribute('overflow')).to.be.false;
  });

  ['horizontal', 'vertical'].forEach(orientation => {
    describe(`${orientation} overflow`, () => {
      beforeEach(async () => {
        tabs.orientation = orientation;
        await tabs.updateComplete;
      });

      describe('in large viewport', () => {
        it(`when orientation=${orientation} should not have overflow`, () => {
          expect(tabs.hasAttribute('overflow')).to.be.false;
        });
      });

      describe('in small viewport', () => {
        beforeEach(() => {
          tabs.style.width = '100px';
          tabs.style.height = '50px';
          tabs._updateOverflow();
        });

        it(`when orientation=${orientation} should have overflow="end" if scroll is at the beginning`, () => {
          expect(tabs.getAttribute('overflow')).to.be.equal('end');
        });

        it(`when orientation=${orientation} should have overflow="start end" if scroll is at the middle`, done => {
          const listener = tabs._scrollerElement.addEventListener('scroll', () => {
            expect(tabs.getAttribute('overflow')).to.be.equal('start end');
            tabs._scrollerElement.removeEventListener('scroll', listener);
            done();
          });
          tabs._scroll(2);
        });

        it(`when orientation=${orientation} should have overflow="start" if scroll is at the end`, done => {
          const listener = tabs._scrollerElement.addEventListener('scroll', () => {
            expect(tabs.getAttribute('overflow')).to.be.equal('start');
            tabs._scrollerElement.removeEventListener('scroll', listener);
            done();
          });
          tabs._scroll(400);
        });

        it(`when orientation=${orientation} should not have overflow="start" when over-scrolling`, () => {
          const scroll = tabs._scrollerElement;

          // Cannot set negative values to native scroll, monkey patching the properties
          let pixels = 0;
          Object.defineProperty(scroll, orientation === 'horizontal' ? 'scrollLeft' : 'scrollTop', {
            get: () => pixels,
            set: v => {
              pixels = v;
            }
          });

          // Simulate over-scrolling
          tabs._scroll(-1);
          scroll.dispatchEvent(new CustomEvent('scroll'));

          expect(tabs.getAttribute('overflow')).to.be.equal('end');
        });
      });
    });
  });
});

describe('tabs in flex container', () => {
  let wrapper;
  let tabs;

  beforeEach(async () => {
    wrapper = await fixture(`
      <div style="display: flex; width: 400px;">
        <${Tabs}>
          <${Tab}>Foo</${Tab}>
          <${Tab}>Bar</${Tab}>
        </${Tabs}>
      </div>
    `);
    tabs = wrapper.firstElementChild;
  });

  it('should have width above zero', () => {
    expect(tabs.offsetWidth).to.be.above(0);
  });

  it('should not scroll', () => {
    // Edge & IE11 apply roundings to the metrics, need to assert by 1px
    expect(tabs._scrollerElement.scrollWidth).to.be.closeTo(tabs._scrollerElement.offsetWidth, 1);
  });
});

describe('scrollable tabs', () => {
  let tabs;
  let scroller;

  beforeEach(async () => {
    tabs = await fixture(`
      <${Tabs} style="width: 200px; height: 100px;">
        <${Tab}>Foo</${Tab}>
        <${Tab}>Bar</${Tab}>
        <${Tab} disabled>Baz</${Tab}>
        <${Tab}>Foo1</${Tab}>
        <${Tab}>Bar1</${Tab}>
        <${Tab}>Baz1</${Tab}>
        <${Tab}>Foo2</${Tab}>
        <${Tab}>Bar2</${Tab}>
      </${Tabs}>
    `);
    tabs._observer.flush();
    scroller = tabs._scrollerElement;
  });

  it('should have overflow', () => {
    expect(tabs.hasAttribute('overflow')).to.be.true;
  });

  it('should display one item in advance on the edge of the viewport on "arrow-right" on the last visible tab', async () => {
    tabs.selected = 5;
    await tabs.updateComplete;
    tabs._focus(5);
    // Check the scroller is not scrolled vertically
    expect(scroller.scrollTop).to.be.equal(0);
    arrowRight(tabs);
    expect(scroller.getBoundingClientRect().right).to.be.closeTo(
      tabs.items[7].getBoundingClientRect().right,
      1
    );
  });

  it('should display one item in advance on the edge of the viewport on "arrow-left" on the last visible tab', async () => {
    // Move scroller so the first tab will be out of visible part
    tabs.selected = 7;
    await tabs.updateComplete;
    tabs._focus(7);
    // Check the scroller is not scrolled vertically
    expect(scroller.scrollTop).to.be.equal(0);
    // Move focus and choose the first visible tab selected
    tabs.items[2].disabled = false;
    tabs.selected = 2;
    await tabs.updateComplete;
    tabs._focus(2);

    arrowLeft(tabs);
    expect(scroller.getBoundingClientRect().left).to.be.closeTo(
      tabs.items[0].getBoundingClientRect().left,
      1
    );
  });

  it('should move the scroll vertically to display selected item', async () => {
    tabs.orientation = 'vertical';
    await tabs.updateComplete;

    expect(scroller.scrollTop).to.be.equal(0);
    tabs.selected = 5;
    await tabs.updateComplete;
    tabs._focus(5);
    expect(scroller.scrollTop).to.be.greaterThan(0);
  });

  it('should display one item in advance on the edge of the viewport on "arrow-down" on the last visible tab', async () => {
    tabs.orientation = 'vertical';
    await tabs.updateComplete;

    tabs.selected = 5;
    await tabs.updateComplete;
    tabs._focus(5);

    const scrollPosition = tabs.items[7].getBoundingClientRect().bottom;
    arrowDown(tabs);
    expect(tabs.items[7].getBoundingClientRect().bottom).to.be.lessThan(scrollPosition);
  });

  it('should display one item in advance on the edge of the viewport on "arrow-up" on the last visible tab in viewport', async () => {
    tabs.orientation = 'vertical';
    tabs.items[2].disabled = false;
    tabs.selected = 7;
    await tabs.updateComplete;
    tabs._focus(7);

    tabs.selected = 2;
    await tabs.updateComplete;
    tabs._focus(2);

    const scrollPosition = tabs.items[7].getBoundingClientRect().bottom;
    arrowUp(tabs);
    expect(tabs.items[7].getBoundingClientRect().bottom).to.be.greaterThan(scrollPosition);
  });
});
