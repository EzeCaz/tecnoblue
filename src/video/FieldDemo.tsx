import type { CSSProperties, ReactNode } from 'react'
import { AbsoluteFill, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'

/**
 * "A day with Tecno.Blue" — 20 s product film composed with Remotion.
 * Dark cinematic look matching the site. One chapter per platform, each with a living interface,
 * slow camera pushes, critically damped springs and a light sweep between chapters.
 */
export const DEMO_FPS = 30
export const DEMO_DURATION = 600
export const DEMO_WIDTH = 1200
export const DEMO_HEIGHT = 760

const INK = '#070d1a', BLUE = '#0977bc', SKY = '#44b4e6', GREEN = '#36d399', WHITE = '#ffffff', MUTED = 'rgba(255,255,255,0.55)'
const FONT = '"Plus Jakarta Sans", -apple-system, "Segoe UI", system-ui, sans-serif'
const soft = { damping: 200 } // critically damped: no overshoot
const pop = { damping: 18, stiffness: 170, mass: 0.6 } // tiny overshoot for things that "land"

const CHAPTERS = [
  { id: 'intro', from: 0, len: 80 },
  { id: 'gazpacho', from: 70, len: 105, logo: 'images/logos/gazpacho.png', tag: 'Field operations', line: 'Every visit, captured as it happens.' },
  { id: 'directa', from: 165, len: 100, logo: 'images/logos/directa.svg', tag: 'Contact & operations centres', line: 'People and AI on the same floor, 24/7.' },
  { id: 'callvu', from: 255, len: 100, logo: 'images/logos/callvu.svg', tag: 'CX completion', line: 'Conversations that finish, compliantly.' },
  { id: 'realo', from: 345, len: 100, logo: 'images/logos/realo.png', tag: 'In-store retail', line: 'The shelf, digitised and measured.' },
  { id: 'betterscreentv', from: 435, len: 100, logo: 'images/logos/betterscreentv.png', tag: 'Screen advertising', line: 'From the gym floor to the living room.' },
  { id: 'outro', from: 525, len: 75 },
] as const

/* ---------- shared pieces ---------- */

function Backdrop({ seed = 0 }: { seed?: number }) {
  const f = useCurrentFrame()
  const t = f / DEMO_FPS
  const x1 = 30 + Math.sin(t * 0.35 + seed) * 12, y1 = 30 + Math.cos(t * 0.28 + seed) * 10
  const x2 = 70 + Math.cos(t * 0.3 + seed * 2) * 14, y2 = 65 + Math.sin(t * 0.22 + seed) * 12
  return (
    <AbsoluteFill style={{ background: INK }}>
      <AbsoluteFill style={{ background: `radial-gradient(42% 48% at ${x1}% ${y1}%, rgba(9,119,188,0.55), transparent 70%), radial-gradient(38% 42% at ${x2}% ${y2}%, rgba(68,180,230,0.28), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)', backgroundSize: '26px 26px', opacity: 0.5 }} />
      <AbsoluteFill style={{ background: 'radial-gradient(80% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)' }} />
    </AbsoluteFill>
  )
}

/** Slow camera push-in for the whole chapter plus a fade at both ends and a light sweep on entry. */
function Chapter({ len, children }: { len: number; children: ReactNode }) {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const inA = spring({ frame: f, fps, config: soft, durationInFrames: 22 })
  const outA = interpolate(f, [len - 16, len], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) })
  const scale = interpolate(f, [0, len], [1.0, 1.045])
  const sweep = interpolate(f, [0, 34], [-40, 140], { extrapolateRight: 'clamp' })
  return (
    <AbsoluteFill style={{ opacity: Math.min(inA, outA) }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${sweep - 12}%, rgba(255,255,255,0.08) ${sweep}%, transparent ${sweep + 12}%)`, pointerEvents: 'none' }} />
    </AbsoluteFill>
  )
}

function Rise({ delay = 0, children, style, dist = 24 }: { delay?: number; children: ReactNode; style?: CSSProperties; dist?: number }) {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ frame: f - delay, fps, config: soft, durationInFrames: 26 })
  return <div style={{ opacity: s, transform: `translateY(${(1 - s) * dist}px)`, filter: `blur(${(1 - s) * 6}px)`, ...style }}>{children}</div>
}

function Pop({ delay = 0, children, style }: { delay?: number; children: ReactNode; style?: CSSProperties }) {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ frame: f - delay, fps, config: pop })
  return <div style={{ opacity: Math.min(1, s * 1.5), transform: `scale(${0.7 + 0.3 * s})`, ...style }}>{children}</div>
}

