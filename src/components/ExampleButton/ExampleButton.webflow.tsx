import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { ExampleButton } from './ExampleButton';

// This file is the only place that imports from @webflow/react or @webflow/data-types.
// It registers the component with the Webflow Designer and maps props to Designer controls.
// The Webflow CLI picks this file up via the *.webflow.tsx glob in webflow.json.
//
// Prop types reference: https://developers.webflow.com/code-components/reference/prop-types

export default declareComponent(ExampleButton, {
  name: 'ExampleButton',
  description: 'A simple button component',
  group: 'Buttons',
  options: {
    ssr: true,
  },
  props: {
    label: props.Text({
      name: 'Label',
      defaultValue: 'Click me',
    }),
  },
});
