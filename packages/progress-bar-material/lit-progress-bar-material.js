import { ProgressBarBase } from '@lit/progress-bar-base';
import '@vaadin/vaadin-progress-bar/theme/material/vaadin-progress-bar-styles.js';
import { includeStyle } from '@lit/style-utils';

class LitProgressBarMaterial extends ProgressBarBase {
  static get is() {
    return 'lit-progress-bar-material';
  }

  static get version() {
    return '0.1.0';
  }

  getStyles() {
    return `
      ${super.getStyles()}
      ${includeStyle('material-progress-bar')}
    `;
  }
}

customElements.define(LitProgressBarMaterial.is, LitProgressBarMaterial);
