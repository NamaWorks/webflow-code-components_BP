// Toggle item with an image from the CMS and expandable body text
// Prop types reference: https://developers.webflow.com/code-components/reference/prop-types

import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { ToggleImageItem } from './ToggleImageItem';

export default declareComponent(ToggleImageItem, {
  name: 'ToggleImageItem',
  description: 'Toggle item with a CMS image and expandable body text',
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
    image: props.Image({
      name: 'Image',
    }),
    className: props.Text({
      name: 'CSS Class',
      defaultValue: '',
    }),
  },
});
