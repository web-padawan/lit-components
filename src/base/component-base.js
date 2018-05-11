import {LitElement, html} from '@polymer/lit-element/lit-element.js';
import {afterNextRender} from '@material/mwc-base/utils.js';
export {html} from '@polymer/lit-element/lit-element.js';

export class ComponentBase extends LitElement {

  constructor() {
    super();
    this._asyncComponent = false;
  }

  async ready() {
    super.ready();
    if (this._asyncComponent) {
      await afterNextRender();
    }
  }
}

export async function renderThemeStyles(id) {
  const theme = `${id}-theme`;
  if (!customElements.get(theme)) {
    await customElements.whenDefined(theme);
  }
  return customElements.get(theme).styles;
}

