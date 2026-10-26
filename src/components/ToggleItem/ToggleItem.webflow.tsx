// Accordion toggle item with a label and expandable body text
// Prop types reference: https://developers.webflow.com/code-components/reference/prop-types

import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { ToggleItem } from './ToggleItem';

export default declareComponent(ToggleItem, {
  name: 'ToggleItem',
  description: 'Accordion toggle item with a label and expandable body text',
  group: 'Components',
  options: {
    ssr: true,
  },
  props: {
    title: props.Text({
      name: 'Title',
      defaultValue: 'Toggle title',
    }),
    content: props.Text({
      name: 'Content',
      defaultValue: 'Content text goes here.',
    }),
    className: props.Text({
      name: 'CSS Class',
      defaultValue: '',
    }),
  },
});
