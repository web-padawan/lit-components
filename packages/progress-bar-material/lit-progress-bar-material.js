import { ProgressBarBase } from '@lit/progress-bar-base';
import '@vaadin/vaadin-progress-bar/theme/material/vaadin-progress-bar-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitProgressBarMaterial extends ProgressBarBase {
  static get is() {
    return 'lit-progress-bar-material';
  }

  static get version() {
    return '0.1.0';
  }

  static get styles() {
    return [...super.styles, getStyleModule('material-progress-bar')];
  }
}

customElements.define(LitProgressBarMaterial.is, LitProgressBarMaterial);
