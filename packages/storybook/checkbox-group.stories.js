import { storiesOf } from '@storybook/polymer';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import { html } from 'lit-html';

import '@lit/checkbox-lumo';
import '@lit/checkbox-material';
import '@lit/checkbox-group-lumo';
import '@lit/checkbox-group-material';

const knobs = () => {
  return {
    label: text('Label', 'Select an option'),
    disabled: boolean('Disabled', false),
    required: boolean('Required', false),
    error: text('Error message', 'This field is required')
  };
};

storiesOf('Checkbox Group', module)
  .addDecorator(withKnobs)
  .add('Lumo', () => {
    const { label, disabled, required, error } = knobs();
    return html`
      <lit-checkbox-group-lumo
        .label="${label}"
        ?required="${required}"
        ?disabled="${disabled}"
        .errorMessage="${error}"
      >
        <lit-checkbox-lumo name="language" value="en">English</lit-checkbox-lumo>
        <lit-checkbox-lumo name="language" value="fr">Français</lit-checkbox-lumo>
        <lit-checkbox-lumo name="language" value="de">Deutsch</lit-checkbox-lumo>
      </lit-checkbox-group-lumo>
    `;
  })
  .add('Material', () => {
    const { label, disabled, required, error } = knobs();
    return html`
      <lit-checkbox-group-material
        .label="${label}"
        ?required="${required}"
        ?disabled="${disabled}"
        .errorMessage="${error}"
      >
        <lit-checkbox-material name="language" value="en">English</lit-checkbox-material>
        <lit-checkbox-material name="language" value="fr">Français</lit-checkbox-material>
        <lit-checkbox-material name="language" value="de">Deutsch</lit-checkbox-material>
      </lit-checkbox-group-material>
    `;
  });
