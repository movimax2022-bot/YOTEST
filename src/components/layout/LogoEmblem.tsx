import React from 'react';
import { useBarber } from '../../context/BarberContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const LogoEmblem: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const { settings } = useBarber();
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 44 : 32;

  const shopNameParts = (settings.shopName || 'BARBERÍA MADRID').split(' ');
  const firstWord = shopNameParts[0] || 'BARBERÍA';
  const restWords = shopNameParts.slice(1).join(' ') || 'MADRID';

  // If user uploaded a custom logo and display mode is image_only
  if (settings.customLogoUrl && settings.logoDisplayMode === 'image_only') {
    return (
      <div className={`flex items-center ${className}`}>
        <img
          src={settings.customLogoUrl}
          alt={settings.shopName || 'Logo'}
          className={`${
            size === 'sm' ? 'h-7 max-w-[120px]' : size === 'lg' ? 'h-12 max-w-[180px]' : 'h-9 max-w-[150px]'
          } object-contain`}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Custom Logo Image or Golden Crossed Shears & Razor SVG Emblem */}
      {settings.customLogoUrl && settings.logoDisplayMode !== 'emblem_only' ? (
        <div className="relative flex items-center justify-center shrink-0">
          <img
            src={settings.customLogoUrl}
            alt={settings.shopName || 'Logo'}
            className={`${
              size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-11 h-11' : 'w-8 h-8'
            } rounded-lg object-contain ring-1 ring-amber-400/50 shadow-md`}
          />
        </div>
      ) : (
        <div className="relative flex items-center justify-center text-amber-400 shrink-0">
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_0_8px_rgba(245,158,11,0.45)]"
          >
            {/* Scissor blade 1 */}
            <path
              d="M12 36C12 38.2 13.8 40 16 40C18.2 40 20 38.2 20 36C20 33.8 18.2 32 16 32C13.8 32 12 33.8 12 36ZM20 34L36 10"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Scissor blade 2 */}
            <path
              d="M36 36C36 38.2 34.2 40 32 40C29.8 40 28 38.2 28 36C28 33.8 29.8 32 32 32C34.2 32 36 33.8 36 36ZM28 34L12 10"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Pivot screw */}
            <circle cx="24" cy="22" r="2.8" fill="#FBBF24" stroke="#78350F" strokeWidth="1" />
            {/* Razor blade comb accents */}
            <path
              d="M20 14L28 14"
              stroke="#FDE68A"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M24 8L24 16"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-extrabold tracking-wider text-slate-100 dark:text-white leading-none text-base md:text-lg uppercase">
            {firstWord}
          </span>
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-amber-400 uppercase leading-tight">
            {restWords}
          </span>
        </div>
      )}
    </div>
  );
};
