import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", showText = true, light = false }) => {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* C and R emblem with needle and thread motif */}
      <div className="relative w-10 h-10 flex items-center justify-center bg-burgundy rounded-lg shadow-md border border-hotpink/30 group-hover:border-hotpink transition-all">
        <svg
          viewBox="0 0 100 100"
          className="w-7 h-7 text-cream fill-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Letter 'C' */}
          <path
            d="M 38 30 C 22 30 14 40 14 50 C 14 62 22 70 38 70"
            stroke="#F3EBDD"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Vertical Needle (stem of R) */}
          {/* Eyelet hole at top */}
          <line
            x1="52"
            y1="22"
            x2="52"
            y2="76"
            stroke="#F04476"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Needle Eyelet */}
          <ellipse cx="52" cy="27" rx="1.5" ry="3.5" fill="#191719" />
          {/* Needle Sharp Tip */}
          <polygon points="49,76 55,76 52,84" fill="#F04476" />

          {/* Upper Bowl of 'R' (Thread loop) */}
          <path
            d="M 52 28 C 72 28 82 34 82 46 C 82 56 68 56 52 56"
            stroke="#F3EBDD"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Leg of 'R' (Thread tail) */}
          <path
            d="M 64 56 Q 74 66 84 76"
            stroke="#F3EBDD"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-serif tracking-wider text-xl font-bold uppercase transition-colors ${
              light ? "text-cream" : "text-charcoal group-hover:text-burgundy"
            }`}
          >
            Crooked <span className="text-hotpink">Rib</span>
          </span>
          <span
            className={`text-[9px] tracking-[0.2em] uppercase font-sans font-medium ${
              light ? "text-cream/70" : "text-charcoal/60"
            }`}
          >
            Fashion. Tailoring. Your Rules.
          </span>
        </div>
      )}
    </Link>
  );
};
