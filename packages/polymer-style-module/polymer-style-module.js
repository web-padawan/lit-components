import { DomModule } from '@polymer/polymer/lib/elements/dom-module.js';
import { stylesFromTemplate } from '@polymer/polymer/lib/utils/style-gather.js';
import { CSSResult } from 'lit-element';

export const getStyleModule = (id, cb) => {
  const template = DomModule.import(id, 'template');
  let cssText =
    template &&
    stylesFromTemplate(template)
      .map(style => style.textContent)
      .join(' ');
  if (cb) {
    cssText = cb(cssText);
  }
  return new CSSResult(cssText);
};
