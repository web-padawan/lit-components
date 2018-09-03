import { ProgressBarBase } from '@lit/progress-bar-base';
import '@vaadin/vaadin-progress-bar/theme/lumo/vaadin-progress-bar-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitProgressBarLumo extends ProgressBarBase {
  static get is() {
    return 'lit-progress-bar-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('lumo-progress-bar')}
    `;
  }
}

customElements.define(LitProgressBarLumo.is, LitProgressBarLumo);
