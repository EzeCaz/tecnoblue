import { useEffect, useRef, useState } from 'react'
import { Player, type PlayerRef } from '@remotion/player'
import { Pause, Play } from 'lucide-react'
import { FieldDemo, DEMO_DURATION, DEMO_FPS, DEMO_HEIGHT, DEMO_WIDTH } from '@/video/FieldDemo'
import { useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

/** The Remotion composition played inline. Autoplays and loops; a still frame under reduced motion. */
export function DemoPlayer({ className, label }: { className?: string; label: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<PlayerRef>(null)
  const [playing, setPlaying] = useState(!reduce)

  useEffect(() => {
    const p = ref.current
    if (!p) return
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    p.addEventListener('play', onPlay); p.addEventListener('pause', onPause)
    return () => { p.removeEventListener('play', onPlay); p.removeEventListener('pause', onPause) }
  }, [])

  const toggle = () => { const p = ref.current; if (!p) return; if (p.isPlaying()) p.pause(); else p.play() }

  return (
    <div className={cn('group relative overflow-hidden rounded-[26px] bg-ink shadow-float ring-1 ring-white/10', className)} role="region" aria-label={label}>
      <Player
        ref={ref}
        component={FieldDemo}
        durationInFrames={DEMO_DURATION}
        fps={DEMO_FPS}
        compositionWidth={DEMO_WIDTH}
        compositionHeight={DEMO_HEIGHT}
        style={{ width: '100%', aspectRatio: `${DEMO_WIDTH} / ${DEMO_HEIGHT}` }}
        autoPlay={!reduce}
        loop
        controls={false}
        clickToPlay={false}
        initialFrame={reduce ? 70 : 0}
        acknowledgeRemotionLicense
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause demo' : 'Play demo'}
        className="glass-dark absolute bottom-4 right-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white transition-[transform,opacity] duration-200 active:scale-95"
      >
        {playing ? <Pause className="h-5 w-5" strokeWidth={2} /> : <Play className="ml-0.5 h-5 w-5" strokeWidth={2} />}
      </button>
    </div>
  )
}
