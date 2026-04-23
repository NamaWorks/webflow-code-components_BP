// TestHeroCard description

export interface TestHeroCardProps {
  title: string;
}

export const TestHeroCard = ({ title }: TestHeroCardProps) => (
  <div className="rounded-lg bg-white p-6 shadow-md">
    <h2 className="text-2xl font-bold">{title}</h2>
  </div>
);