function Count({ to, from = 0, delay = 0, dur = 40, suffix = '', decimals = 0 }: { to: number; from?: number; delay?: number; dur?: number; suffix?: string; decimals?: number }) {
  const f = useCurrentFrame()
  const v = interpolate(f, [delay, delay + dur], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
  return <>{v.toFixed(decimals)}{suffix}</>
}

const glass: CSSProperties = { background: 'rgba(13,24,48,0.55)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 30px 60px -30px rgba(0,0,0,0.6)', borderRadius: 22, backdropFilter: 'blur(14px)', color: WHITE, fontFamily: FONT }
const label: CSSProperties = { fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED }

function ChapterHeader({ logo, tag, line, index }: { logo: string; tag: string; line: string; index: number }) {
  return (
    <div style={{ position: 'absolute', left: 64, top: 56, right: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontFamily: FONT }}>
      <div>
        <Rise delay={4}><div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: WHITE, borderRadius: 14, padding: '10px 16px' }}><Img src={staticFile(logo)} style={{ height: logo.includes('gazpacho') ? 48 : logo.includes('realo') ? 28 : 34, width: 'auto' }} /></div></Rise>
        <Rise delay={10}><div style={{ ...label, marginTop: 18, color: SKY }}>{tag}</div></Rise>
        <Rise delay={14}><div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: WHITE, marginTop: 6, maxWidth: 560, lineHeight: 1.08 }}>{line}</div></Rise>
      </div>
      <Rise delay={6}><div style={{ display: 'flex', gap: 8, marginTop: 6 }}>{[1, 2, 3, 4, 5].map((i) => <span key={i} style={{ width: i === index ? 28 : 8, height: 8, borderRadius: 99, background: i === index ? SKY : 'rgba(255,255,255,0.25)' }} />)}</div></Rise>
    </div>
  )
}

/* ---------- chapters ---------- */

function Intro() {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const words = ['A', 'day', 'with']
  const mark = spring({ frame: f - 2, fps, config: soft, durationInFrames: 30 })
  return (
    <AbsoluteFill style={{ fontFamily: FONT, justifyContent: 'center', alignItems: 'center', color: WHITE }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, transform: `scale(${0.8 + 0.2 * mark})`, opacity: mark }}>
        <Img src={staticFile('images/logo-mark.png')} style={{ width: 64, height: 64 }} />
        <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em' }}>tecno<span style={{ color: SKY }}>.</span>blue</span>
      </div>
      <div style={{ display: 'flex', gap: 18, marginTop: 34, fontSize: 72, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1 }}>
        {words.map((w, i) => <Rise key={w} delay={14 + i * 6} dist={40}><span>{w}</span></Rise>)}
        <Rise delay={34} dist={40}><span style={{ color: SKY }}>Tecno.Blue</span></Rise>
      </div>
      <Rise delay={46}><div style={{ marginTop: 22, fontSize: 20, color: MUTED }}>Five platforms. One partner who implements and supports them.</div></Rise>
    </AbsoluteFill>
  )
}

function Gazpacho({ len }: { len: number }) {
  const f = useCurrentFrame()
  const pathLen = 1000
  const drawn = interpolate(f, [18, 70], [pathLen, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) })
  const stops = [{ x: 150, y: 560, t: 22, n: 'Supermercado Luna' }, { x: 330, y: 380, t: 38, n: 'Minimarket Sol' }, { x: 560, y: 470, t: 54, n: 'Farmacia Central' }, { x: 760, y: 330, t: 68, n: 'Bodega El Prado' }]
  return (
    <Chapter len={len}>
      <Backdrop seed={1} />
      <svg width={DEMO_WIDTH} height={DEMO_HEIGHT} style={{ position: 'absolute', inset: 0 }}>
        <defs><filter id="glow"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        <path d="M150 560 C 220 500, 270 420, 330 380 S 500 500, 560 470 S 700 360, 760 330" fill="none" stroke={SKY} strokeWidth={5} strokeLinecap="round" strokeDasharray={pathLen} strokeDashoffset={drawn} filter="url(#glow)" />
        {stops.map((s) => { const p = spring({ frame: f - s.t, fps: DEMO_FPS, config: pop }); const r = interpolate(f, [s.t, s.t + 40], [0, 44], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }); const ro = interpolate(f, [s.t, s.t + 40], [0.5, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }); return <g key={s.n}><circle cx={s.x} cy={s.y} r={r} fill="none" stroke={SKY} strokeWidth={2} opacity={ro} /><g transform={`translate(${s.x} ${s.y}) scale(${p})`}><circle r={11} fill={SKY} stroke={INK} strokeWidth={4} /></g></g> })}
      </svg>
      {stops.map((s) => <Pop key={s.n} delay={s.t + 3} style={{ position: 'absolute', left: s.x + 24, top: s.y - 38, ...glass, borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 8, height: 8, borderRadius: 99, background: GREEN }} /><span style={{ fontSize: 15, fontWeight: 700 }}>{s.n}</span><span style={{ fontSize: 12, color: GREEN, fontWeight: 700 }}>Checked in</span></Pop>)}
      <Rise delay={30} style={{ position: 'absolute', right: 64, bottom: 64, ...glass, padding: 24, width: 300 }}>
        <div style={label}>Today</div>
        <div style={{ display: 'flex', gap: 24, marginTop: 10 }}>
          <div><div style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}><Count to={247} delay={34} /></div><div style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>visits · <span style={{ color: GREEN }}>+12%</span></div></div>
          <div><div style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}><Count to={38} delay={40} /></div><div style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>reps live of 41</div></div>
        </div>
      </Rise>
      <ChapterHeader logo="images/logos/gazpacho.png" tag="Field operations" line="Every visit, captured as it happens." index={1} />
    </Chapter>
  )
}

