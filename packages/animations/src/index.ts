export const keyframes = {
  fadeIn: {
    from: { opacity: "0" },
    to: { opacity: "1" },
  },
  fadeUp: {
    from: { opacity: "0", transform: "translateY(20px)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
  slideDown: {
    from: { opacity: "0", transform: "translateY(-10px)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
  scaleIn: {
    from: { opacity: "0", transform: "scale(0.95)" },
    to: { opacity: "1", transform: "scale(1)" },
  },
  glowPulse: {
    "0%, 100%": { opacity: "0.4" },
    "50%": { opacity: "0.8" },
  },
  float: {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-20px)" },
  },
  shimmer: {
    "0%": { backgroundPosition: "-200% 0" },
    "100%": { backgroundPosition: "200% 0" },
  },
  gradient: {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
} as const;

export const animations = {
  fadeIn: "fadeIn 0.5s ease-out",
  fadeUp: "fadeUp 0.6s ease-out",
  slideDown: "slideDown 0.3s ease-out",
  scaleIn: "scaleIn 0.3s ease-out",
  glowPulse: "glowPulse 3s ease-in-out infinite",
  float: "float 6s ease-in-out infinite",
  shimmer: "shimmer 2s linear infinite",
  gradient: "gradient 8s ease infinite",
} as const;

export const transitions = {
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  normal: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export type AnimationName = keyof typeof animations;
