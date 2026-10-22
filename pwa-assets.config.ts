import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// Les icônes « maskable » (Android) et Apple sont recadrées par le système :
// on remplit le fond avec le violet du logo plutôt qu'avec du blanc.
const fondViolet = { background: '#5b4bdb' }

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: fondViolet },
    apple: { ...minimal2023Preset.apple, resizeOptions: fondViolet },
  },
  images: ['public/logo.svg'],
})
