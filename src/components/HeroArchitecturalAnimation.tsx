import { motion, useReducedMotion } from 'framer-motion';

/**
 * Architectural Blueprint & Geometric Home Design Animation Layer
 * Renders animated isometric home elevations, CAD drafting grids,
 * roof-truss geometry, and precision dimension lines for the Hero section.
 */
export function HeroBackgroundGeometry() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
    >
      {/* Ambient architectural lighting washes */}
      <div className="absolute top-[-12%] right-[-8%] w-[52%] h-[52%] bg-primary/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-12%] left-[-8%] w-[42%] h-[42%] bg-primary/10 rounded-full blur-[100px]" />

      {/* Subtle architectural coordinate dot matrix */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1.5px 1.5px, var(--primary) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Full-viewport animated architectural SVG drafting layer */}
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full opacity-[0.22] dark:opacity-[0.26]"
      >
        {/* Subtle horizontal & vertical CAD datum lines */}
        <motion.line
          x1="0"
          y1="220"
          x2="1440"
          y2="220"
          stroke="currentColor"
          className="text-primary/25"
          strokeWidth="1"
          strokeDasharray="6 8"
          initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
        />
        <motion.line
          x1="0"
          y1="700"
          x2="1440"
          y2="700"
          stroke="currentColor"
          className="text-primary/20"
          strokeWidth="1"
          strokeDasharray="4 10"
          initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.1, delay: 0.2, ease: 'easeOut' }}
        />
        <motion.line
          x1="980"
          y1="0"
          x2="980"
          y2="900"
          stroke="currentColor"
          className="text-primary/20"
          strokeWidth="1"
          strokeDasharray="6 8"
          initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, delay: 0.15, ease: 'easeOut' }}
        />

        {/* Rotating architectural compass / protractor ring (Top Right) */}
        <motion.g
          style={{ transformOrigin: '1180px 210px' }}
          animate={
            prefersReducedMotion
              ? undefined
              : { rotate: [0, 360] }
          }
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="text-primary/30"
        >
          <circle
            cx="1180"
            cy="210"
            r="175"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="10 8"
          />
          <circle
            cx="1180"
            cy="210"
            r="130"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="2 6"
          />
          <line x1="1180" y1="20" x2="1180" y2="55" stroke="currentColor" strokeWidth="1.2" />
          <line x1="1180" y1="365" x2="1180" y2="400" stroke="currentColor" strokeWidth="1.2" />
          <line x1="990" y1="210" x2="1025" y2="210" stroke="currentColor" strokeWidth="1.2" />
          <line x1="1335" y1="210" x2="1370" y2="210" stroke="currentColor" strokeWidth="1.2" />
        </motion.g>

        {/* Counter-rotating geometric octagon blueprint ring */}
        <motion.g
          style={{ transformOrigin: '1180px 210px' }}
          animate={
            prefersReducedMotion
              ? undefined
              : { rotate: [360, 0] }
          }
          transition={{ duration: 64, repeat: Infinity, ease: 'linear' }}
          className="text-primary/25"
        >
          <polygon
            points="1180,55 1290,100 1335,210 1290,320 1180,365 1070,320 1025,210 1070,100"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </motion.g>

        {/* Animated Elevated Tropical Stilt Home Architectural Elevation (Lower Right) */}
        <g className="text-primary/45">
          {/* Ground datum line */}
          <motion.line
            x1="840"
            y1="780"
            x2="1360"
            y2="780"
            stroke="currentColor"
            strokeWidth="1.5"
            initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 0.2, ease: 'easeInOut' }}
          />
          {/* Tropical pitched roof & wide eaves */}
          <motion.path
            d="M895 610 L1100 505 L1305 610 M920 597 L1280 597"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={
              prefersReducedMotion
                ? { pathLength: 1 }
                : { pathLength: [0, 1, 1], opacity: [0.3, 1, 0.7] }
            }
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
          {/* Main modular living envelope & verandah */}
          <motion.path
            d="M935 610 L935 715 L1265 715 L1265 610 M1030 610 L1030 715 M1165 635 L1235 635 L1235 685 L1165 685 Z M965 640 L1005 640 L1005 715 L965 715"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={
              prefersReducedMotion
                ? { pathLength: 1 }
                : { pathLength: [0.15, 1, 1] }
            }
            transition={{
              duration: 6,
              delay: 0.4,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
          {/* Highset stilt piers & cross bracing */}
          <motion.path
            d="M950 715 L950 780 M1030 715 L1030 780 M1130 715 L1130 780 M1250 715 L1250 780 M950 725 L1030 770 M1030 725 L950 770"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.6, ease: 'easeOut' }}
          />
        </g>

        {/* Floating Isometric Modular Cube Wireframes (Mid Left / Background) */}
        <motion.g
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [-8, 8, -8], opacity: [0.35, 0.7, 0.35] }
          }
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="text-primary/35"
        >
          {/* Isometric house volume wireframe */}
          <path
            d="M120 710 L195 668 L270 710 L270 790 L195 832 L120 790 Z M120 710 L195 752 L270 710 M195 752 L195 832"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          {/* Roof ridge */}
          <path
            d="M120 710 L195 630 L270 710 M195 630 L195 668"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
            strokeDasharray="4 4"
          />
        </motion.g>

        {/* Precision corner CAD crosshairs */}
        {[
          { x: 980, y: 220 },
          { x: 980, y: 700 },
          { x: 420, y: 220 },
          { x: 420, y: 700 },
        ].map((pt, i) => (
          <motion.g
            key={i}
            animate={
              prefersReducedMotion
                ? undefined
                : { opacity: [0.35, 0.9, 0.35], scale: [0.9, 1.1, 0.9] }
            }
            style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
            transition={{
              duration: 4,
              delay: i * 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-primary/60"
          >
            <line x1={pt.x - 10} y1={pt.y} x2={pt.x + 10} y2={pt.y} stroke="currentColor" strokeWidth="1.2" />
            <line x1={pt.x} y1={pt.y - 10} x2={pt.x} y2={pt.y + 10} stroke="currentColor" strokeWidth="1.2" />
            <circle cx={pt.x} cy={pt.y} r="3" stroke="currentColor" strokeWidth="1" />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

/**
 * Geometric Architectural Frame & Live Wireframe Accent
 * Surrounds the right-column architectural showcase card on the homepage Hero.
 */
export function HeroShowcaseGeometry() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      {/* Rotating outer dashed blueprint square frame */}
      <motion.div
        animate={prefersReducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute -inset-6 rounded-[2.25rem] border border-dashed border-primary/25 -z-10"
      />

      {/* Counter-rotating geometric architectural diamond accent */}
      <motion.div
        animate={prefersReducedMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
        className="absolute -inset-3 rounded-3xl border border-primary/15 -z-10"
      />

      {/* Floating top-right isometric home-truss CAD badge */}
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [-6, 6, -6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-5 -right-5 z-20 w-20 h-20 rounded-2xl bg-card/90 backdrop-blur-md border border-primary/25 shadow-lg flex items-center justify-center"
      >
        <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12 text-primary">
          <motion.path
            d="M10 32 L32 14 L54 32"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', repeatDelay: 2 }}
          />
          <motion.path
            d="M16 28 L16 50 L48 50 L48 28 M26 50 L26 37 L38 37 L38 50"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, delay: 0.3, repeat: Infinity, repeatType: 'reverse', repeatDelay: 2 }}
          />
          <line x1="8" y1="54" x2="56" y2="54" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
        </svg>
      </motion.div>

      {/* Bottom-left animated CAD corner brackets */}
      <motion.div
        animate={prefersReducedMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-3 -left-3 w-12 h-12 border-b-2 border-l-2 border-primary/50 rounded-bl-2xl z-20"
      />
      <motion.div
        animate={prefersReducedMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 3.5, delay: 1.75, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-primary/50 rounded-tl-2xl z-20"
      />
    </div>
  );
}
