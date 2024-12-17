import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface FloatingHeart {
  id: number;
  color: string;
  left: number;
  delay: number;
  size: number;
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    const colors = [
      'heart-red',
      'heart-blue',
      'heart-pink',
      'heart-purple',
      'heart-yellow',
    ];

    const newHearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * (40 - 20) + 20,
    }));

    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            bottom: '-20px',
          }}
        >
          <Heart
            className="fill-current"
            style={{
              width: `${heart.size}px`,
              height: `${heart.size}px`,
              color: `var(--${heart.color})`,
              filter: 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1))',
            }}
          />
        </div>
      ))}
    </div>
  );
}