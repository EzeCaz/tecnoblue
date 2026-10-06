import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'

/**
 * "A day in the field" — a 12 s product demo composed with Remotion.
 * Scenes: route map with visits checking in → phone visit flow → office dashboard → verified chat.
 * Plays inline through @remotion/player; can be rendered to MP4 with the Remotion CLI.
 */
export const DEMO_FPS = 30
export const DEMO_DURATION = 360
export const DEMO_WIDTH = 1200
export const DEMO_HEIGHT = 760

const navy = '#0b1f3a', blue = '#0977bc', sky = '#44b4e6', ground = '#f3f6fb', muted = '#7b879a', green = '#1a9b5a'
const font = '"Plus Jakarta Sans", system-ui, sans-serif'

function Pop({ frame, delay, children, style }: { frame: number; delay: number; children: React.ReactNode; style?: React.CSSProperties }) {
  const { fps } = useVideoConfig()
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 160, mass: 0.6 } })
  return <div style={{ transform: `scale(${s}) translateY(${(1 - s) * 10}px)`, opacity: Math.min(1, s * 1.4), ...style }}>{children}</div>
}

function SceneMap() {
  const frame = useCurrentFrame()
  const len = 980
  const drawn = interpolate(frame, [10, 95], [len, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: Easing.inOut(Easing.cubic) })
  const stops = [{ x: 160, y: 520, t: 20, name: 'Supermercado Luna' }, { x: 360, y: 300, t: 42, name: 'Minimarket Sol' }, { x: 600, y: 420, t: 62, name: 'Farmacia Central' }, { x: 840, y: 240, t: 84, name: 'Bodega El Prado' }]
  return (
    <AbsoluteFill style={{ background: ground, fontFamily: font }}>
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(#cfd9e8 1.2px, transparent 1.2px)', backgroundSize: '28px 28px', opacity: 0.8 }} />
      <svg width={DEMO_WIDTH} height={DEMO_HEIGHT} style={{ position: 'absolute', inset: 0 }}>
        <path d="M160 520 C 240 440, 300 360, 360 300 S 520 440, 600 420 S 760 280, 840 240" fill="none" stroke={blue} strokeWidth={6} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={drawn} />
        {stops.map((s) => { const p = spring({ frame: frame - s.t, fps: DEMO_FPS, config: { damping: 12, stiffness: 180 } }); return <g key={s.name} transform={`translate(${s.x} ${s.y}) scale(${p})`}><circle r={22} fill={blue} opacity={0.18} /><circle r={11} fill={blue} stroke="#fff" strokeWidth={4} /></g> })}
      </svg>
      {stops.map((s) => (
        <Pop key={s.name} frame={frame} delay={s.t + 4} style={{ position: 'absolute', left: s.x + 28, top: s.y - 34, background: '#fff', borderRadius: 14, padding: '10px 14px', boxShadow: '0 16px 40px -20px rgba(11,31,58,0.35)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: 99, background: green }} /><span style={{ fontSize: 16, fontWeight: 700, color: navy }}>{s.name}</span><span style={{ fontSize: 13, color: green, fontWeight: 700 }}>Checked in</span>
        </Pop>
      ))}
      <Pop frame={frame} delay={0} style={{ position: 'absolute', left: 48, top: 44, background: navy, color: '#fff', borderRadius: 16, padding: '14px 18px', fontSize: 15, fontWeight: 600 }}>Route · Zone North · Tuesday</Pop>
    </AbsoluteFill>
  )
}

function ScenePhone() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const rise = spring({ frame, fps, config: { damping: 18, stiffness: 120 } })
  const rows = ['Check-in 09:42', 'Shelf audit 15 / 15', 'Photos 4', 'Order sent']
  const progress = interpolate(frame, [30, 80], [0, 100], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
  return (
    <AbsoluteFill style={{ background: ground, fontFamily: font, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 56, alignItems: 'center', transform: `translateY(${(1 - rise) * 60}px)`, opacity: rise }}>
        <div style={{ width: 300, background: navy, borderRadius: 44, padding: 12, boxShadow: '0 50px 100px -40px rgba(11,31,58,0.6)' }}>
          <div style={{ background: '#fff', borderRadius: 34, overflow: 'hidden', height: 560 }}>
            <div style={{ background: blue, color: '#fff', padding: '46px 22px 20px' }}><div style={{ fontSize: 13, opacity: 0.85 }}>Store visit</div><div style={{ fontSize: 22, fontWeight: 800 }}>Farmacia Central #214</div></div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {rows.map((r, i) => { const s = spring({ frame: frame - 14 - i * 9, fps, config: { damping: 16, stiffness: 160 } }); return <div key={r} style={{ opacity: s, transform: `translateX(${(1 - s) * 24}px)`, background: ground, borderRadius: 14, padding: '14px 16px', fontSize: 16, fontWeight: 600, color: navy, display: 'flex', justifyContent: 'space-between' }}><span>{r.split(' ').slice(0, -1).join(' ')}</span><span style={{ color: i === 3 ? green : blue }}>{r.split(' ').slice(-1)}</span></div> })}
              <div style={{ marginTop: 6, height: 10, background: '#e4ebf5', borderRadius: 99, overflow: 'hidden' }}><div style={{ width: `${progress}%`, height: '100%', background: green }} /></div>
              <div style={{ fontSize: 13, color: muted, fontWeight: 600 }}>Visit {Math.round(progress)}% complete</div>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 420 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: blue }}>Gazpacho · field app</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: navy, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 10 }}>Every visit, captured as it happens.</div>
          <div style={{ fontSize: 18, color: '#4a5a75', marginTop: 16, lineHeight: 1.5 }}>Check-ins, audits, photos and orders flow to the office the moment they are done.</div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

function SceneDashboard() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const rise = spring({ frame, fps, config: { damping: 18, stiffness: 120 } })
  const visits = Math.round(interpolate(frame, [10, 60], [0, 247], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: Easing.out(Easing.cubic) }))
  const reps = Math.round(interpolate(frame, [10, 50], [0, 38], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: Easing.out(Easing.cubic) }))
  const bars = [40, 55, 48, 70, 62, 85, 100]
  return (
    <AbsoluteFill style={{ background: ground, fontFamily: font, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: 960, background: '#fff', borderRadius: 28, boxShadow: '0 50px 100px -40px rgba(11,31,58,0.45)', overflow: 'hidden', transform: `translateY(${(1 - rise) * 60}px)`, opacity: rise }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 28px', borderBottom: `1px solid ${ground}`, fontSize: 15, fontWeight: 700, color: muted }}><span>Field dashboard · Today</span><span style={{ color: green, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: 99, background: green }} />Live</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: 28 }}>
          {[['Visits completed', visits, '+12% vs last week'], ['Reps in the field', reps, 'of 41 scheduled'], ['Avg visit time', '23 min', '-4 min']].map(([l, v, s]) => (
            <div key={String(l)} style={{ background: ground, borderRadius: 18, padding: 22 }}><div style={{ fontSize: 14, color: muted, fontWeight: 600 }}>{l}</div><div style={{ fontSize: 44, fontWeight: 800, color: navy, letterSpacing: '-0.03em', marginTop: 6 }}>{v}</div><div style={{ fontSize: 13, color: green, fontWeight: 700 }}>{s}</div></div>
          ))}
        </div>
        <div style={{ padding: '0 28px 28px', display: 'flex', gap: 12, alignItems: 'flex-end', height: 190 }}>
          {bars.map((h, i) => { const s = spring({ frame: frame - 20 - i * 5, fps, config: { damping: 14, stiffness: 140 } }); return <div key={i} style={{ flex: 1, height: `${h * s}%`, background: i >= 5 ? blue : '#cfe4f4', borderRadius: '10px 10px 0 0' }} /> })}
        </div>
      </div>
    </AbsoluteFill>
  )
}

