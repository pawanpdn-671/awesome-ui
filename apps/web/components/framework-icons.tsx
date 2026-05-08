import type { SVGAttributes } from "react";

function Icon({ children, ...props }: SVGAttributes<SVGSVGElement> & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {children}
    </svg>
  );
}

export function ReactIcon(props: SVGAttributes<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="2.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </Icon>
  );
}

export function NextjsIcon(props: SVGAttributes<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" />
      <path d="M16.5 7.5v9" />
      <path d="m7.5 16.5 7-9" />
    </Icon>
  );
}

export function VueIcon(props: SVGAttributes<SVGSVGElement>) {
  return (
    <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h20L12 21 2 3z" />
      <path d="M8 3l4 7.5L16 3" />
    </Icon>
  );
}

export function AngularIcon(props: SVGAttributes<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <polygon points="12 2 3 6 5 18 12 22 19 18 21 6 12 2" />
      <line x1="12" y1="10" x2="12" y2="17" />
      <line x1="9" y1="10" x2="9" y2="12" />
      <line x1="15" y1="10" x2="15" y2="12" />
    </Icon>
  );
}

export function SvelteIcon(props: SVGAttributes<SVGSVGElement>) {
  return (
    <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 12a8 8 0 0 1 14.5-4.5" />
      <path d="M20 12a8 8 0 0 1-14.5 4.5" />
      <path d="M12 4v4" />
      <path d="M12 16v4" />
      <circle cx="12" cy="12" r="2" />
    </Icon>
  );
}

export function SolidIcon(props: SVGAttributes<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <rect x="7.5" y="7.5" width="9" height="9" rx="1.5" />
    </Icon>
  );
}

export function ReactNativeIcon(props: SVGAttributes<SVGSVGElement>) {
  return (
    <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="18" x2="16" y2="18" />
      <circle cx="12" cy="6" r="1" />
    </Icon>
  );
}