function Directa({ len }: { len: number }) {
  const f = useCurrentFrame()
  const sla = interpolate(f, [20, 70], [0, 0.94], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
  const C = 2 * Math.PI * 54
  const feed = ['Inbound · billing → Agent Rosa M.', 'Telemetry · well 14 → auto-resolved', 'Outbound · renewal → RPA bot', 'Inbound · WhatsApp → Agent Luis P.', 'Alert · network node 7 → acknowledged']
  return (
    <Chapter len={len}>
      <Backdrop seed={2} />
      <div style={{ position: 'absolute', left: 64, right: 64, bottom: 64, display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr', gap: 18, fontFamily: FONT }}>
        <Rise delay={26} style={{ ...glass, padding: 24 }}><div style={label}>Calls in queue</div><div style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 10 }}><Count to={7} from={23} delay={30} dur={50} /></div><div style={{ fontSize: 13, color: GREEN, marginTop: 8, fontWeight: 700 }}>falling · avg answer 18 s</div></Rise>
        <Rise delay={32} style={{ ...glass, padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width={128} height={128} viewBox="0 0 128 128"><circle cx={64} cy={64} r={54} stroke="rgba(255,255,255,0.12)" strokeWidth={10} fill="none" /><circle cx={64} cy={64} r={54} stroke={GREEN} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - sla)} transform="rotate(-90 64 64)" /><text x={64} y={70} textAnchor="middle" fill={WHITE} fontSize={24} fontWeight={800} fontFamily={FONT}>{Math.round(sla * 100)}%</text></svg>
          <div><div style={label}>SLA today</div><div style={{ fontSize: 15, marginTop: 8, lineHeight: 1.4 }}>Answered within target, across every channel.</div></div>
        </Rise>
        <Rise delay={38} style={{ ...glass, padding: 20 }}>
          <div style={{ ...label, display: 'flex', justifyContent: 'space-between' }}><span>Live events</span><span style={{ color: GREEN }}>● Live</span></div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {feed.map((e, i) => { const s = spring({ frame: f - 44 - i * 7, fps: DEMO_FPS, config: soft, durationInFrames: 20 }); return <div key={e} style={{ opacity: s, transform: `translateX(${(1 - s) * 16}px)`, background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '9px 12px', fontSize: 13, fontWeight: 600, display: 'flex', gap: 10, alignItems: 'center' }}><span style={{ width: 6, height: 6, borderRadius: 99, background: i % 2 ? SKY : GREEN }} />{e}</div> })}
          </div>
        </Rise>
      </div>
      <ChapterHeader logo="images/logos/directa.svg" tag="Contact & operations centres" line="People and AI on the same floor, 24/7." index={2} />
    </Chapter>
  )
}

function Callvu({ len }: { len: number }) {
  const f = useCurrentFrame()
  const typing = f > 18 && f < 40
  const dots = Math.floor(f / 5) % 3
  return (
    <Chapter len={len}>
      <Backdrop seed={3} />
      <div style={{ position: 'absolute', right: 64, bottom: 64, width: 520, ...glass, padding: 26, fontFamily: FONT }}>
        <div style={{ ...label, display: 'flex', justifyContent: 'space-between' }}><span>Verified transaction</span><span>Session 4821</span></div>
        <Rise delay={10} style={{ marginTop: 16, maxWidth: 330, background: 'rgba(255,255,255,0.08)', borderRadius: '18px 18px 18px 6px', padding: '13px 16px', fontSize: 17 }}>I'd like to update my billing address.</Rise>
        {typing && <div style={{ marginTop: 10, marginLeft: 'auto', width: 64, background: BLUE, borderRadius: 18, padding: '10px 14px', display: 'flex', gap: 5, justifyContent: 'center' }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 7, height: 7, borderRadius: 99, background: WHITE, opacity: dots === i ? 1 : 0.4 }} />)}</div>}
        {f >= 40 && <Rise delay={40} style={{ marginTop: 10, marginLeft: 'auto', maxWidth: 380, background: BLUE, borderRadius: '18px 18px 6px 18px', padding: '13px 16px', fontSize: 17 }}>Done. Identity verified, consent recorded, CRM updated.</Rise>}
        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>{['Identity', 'Consent', 'SOC 2', 'PCI DSS', 'HIPAA'].map((t, i) => <Pop key={t} delay={58 + i * 5}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(54,211,153,0.18)', color: GREEN, borderRadius: 99, padding: '6px 11px', fontSize: 12, fontWeight: 800 }}><span style={{ width: 6, height: 6, borderRadius: 99, background: GREEN }} />{t}</span></Pop>)}</div>
      </div>
      <Rise delay={30} style={{ position: 'absolute', left: 64, bottom: 64, ...glass, padding: 22, width: 300 }}><div style={label}>Completed in</div><div style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 8 }}><Count to={41} delay={34} suffix=" s" /></div><div style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>no agent transfer, no callback</div></Rise>
      <ChapterHeader logo="images/logos/callvu.svg" tag="CX completion" line="Conversations that finish, compliantly." index={3} />
    </Chapter>
  )
}

