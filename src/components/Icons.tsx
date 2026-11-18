import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 22): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
});

export const IconHome = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20h14V9.5" /><path d="M10 20v-6h4v6" /></svg>
);
export const IconMap = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m9 4-6 2.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Z" /><path d="M9 4v13M15 6.5v13" /></svg>
);
export const IconSearch = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const IconHeart = ({ size, filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(size)} fill={filled ? 'currentColor' : 'none'} {...p}><path d="M12 20s-7-4.4-9.2-8.8C1.3 8 3.4 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.6 0 5.7 3.5 4.2 6.7C19 15.6 12 20 12 20Z" /></svg>
);
export const IconBack = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M15 5 8 12l7 7" /></svg>
);
export const IconPin = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const IconLocate = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>
);
export const IconPhone = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" /></svg>
);
export const IconRoute = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16" /></svg>
);
export const IconShare = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 3v12M7 8l5-5 5 5" /><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></svg>
);
export const IconClose = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const IconFilter = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 6h16M7 12h10M10 18h4" /></svg>
);

/** Pictogrammes des catégories */
export const CategoryGlyph = ({ category, size = 22 }: { category: string; size?: number }) => {
  const b = base(size);
  switch (category) {
    case 'hotel':
      return <svg {...b}><path d="M3 20V7M3 14h18v6M21 14v-3a3 3 0 0 0-3-3h-7v6" /><circle cx="7" cy="10.5" r="2" /></svg>;
    case 'restaurant':
      return <svg {...b}><path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10" /><path d="M17 21V3c-2.2 1.2-3.5 3.6-3.5 7v3H17" /></svg>;
    case 'cafe':
      return <svg {...b}><path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" /><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" /><path d="M8 3c0 1.5 1.5 1.5 1.5 3M12 3c0 1.5 1.5 1.5 1.5 3" /></svg>;
    default:
      return <svg {...b}><path d="M3 21h18M5 21V10l7-6 7 6v11" /><path d="M10 21v-5a2 2 0 0 1 4 0v5" /></svg>;
  }
};
