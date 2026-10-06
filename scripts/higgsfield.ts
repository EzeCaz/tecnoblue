/**
 * Generate cinematic background clips with Higgsfield (Soul text-to-image → DoP image-to-video),
 * then save them under public/video/ for the site.
 *
 *   export HF_CREDENTIALS="KEY_ID:KEY_SECRET"      # from console.higgsfield.ai
 *   npm run higgsfield -- hero                       # one preset (Seedance 2.5 text-to-video, 1 generation)
 *   npm run higgsfield -- all                        # every preset
 *   npm run higgsfield -- hero --dop                 # alternative: Soul still + DoP camera motion (2 generations)
 *
 * Presets are below; edit the prompts freely. Each run costs credits on your Higgsfield balance.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { higgsfield } from '@higgsfield/client/v2'
import { loadLocalEnv, hasHiggsfieldCredentials } from './env'

loadLocalEnv()

type Preset = { file: string; image: string; motion: string; size: string }

const PRESETS: Record<string, Preset> = {
  hero: {
    file: 'hero-bg.mp4',
    image: 'Abstract cinematic visualisation of data flowing through a dark navy space, soft volumetric light in electric blue and cyan, glass-like ribbons and particles, depth of field, ultra clean, no text, no people, 16:9',
    motion: 'Slow, smooth push-in with gentle parallax drift of the light ribbons, looping feel, no camera shake',
    size: '2048x1152',
  },
  field: {
    file: 'field.mp4',
    image: 'A sales representative in a bright modern supermarket aisle checking a tablet, shelves in soft focus, natural light, documentary realism, Latin America, 16:9',
    motion: 'Subtle handheld glide following the person, shallow depth of field, calm and professional',
    size: '2048x1152',
  },
  contact: {
    file: 'contact.mp4',
    image: 'Modern intelligent operations centre at dusk, large wall screens with maps and telemetry in blue tones, a few operators with headsets, cinematic wide shot, 16:9',
    motion: 'Slow lateral dolly across the room, screens softly flickering, cinematic',
    size: '2048x1152',
  },
  retail: {
    file: 'retail.mp4',
    image: 'Pharmacy shelf with sleek digital shelf-edge displays glowing softly, products neatly arranged, premium retail lighting, 16:9',
    motion: 'Gentle slide along the shelf with soft parallax, elegant pace',
    size: '2048x1152',
  },
  screens: {
    file: 'screens.mp4',
    image: 'Premium gym interior with large wall screens showing a vibrant campaign, people training in the background out of focus, energetic lighting, 16:9',
    motion: 'Slow orbit around the main screen, subtle energy, cinematic',
    size: '2048x1152',
  },
}

type V2 = { status?: string; request_id?: string; video?: { url?: string }; images?: { url?: string }[]; error?: unknown; message?: string; detail?: unknown }

async function runSeedance(name: string, p: Preset) {
  console.log(`\n▶ ${name}: generating with Seedance 2.5 (text-to-video)…`)
  const res = (await higgsfield.subscribe('bytedance/seedance-2.5/text-to-video', {
    input: { prompt: `${p.image} ${p.motion}`, duration: 5, resolution: process.env.HF_RESOLUTION ?? '720p', aspect_ratio: '16:9', output_format: 'mp4', generate_audio: true },
    withPolling: true,
  })) as unknown as V2
  const videoUrl = res.video?.url
  if (res.status !== 'completed' || !videoUrl) {
    const { video: _v, images: _i, ...rest } = res
    throw new Error(`Seedance failed for ${name}: status ${res.status ?? 'unknown'} · response: ${JSON.stringify(rest)}`)
  }
  await save(p.file, videoUrl)
}

async function save(file: string, videoUrl: string) {
  const out = resolve('public/video', file)
  const res = await fetch(videoUrl)
  if (!res.ok) throw new Error(`download failed: ${res.status}`)
  await mkdir(resolve('public/video'), { recursive: true })
  await writeFile(out, Buffer.from(await res.arrayBuffer()))
  console.log(`  saved → public/video/${file}`)
}

async function run(name: string, p: Preset) {
  console.log(`\n▶ ${name}: generating still with Soul…`)
  const still = await higgsfield.subscribe('/v1/text2image/soul', {
    input: { prompt: p.image, width_and_height: p.size, quality: '1080p', batch_size: 1, enhance_prompt: true },
    withPolling: true,
  })
  const stillRes = still as unknown as { status?: string; images?: { url?: string }[] }
  const imageUrl = stillRes.images?.[0]?.url
  if (stillRes.status !== 'completed' || !imageUrl) throw new Error(`Soul failed for ${name}: status ${stillRes.status ?? 'unknown'}`)
  console.log(`  still ready: ${imageUrl}`)

  console.log(`  animating with DoP…`)
  const clip = await higgsfield.subscribe('/v1/image2video/dop', {
    input: { model: 'dop-turbo', prompt: p.motion, input_images: [{ type: 'image_url', image_url: imageUrl }], enhance_prompt: true },
    withPolling: true,
  })
  const clipRes = clip as unknown as { status?: string; video?: { url?: string } }
  const videoUrl = clipRes.video?.url
  if (clipRes.status !== 'completed' || !videoUrl) throw new Error(`DoP failed for ${name}: status ${clipRes.status ?? 'unknown'}`)

  await save(p.file, videoUrl)
}

const args = process.argv.slice(2)
const useDop = args.includes('--dop')
const which = args.find((a) => !a.startsWith('--')) ?? 'hero'
if (!hasHiggsfieldCredentials()) {
  console.error('Set HF_CREDENTIALS="KEY_ID:KEY_SECRET" (create a key at console.higgsfield.ai).')
  process.exit(1)
}
const names = which === 'all' ? Object.keys(PRESETS) : [which]
for (const n of names) {
  const p = PRESETS[n]
  if (!p) { console.error(`Unknown preset "${n}". Available: ${Object.keys(PRESETS).join(', ')}`); process.exit(1) }
  if (useDop) await run(n, p); else await runSeedance(n, p)
}
console.log('\nDone. Point VITE_HERO_VIDEO=/video/hero-bg.mp4 in .env to use the hero clip.')