function Realo({ len }: { len: number }) {
  const f = useCurrentFrame()
  const cells = Array.from({ length: 24 }, (_, i) => i)
  return (
    <Chapter len={len}>
      <Backdrop seed={4} />
      <div style={{ position: 'absolute', left: 64, bottom: 64, width: 640, ...glass, padding: 24, fontFamily: FONT }}>
        <div style={{ ...label, display: 'flex', justifyContent: 'space-between' }}><span>eShelf · aisle 4 · shopper dwell</span><span>Live</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8, marginTop: 14 }}>
          {cells.map((i) => { const s = spring({ frame: f - 14 - (i % 8) * 3 - Math.floor(i / 8) * 6, fps: DEMO_FPS, config: soft, durationInFrames: 18 }); const heat = [0.2, 0.35, 0.9, 0.6, 0.25, 0.75, 0.4, 0.3][i % 8] * (1 - Math.floor(i / 8) * 0.2); const lit = interpolate(f, [40 + i * 1.5, 70 + i * 1.5], [0, heat], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }); return <div key={i} style={{ aspectRatio: '3/4', borderRadius: 8, background: `rgba(68,180,230,${0.08 + lit * 0.8})`, border: '1px solid rgba(255,255,255,0.1)', opacity: s, transform: `scale(${0.8 + 0.2 * s})` }} /> })}
        </div>
      </div>
      <Rise delay={36} style={{ position: 'absolute', right: 64, bottom: 64, ...glass, padding: 24, width: 300 }}><div style={label}>Sales lift</div><div style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 8, color: GREEN }}>+<Count to={5} delay={40} suffix="%" /></div><div style={{ fontSize: 13, color: MUTED, marginTop: 8 }}>average across 3,000+ stores</div></Rise>
      <ChapterHeader logo="images/logos/realo.png" tag="In-store retail" line="The shelf, digitised and measured." index={4} />
    </Chapter>
  )
}

