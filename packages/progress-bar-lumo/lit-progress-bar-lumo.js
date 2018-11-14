import { css } from 'lit-css';
import { ProgressBarBase } from '@lit/progress-bar-base';
import '@vaadin/vaadin-progress-bar/theme/lumo/vaadin-progress-bar-styles.js';
import { getStyleModule } from '@lit/polymer-style-module';

class LitProgressBarLumo extends ProgressBarBase {
  static get is() {
    return 'lit-progress-bar-lumo';
  }

  static get version() {
    return '0.1.0';
  }

  static get style() {
    return css`
      ${super.style}
      ${getStyleModule('lumo-progress-bar')}
    `;
  }
}

customElements.define(LitProgressBarLumo.is, LitProgressBarLumo);
