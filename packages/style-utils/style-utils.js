import { DomModule } from '@polymer/polymer/lib/elements/dom-module.js';
import { stylesFromTemplate } from '@polymer/polymer/lib/utils/style-gather.js';

export { html } from '@polymer/polymer/lib/utils/html-tag.js';

export const includeStyle = id => {
  const template = DomModule.import(id, 'template');
  return (
    template &&
    stylesFromTemplate(template)
      .map(style => style.textContent)
      .join(' ')
  );
};

export const injectStyle = (id, template) => {
  const styleModule = new DomModule();
  styleModule.setAttribute('id', id);
  styleModule.appendChild(template);
  document.head.appendChild(styleModule);
};
