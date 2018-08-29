import {DomModule} from '@polymer/polymer/lib/elements/dom-module.js'

export const includeStyle = id => DomModule.import(id, 'template').content.firstElementChild.textContent;

export const inject = template => document.head.appendChild(template.content);
