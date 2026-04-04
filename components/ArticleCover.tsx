/**
 * ArticleCover - instant, branded SVG cover art.
 * No external requests. Deterministic from slug (same article = same image).
 * Matches NeuralPulse dark glassmorphism theme: grid overlay, radial orbs,
 * neural-network node graph, category-specific color palette.
 */

// Linear congruential generator - deterministic, no Math.random()
function createRng(seed: number) {
  let s = (Math.abs(seed) % 2_147_483_646) + 1;
  return () => {
    s = (s * 16807) % 2_147_483_647;
    return (s - 1) / 2_147_483_646;
  };
}

function seedFromSlug(slug: string): number {
  return slug.split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 7) | 0;
}

// Category → [primaryGlow, secondaryGlow, nodeAccent]
const PALETTE: Record<string, [string, string, string]> = {
  'Model Release': ['#6d28d9', '#a855f7', '#ddd6fe'],
  'Tool Launch':   ['#0e7490', '#22d3ee', '#a5f3fc'],
  'Research':      ['#3730a3', '#818cf8', '#c7d2fe'],
  'Open Source':   ['#065f46', '#34d399', '#a7f3d0'],
  'SAP AI':        ['#134e4a', '#2dd4bf', '#99f6e4'],
  'Industry':      ['#0c4a6e', '#38bdf8', '#bae6fd'],
  'Framework':     ['#78350f', '#f59e0b', '#fef3c7'],
};
const DEFAULT_PALETTE: [string, string, string] = ['#5b21b6', '#0891b2', '#e9d5ff'];

export function ArticleCover({ category, slug }: Props) {
  const [c1, c2, accent] = PALETTE[category] ?? DEFAULT_PALETTE;
  const rng = createRng(seedFromSlug(slug));

  // Stable ID prefix — used to namespace SVG defs per instance
  const uid = 'ac' + slug.replace(/[^a-z0-9]/gi, '').slice(0, 10);

  // ── Network nodes ──────────────────────────────────────────────────────────
  const nodes = Array.from({ length: 11 }, () => ({
    x: rng() * 760 + 20,
    y: rng() * 380 + 20,
    r: 1.5 + rng() * 3.5,
    op: 0.28 + rng() * 0.58,
  }));

  // Edges — connect pairs that are within 210px
  const edges: [number, number, number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      if (dx * dx + dy * dy < 210 * 210) {
        edges.push([nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y]);
      }
    }
  }

  // ── Ambient glow orbs ─────────────────────────────────────────────────────
  const orb1 = { cx: rng() * 320,       cy: rng() * 260,       rx: 270 + rng() * 80, ry: 210 + rng() * 60 };
  const orb2 = { cx: 480 + rng() * 320, cy: 80  + rng() * 320, rx: 250 + rng() * 80, ry: 190 + rng() * 60 };
  const orb3 = { cx: 140 + rng() * 520, cy: rng() * 420,       rx: 130 + rng() * 70, ry: 100 + rng() * 50 };

  // ── Dashed scan lines ─────────────────────────────────────────────────────
  const scanY = [50 + rng() * 150, 200 + rng() * 180];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 420"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* ── Grid pattern ── */}
          <pattern id={`g-${uid}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0L0 0 0 24" fill="none" style={{ stroke: 'var(--cover-grid)' }} strokeWidth="0.5" />
          </pattern>

          {/* ── Orb radial gradients ── */}
          <radialGradient id={`o1-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={c1} stopOpacity="0.7" />
            <stop offset="100%" stopColor={c1} stopOpacity="0"   />
          </radialGradient>
          <radialGradient id={`o2-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={c2} stopOpacity="0.5" />
            <stop offset="100%" stopColor={c2} stopOpacity="0"   />
          </radialGradient>
          <radialGradient id={`o3-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={accent} stopOpacity="0.22" />
            <stop offset="100%" stopColor={accent} stopOpacity="0"    />
          </radialGradient>

          {/* ── Top accent-line gradient ── */}
          <linearGradient id={`tl-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={c1} stopOpacity="0" />
            <stop offset="18%"  stopColor={c1} stopOpacity="1" />
            <stop offset="82%"  stopColor={c2} stopOpacity="1" />
            <stop offset="100%" stopColor={c2} stopOpacity="0" />
          </linearGradient>

          {/* ── Bottom fade — matches current theme surface ── */}
          <linearGradient id={`bf-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="15%"  style={{ stopColor: 'var(--cover-fade)', stopOpacity: 0 }} />
            <stop offset="100%" style={{ stopColor: 'var(--cover-fade)', stopOpacity: 0.92 }} />
          </linearGradient>

          {/* ── Soft glow filter for nodes ── */}
          <filter id={`gf-${uid}`} x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1 · Base — CSS variable adapts to light/dark */}
        <rect width="800" height="420" style={{ fill: 'var(--cover-base)' }} />

        {/* 2 · Grid overlay */}
        <rect width="800" height="420" fill={`url(#g-${uid})`} />

        {/* 3 · Ambient orbs */}
        <ellipse cx={orb1.cx} cy={orb1.cy} rx={orb1.rx} ry={orb1.ry} fill={`url(#o1-${uid})`} />
        <ellipse cx={orb2.cx} cy={orb2.cy} rx={orb2.rx} ry={orb2.ry} fill={`url(#o2-${uid})`} />
        <ellipse cx={orb3.cx} cy={orb3.cy} rx={orb3.rx} ry={orb3.ry} fill={`url(#o3-${uid})`} />

        {/* 4 · Dashed horizontal scan lines */}
        {scanY.map((y, i) => (
          <line key={i} x1="0" y1={y} x2="800" y2={y}
            style={{ stroke: 'var(--cover-scan)' }} strokeWidth="1" strokeDasharray="5 8" />
        ))}

        {/* 5 · Network edges */}
        {edges.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={accent} strokeOpacity="0.22" strokeWidth="1" />
        ))}

        {/* 6 · Network nodes */}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r}
            fill={accent} fillOpacity={n.op}
            filter={`url(#gf-${uid})`} />
        ))}

        {/* 7 · Bottom dark fade */}
        <rect width="800" height="420" fill={`url(#bf-${uid})`} />

        {/* 8 · Top 2 px accent bar */}
        <rect y="0" width="800" height="2" fill={`url(#tl-${uid})`} />
      </svg>
    </div>
  );
}
