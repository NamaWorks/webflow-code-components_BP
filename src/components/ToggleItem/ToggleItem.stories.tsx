// Import the raw React component, never the .webflow.tsx wrapper.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleItem } from './ToggleItem';

const meta: Meta<typeof ToggleItem> = {
  title: 'Components/ToggleItem',
  component: ToggleItem,
};

export default meta;
type Story = StoryObj<typeof ToggleItem>;

// Standalone toggle — no group, freely opens and closes
export const Default: Story = {
  args: {
    title: '04. Fragilidad capilar',
    content:
      'Existen diferentes tipos y estadios del lipedema. Un diagnóstico especializado permite identificar el estadio en el que te encuentras y planificar el tratamiento más adecuado.',
  },
};

// ─── Exclusive accordion ────────────────────────────────────────────────────
// All items share the same className. The component handles the rest:
// — first item opens automatically on load
// — clicking another closes the current one and opens the new one
// — clicking the already-open item does nothing (always one open)

export const AccordionExclusive: Story = {
  render: () => (
    <div className="flex max-w-[948px] flex-col gap-6">
      <ToggleItem
        title="01. Diagnóstico especializado"
        content="Un diagnóstico especializado permite identificar el estadio en el que te encuentras y planificar el tratamiento más adecuado para tu situación."
        className="faq-toggle"
      />
      <ToggleItem
        title="02. Tratamiento personalizado"
        content="El tratamiento se adapta a las necesidades individuales de cada paciente, combinando diferentes técnicas para obtener los mejores resultados posibles."
        className="faq-toggle"
      />
      <ToggleItem
        title="03. Seguimiento continuo"
        content="El seguimiento regular permite ajustar el plan de tratamiento según la evolución del paciente y garantizar una mejora progresiva y sostenida."
        className="faq-toggle"
      />
      <ToggleItem
        title="04. Fragilidad capilar"
        content="Existen diferentes tipos y estadios del lipedema. Un diagnóstico especializado permite identificar el estadio en el que te encuentras y planificar el tratamiento más adecuado."
        className="faq-toggle"
      />
    </div>
  ),
};
