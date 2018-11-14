import { DomModule } from '@polymer/polymer/lib/elements/dom-module.js';
import { stylesFromTemplate } from '@polymer/polymer/lib/utils/style-gather.js';

export const getStyleModule = id => {
  const template = DomModule.import(id, 'template');
  return (
    template &&
    stylesFromTemplate(template)
      .map(style => style.textContent)
      .join(' ')
  );
};