function Screens({ len }: { len: number }) {
  const f = useCurrentFrame()
  const beam = interpolate(f, [34, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) })
  return (
    <Chapter len={len}>
      <Backdrop seed={5} />
      <div style={{ position: 'absolute', left: 64, right: 64, bottom: 64, display: 'grid', gridTemplateColumns: '1fr 120px 1fr', alignItems: 'center', gap: 0, fontFamily: FONT }}>
        <Rise delay={16} style={{ ...glass, padding: 18 }}><div style={label}>Gym screen</div><div style={{ marginTop: 12, aspectRatio: '16/9', borderRadius: 14, background: `linear-gradient(135deg, ${BLUE}, ${SKY})`, display: 'flex', alignItems: 'flex-end', padding: 18, fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>Your campaign, at the moment of attention.</div></Rise>
        <svg width={120} height={60}><path d="M8 30 H112" stroke={SKY} strokeWidth={3} strokeDasharray="110" strokeDashoffset={110 * (1 - beam)} strokeLinecap="round" /><circle cx={8 + 104 * beam} cy={30} r={6} fill={SKY} opacity={beam} /></svg>
        <Rise delay={30} style={{ ...glass, padding: 18 }}><div style={label}>Connected TV · at home</div><div style={{ marginTop: 12, aspectRatio: '16/9', borderRadius: 14, background: `linear-gradient(135deg, rgba(9,119,188,${0.3 + 0.7 * beam}), rgba(68,180,230,${0.3 + 0.7 * beam}))`, display: 'flex', alignItems: 'flex-end', padding: 18, fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', opacity: 0.4 + 0.6 * beam }}>Same audience. Same campaign.</div></Rise>
      </div>
      <Rise delay={60} style={{ position: 'absolute', right: 64, top: 230, ...glass, padding: 20, display: 'flex', gap: 28 }}>
        <div><div style={label}>Impressions</div><div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 6 }}><Count to={1.2} delay={64} decimals={1} suffix="M" /></div></div>
        <div><div style={label}>Verified</div><div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 6, color: GREEN }}><Count to={100} delay={64} suffix="%" /></div></div>
        <div><div style={label}>Cross-screen lift</div><div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 6, color: SKY }}>+<Count to={23} delay={64} suffix="%" /></div></div>
      </Rise>
      <ChapterHeader logo="images/logos/betterscreentv.png" tag="Screen advertising" line="From the gym floor to the living room." index={5} />
    </Chapter>
  )
}

function Outro({ len }: { len: number }) {
  const logos = ['images/logos/gazpacho.png', 'images/logos/directa.svg', 'images/logos/callvu.svg', 'images/logos/realo.png', 'images/logos/betterscreentv.png']
  return (
    <Chapter len={len}>
      <Backdrop seed={6} />
      <AbsoluteFill style={{ fontFamily: FONT, justifyContent: 'center', alignItems: 'center', color: WHITE }}>
        <div style={{ display: 'flex', gap: 14 }}>{logos.map((l, i) => <Pop key={l} delay={6 + i * 5}><div style={{ width: 92, height: 92, borderRadius: 24, background: WHITE, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px -20px rgba(0,0,0,0.6)' }}><Img src={staticFile(l)} style={{ maxWidth: 64, maxHeight: 44, objectFit: 'contain' }} /></div></Pop>)}</div>
        <Rise delay={30} dist={30}><div style={{ fontSize: 60, fontWeight: 800, letterSpacing: '-0.035em', marginTop: 40, lineHeight: 1 }}>Five platforms. <span style={{ color: SKY }}>One partner.</span></div></Rise>
        <Rise delay={40}><div style={{ marginTop: 18, fontSize: 20, color: MUTED }}>Implemented and supported by Tecno.Blue · tecno.blue</div></Rise>
      </AbsoluteFill>
    </Chapter>
  )
}

/* ---------- film ---------- */

function Grain() {
  const f = useCurrentFrame()
  return <AbsoluteFill style={{ pointerEvents: 'none', opacity: 0.05, mixBlendMode: 'overlay', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='${f % 7}'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
}

export function FieldDemo() {
  const c = Object.fromEntries(CHAPTERS.map((x) => [x.id, { from: x.from, len: x.len }])) as unknown as Record<(typeof CHAPTERS)[number]['id'], { from: number; len: number }>
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Sequence from={c.intro.from} durationInFrames={c.intro.len}><Chapter len={c.intro.len}><Backdrop seed={0} /><Intro /></Chapter></Sequence>
      <Sequence from={c.gazpacho.from} durationInFrames={c.gazpacho.len}><Gazpacho len={c.gazpacho.len} /></Sequence>
      <Sequence from={c.directa.from} durationInFrames={c.directa.len}><Directa len={c.directa.len} /></Sequence>
      <Sequence from={c.callvu.from} durationInFrames={c.callvu.len}><Callvu len={c.callvu.len} /></Sequence>
      <Sequence from={c.realo.from} durationInFrames={c.realo.len}><Realo len={c.realo.len} /></Sequence>
      <Sequence from={c.betterscreentv.from} durationInFrames={c.betterscreentv.len}><Screens len={c.betterscreentv.len} /></Sequence>
      <Sequence from={c.outro.from} durationInFrames={c.outro.len}><Outro len={c.outro.len} /></Sequence>
      <Grain />
    </AbsoluteFill>
  )
}
