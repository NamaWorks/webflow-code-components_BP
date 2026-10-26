// Import the raw React component, never the .webflow.tsx wrapper.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleImageItem } from './ToggleImageItem';

const meta: Meta<typeof ToggleImageItem> = {
  title: 'Components/ToggleImageItem',
  component: ToggleImageItem,
};

export default meta;
type Story = StoryObj<typeof ToggleImageItem>;

const PLACEHOLDER = { src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=80' };

export const Default: Story = {
  args: {
    title: '04. Fragilidad capilar',
    content:
      'Existen diferentes tipos y estadios del lipedema. Un diagnóstico especializado permite identificar el estadio en el que te encuentras y planificar el tratamiento más adecuado.',
    image: PLACEHOLDER,
  },
};

// ─── Exclusive accordion with images ────────────────────────────────────────
// All items share the same className. First item opens on load; clicking
// another closes the current one and opens the new one. The image always
// appears in the same left-column position (350 × 342 px) across all items.

const items = [
  {
    title: '01. Aumento del tejido adiposo',
    content:
      'El aumento del tejido adiposo es uno de los síntomas más característicos del lipedema, afectando principalmente a las extremidades inferiores de manera simétrica.',
    image: { src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=80' },
  },
  {
    title: '02. Distribución anómala',
    content:
      'La distribución anómala de la grasa se produce de forma desproporcionada en ciertas zonas del cuerpo, creando un contraste visible con otras áreas no afectadas.',
    image: { src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=700&q=80' },
  },
  {
    title: '03. Inflamación y sensibilidad',
    content:
      'La inflamación crónica y la sensibilidad al tacto son síntomas frecuentes que afectan la calidad de vida y requieren un tratamiento especializado y continuado.',
    image: { src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&q=80' },
  },
  {
    title: '04. Fragilidad capilar',
    content:
      'Existen diferentes tipos y estadios del lipedema. Un diagnóstico especializado permite identificar el estadio en el que te encuentras y planificar el tratamiento más adecuado.',
    image: { src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=80' },
  },
];

export const AccordionExclusive: Story = {
  render: () => (
    <div className="relative flex max-w-[1400px] flex-col gap-[27px]">
      {items.map((item, i) => (
        <ToggleImageItem
          key={i}
          title={item.title}
          content={item.content}
          image={item.image}
          className="faq-image-toggle"
        />
      ))}
    </div>
  ),
};
