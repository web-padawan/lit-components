import { storiesOf } from '@storybook/polymer';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import { html } from 'lit-html';

import '@lit/checkbox-lumo';
import '@lit/checkbox-material';

const knobs = () => {
  return {
    label: text('Label', 'I agree with terms and conditions'),
    disabled: boolean('Disabled', false)
  };
};

storiesOf('Checkbox', module)
  .addDecorator(withKnobs)
  .add('Lumo', () => {
    const { label, disabled } = knobs();
    return html`
      <lit-checkbox-lumo .disabled="${disabled}">${label}</lit-checkbox-lumo>
    `;
  })
  .add('Material', () => {
    const { label, disabled } = knobs();
    return html`
      <lit-checkbox-material .disabled="${disabled}">${label}</lit-checkbox-material>
    `;
  });
