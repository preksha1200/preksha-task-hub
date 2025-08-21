import { useMidnightRollover } from '../hooks/useMidnightRollover';

export const Header = () => {
  const { formattedDate } = useMidnightRollover();

  return (
    <header className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {formattedDate}
      </h1>
      <p className="text-lg text-gray-600">
        Let's do this, Preksha! 🌟
      </p>
    </header>
  );
};
