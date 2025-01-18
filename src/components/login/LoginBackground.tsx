import { Heart } from "lucide-react";

export function LoginBackground() {
  return (
    <>
      {/* Dark overlay with blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      
      {/* Animated overlay with gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 animate-gradient-x"
        style={{
          animation: 'gradient 15s ease infinite',
        }}
      />
      
      {/* Floating hearts effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${6 + i * 1.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.3 + Math.random() * 0.4,
              transform: `scale(${0.5 + Math.random() * 0.5})`,
            }}
          >
            <Heart 
              className="text-heart-pink animate-heart-beat" 
              size={24 + Math.random() * 12}
              fill="currentColor"
            />
          </div>
        ))}
      </div>
    </>
  );
}