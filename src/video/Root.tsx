import { Composition, registerRoot } from 'remotion'
import { FieldDemo, DEMO_DURATION, DEMO_FPS, DEMO_HEIGHT, DEMO_WIDTH } from './FieldDemo'

/** Remotion entry for rendering the hero demo to MP4: `npm run video:render`. */
function RemotionRoot() {
  return <Composition id="FieldDemo" component={FieldDemo} durationInFrames={DEMO_DURATION} fps={DEMO_FPS} width={DEMO_WIDTH} height={DEMO_HEIGHT} />
}
registerRoot(RemotionRoot)
