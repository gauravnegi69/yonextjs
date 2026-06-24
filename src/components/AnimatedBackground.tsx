"use client";

import React, { useEffect, useState } from 'react';

interface AnimatedBackgroundProps {
  backgroundType?: string;
}

interface Particle {
  id: number;
  char: string;
  left: number;
  size: number;
  delay: number;
  duration: number;
  colorClass?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ backgroundType = 'white' }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (backgroundType === 'white') {
      setParticles([]);
      return;
    }

    const newParticles: Particle[] = [];
    const count = 18;

    let chars: string[] = [];
    if (backgroundType === 'money-rain') {
      chars = ['₹', '$', '💵', '💸', '₹', '💵'];
    } else if (backgroundType === 'royal-gold') {
      chars = ['✨', '⭐', '✨', '⭐', '🟡'];
    } else if (backgroundType === 'dark-luxury-coin') {
      chars = ['🪙', '🪙', '⭐', '🪙', '✨'];
    } else if (backgroundType === 'card-suit-green') {
      chars = ['♠', '♥', '♣', '♦', '🪙', '♠', '♥'];
    }

    for (let i = 0; i < count; i++) {
      const char = chars[i % chars.length];
      const left = Math.random() * 92 + 4; // 4% to 96% width
      const size = Math.random() * 14 + 12; // 12px to 26px
      const delay = Math.random() * 6; // 0s to 6s delay
      const duration = Math.random() * 5 + 6; // 6s to 11s duration

      let colorClass = '';
      if (backgroundType === 'card-suit-green') {
        if (char === '♥' || char === '♦') {
          colorClass = 'text-red-500 opacity-20';
        } else if (char === '🪙') {
          colorClass = 'text-amber-400 opacity-25';
        } else {
          colorClass = 'text-slate-800 opacity-25';
        }
      } else if (backgroundType === 'money-rain') {
        if (char === '₹' || char === '$') {
          colorClass = 'text-emerald-500 opacity-25 font-black';
        } else {
          colorClass = 'opacity-20';
        }
      } else if (backgroundType === 'royal-gold') {
        colorClass = 'text-amber-400 opacity-25';
      } else if (backgroundType === 'dark-luxury-coin') {
        if (char === '🪙') {
          colorClass = 'text-amber-400 opacity-40';
        } else {
          colorClass = 'text-yellow-200 opacity-30';
        }
      }

      newParticles.push({
        id: i,
        char,
        left,
        size,
        delay,
        duration,
        colorClass
      });
    }

    setParticles(newParticles);
  }, [backgroundType]);

  // CSS gradients for background container themes
  let bgGradientClass = 'bg-white';
  if (backgroundType === 'money-rain') {
    bgGradientClass = 'bg-gradient-to-b from-emerald-50/35 via-white to-emerald-50/20';
  } else if (backgroundType === 'royal-gold') {
    bgGradientClass = 'bg-gradient-to-b from-[#fffbeb] via-[#fef3c7]/50 to-[#fffbeb]';
  } else if (backgroundType === 'dark-luxury-coin') {
    bgGradientClass = 'bg-gradient-to-b from-[#0a0f24] via-[#001f54] to-[#003a92]';
  } else if (backgroundType === 'card-suit-green') {
    bgGradientClass = 'bg-gradient-to-b from-[#064e3b] via-[#022c22] to-[#064e3b]';
  }

  return (
    <>
      {/* Styles Injection */}
      <style>{`
        @keyframes fallRain {
          0% {
            transform: translateY(-50px) rotate(0deg) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(30px);
            opacity: 0;
          }
        }
        @keyframes floatUp {
          0% {
            transform: translateY(105vh) scale(0.6) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-50px) scale(1.1) rotate(180deg);
            opacity: 0;
          }
        }
        @keyframes spinCoinFloat {
          0% {
            transform: translateY(105vh) rotateY(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-50px) rotateY(720deg);
            opacity: 0;
          }
        }
        .particle-fall {
          animation: fallRain linear infinite;
        }
        .particle-float {
          animation: floatUp linear infinite;
        }
        .particle-spin-float {
          animation: spinCoinFloat linear infinite;
        }
      `}</style>

      {/* Main Container Wrapper */}
      <div 
        className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 transition-colors duration-500 ${bgGradientClass}`}
        style={{ minHeight: '100%' }}
      >
        {/* Render Particles */}
        {particles.map((p) => {
          let animClass = 'particle-fall';
          if (backgroundType === 'royal-gold') {
            animClass = 'particle-float';
          } else if (backgroundType === 'dark-luxury-coin') {
            animClass = p.char === '🪙' ? 'particle-spin-float' : 'particle-float';
          } else if (backgroundType === 'card-suit-green') {
            animClass = 'particle-float';
          }

          return (
            <div
              key={p.id}
              className={`absolute select-none font-bold ${p.colorClass} ${animClass}`}
              style={{
                left: `${p.left}%`,
                top: `-50px`,
                fontSize: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`
              }}
            >
              {p.char}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AnimatedBackground;
