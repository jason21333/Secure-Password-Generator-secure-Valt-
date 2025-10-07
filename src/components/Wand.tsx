"use client";

import React, { useState } from 'react';

interface WandProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
}

const Wand = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "#ffffff",
  ...props
}: WandProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleMouseEnter = () => {
    setIsAnimating(true);
  };

  const handleMouseLeave = () => {
    setIsAnimating(false);
  };

  return (
    <div
      className="cursor-pointer select-none p-2 flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {/* Main wand */}
        <path
          d="m3 21 9-9"
          className={`transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-100'}`}
        />
        {/* Floating sparkles */}
        <path
          d="M15 4V2"
          className={`transition-all duration-300 ease-in-out ${
            isAnimating 
              ? 'animate-pulse opacity-75 scale-105 -translate-y-0.5' 
              : 'opacity-100 scale-100 translate-y-0'
          }`}
          style={{
            animationDelay: isAnimating ? '0ms' : '0ms',
          }}
        />
        <path
          d="M15 16v-2"
          className={`transition-all duration-300 ease-in-out ${
            isAnimating 
              ? 'animate-pulse opacity-75 scale-105 -translate-y-0.5' 
              : 'opacity-100 scale-100 translate-y-0'
          }`}
          style={{
            animationDelay: isAnimating ? '100ms' : '0ms',
          }}
        />
        <path
          d="M8 9h2"
          className={`transition-all duration-300 ease-in-out ${
            isAnimating 
              ? 'animate-pulse opacity-75 scale-105 -translate-y-0.5' 
              : 'opacity-100 scale-100 translate-y-0'
          }`}
          style={{
            animationDelay: isAnimating ? '200ms' : '0ms',
          }}
        />
        <path
          d="M20 9h2"
          className={`transition-all duration-300 ease-in-out ${
            isAnimating 
              ? 'animate-pulse opacity-75 scale-105 -translate-y-0.5' 
              : 'opacity-100 scale-100 translate-y-0'
          }`}
          style={{
            animationDelay: isAnimating ? '300ms' : '0ms',
          }}
        />
        <path
          d="M17.8 11.8 19 13"
          className={`transition-all duration-300 ease-in-out ${
            isAnimating 
              ? 'animate-pulse opacity-75 scale-105 -translate-y-0.5' 
              : 'opacity-100 scale-100 translate-y-0'
          }`}
          style={{
            animationDelay: isAnimating ? '400ms' : '0ms',
          }}
        />
        <path
          d="M15 9h.01"
          className={`transition-all duration-300 ease-in-out ${
            isAnimating 
              ? 'animate-pulse opacity-75 scale-105 -translate-y-0.5' 
              : 'opacity-100 scale-100 translate-y-0'
          }`}
          style={{
            animationDelay: isAnimating ? '500ms' : '0ms',
          }}
        />
        <path
          d="M17.8 6.2 19 5"
          className={`transition-all duration-300 ease-in-out ${
            isAnimating 
              ? 'animate-pulse opacity-75 scale-105 -translate-y-0.5' 
              : 'opacity-100 scale-100 translate-y-0'
          }`}
          style={{
            animationDelay: isAnimating ? '600ms' : '0ms',
          }}
        />
        <path
          d="M12.2 6.2 11 5"
          className={`transition-all duration-300 ease-in-out ${
            isAnimating 
              ? 'animate-pulse opacity-75 scale-105 -translate-y-0.5' 
              : 'opacity-100 scale-100 translate-y-0'
          }`}
          style={{
            animationDelay: isAnimating ? '700ms' : '0ms',
          }}
        />
      </svg>
    </div>
  );
};

export { Wand };