function SceneChat() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const a = spring({ frame: frame - 6, fps, config: { damping: 16, stiffness: 150 } })
  const b = spring({ frame: frame - 36, fps, config: { damping: 16, stiffness: 150 } })
  const c = spring({ frame: frame - 62, fps, config: { damping: 12, stiffness: 180 } })
  return (
    <AbsoluteFill style={{ background: navy, fontFamily: font, justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill style={{ background: `radial-gradient(60% 60% at 50% 40%, rgba(9,119,188,0.55), rgba(11,31,58,0) 70%)` }} />
      <div style={{ width: 560, background: '#fff', borderRadius: 26, padding: 28, boxShadow: '0 60px 120px -40px rgba(0,0,0,0.6)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: muted }}>Callvu · verified transaction</div>
        <div style={{ opacity: a, transform: `translateY(${(1 - a) * 16}px)`, marginTop: 18, background: ground, borderRadius: '18px 18px 18px 6px', padding: '14px 18px', fontSize: 18, color: navy, maxWidth: 400 }}>I'd like to update my billing address.</div>
        <div style={{ opacity: b, transform: `translateY(${(1 - b) * 16}px)`, marginTop: 12, marginLeft: 'auto', background: blue, color: '#fff', borderRadius: '18px 18px 6px 18px', padding: '14px 18px', fontSize: 18, maxWidth: 420 }}>Done. Identity verified, consent recorded, CRM updated.</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 18, transform: `scale(${c})`, transformOrigin: 'left center' }}>{['SOC 2', 'PCI DSS', 'HIPAA', 'GDPR'].map((t) => <span key={t} style={{ background: '#e3f5ec', color: green, borderRadius: 99, padding: '6px 12px', fontSize: 13, fontWeight: 800 }}>{t}</span>)}</div>
      </div>
      <div style={{ position: 'absolute', bottom: 56, color: sky, fontSize: 16, fontWeight: 700, opacity: c }}>Conversations that finish, compliantly.</div>
    </AbsoluteFill>
  )
}

function Fade({ children, length }: { children: React.ReactNode; length: number }) {
  const frame = useCurrentFrame()
  const o = interpolate(frame, [0, 12, length - 12, length], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>
}

export function FieldDemo() {
  return (
    <AbsoluteFill style={{ background: ground }}>
      <Sequence from={0} durationInFrames={110}><Fade length={110}><SceneMap /></Fade></Sequence>
      <Sequence from={100} durationInFrames={95}><Fade length={95}><ScenePhone /></Fade></Sequence>
      <Sequence from={185} durationInFrames={90}><Fade length={90}><SceneDashboard /></Fade></Sequence>
      <Sequence from={265} durationInFrames={95}><Fade length={95}><SceneChat /></Fade></Sequence>
    </AbsoluteFill>
  )
}
