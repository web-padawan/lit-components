import { storiesOf } from '@storybook/polymer';
import { withKnobs, boolean, select, text } from '@storybook/addon-knobs';
import { html } from 'lit-html';

import '@lit/button-lumo';
import '@lit/button-material';

const LUMO_TYPES = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  'tertiary-inline': 'tertiary-inline',
  none: ''
};

const LUMO_COLORS = {
  success: 'success',
  error: 'error',
  contrast: 'contrast',
  none: ''
};

const MATERIAL_TYPES = {
  outlined: 'outlined',
  contained: 'contained',
  normal: ''
};

const knobs = () => {
  return {
    label: text('Text', 'Confirm'),
    disabled: boolean('Disabled', false)
  };
};

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('Lumo', () => {
    const { label, disabled } = knobs();
    const type = select('Type', LUMO_TYPES, LUMO_TYPES.primary);
    const color = select('Color', LUMO_COLORS, LUMO_COLORS.none);
    return html`
      <lit-button-lumo theme="${type} ${color}" .disabled="${disabled}">${label}</lit-button-lumo>
    `;
  })
  .add('Material', () => {
    const { label, disabled } = knobs();
    const type = select('Type', MATERIAL_TYPES, MATERIAL_TYPES.normal);
    return html`
      <lit-button-material theme="${type}" .disabled="${disabled}">${label}</lit-button-material>
    `;
  });
