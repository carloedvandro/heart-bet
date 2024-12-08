interface HeartCirclesProps {
  hearts: string[] | null;
}

export const HeartCircles = ({ hearts }: HeartCirclesProps) => {
  if (!hearts?.length) return null;

  return (
    <div className="flex gap-1 flex-wrap">
      {hearts.map((color, index) => (
        <span
          key={`${color}-${index}`}
          className="inline-block w-4 h-4 rounded-full border border-gray-300"
          style={{ backgroundColor: `var(--heart-${color})` }}
          title={color}
        />
      ))}
    </div>
  );
};