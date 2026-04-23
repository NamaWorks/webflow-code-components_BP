// TestHeroCard description
// Prop types reference: https://developers.webflow.com/code-components/reference/prop-types

import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { TestHeroCard } from './TestHeroCard';

export default declareComponent(TestHeroCard, {
  name: 'TestHeroCard',
  description: 'TestHeroCard description',
  group: 'Components',
  options: {
    ssr: true,
  },
  props: {
    title: props.Text({
      name: 'Title',
      defaultValue: 'TestHeroCard',
    }),
  },
});
