import { Composition, registerRoot } from 'remotion'
import { FieldDemo, FieldDemoMobile, DEMO_DURATION, DEMO_FPS, DEMO_HEIGHT, DEMO_WIDTH, DEMO_M_HEIGHT, DEMO_M_WIDTH } from './FieldDemo'

/** Remotion entry for rendering the hero demo to MP4: `npm run video:render`. */
function RemotionRoot() {
  return (
    <>
      <Composition id="FieldDemo" component={FieldDemo} durationInFrames={DEMO_DURATION} fps={DEMO_FPS} width={DEMO_WIDTH} height={DEMO_HEIGHT} />
      <Composition id="FieldDemoMobile" component={FieldDemoMobile} durationInFrames={DEMO_DURATION} fps={DEMO_FPS} width={DEMO_M_WIDTH} height={DEMO_M_HEIGHT} />
    </>
  )
}
registerRoot(RemotionRoot)
