<script lang="ts">
import { ref, watch } from 'vue'

const CLE_RALENTI = 'lsfolio:ralenti'
const VITESSE_RALENTI = 0.5

// Partagé entre tous les lecteurs et mémorisé dans le navigateur :
// le ralenti reste actif d'un signe à l'autre et d'une visite à l'autre.
const ralenti = ref(lireRalenti())
watch(ralenti, (actif) => {
  try {
    localStorage.setItem(CLE_RALENTI, actif ? '1' : '0')
  } catch {
    // Stockage indisponible (navigation privée…) : le réglage vaudra pour cette visite seulement.
  }
})

function lireRalenti(): boolean {
  try {
    return localStorage.getItem(CLE_RALENTI) === '1'
  } catch {
    return false
  }
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import type { Signe } from '@/data/catalogue'

const props = withDefaults(
  defineProps<{
    signe: Signe
    /** false : simple aperçu en boucle, sans boutons (ex. carte de l'accueil) */
    controles?: boolean
    /** true : ne pas révéler le mot (quiz) */
    masquerMot?: boolean
  }>(),
  { controles: true, masquerMot: false },
)

type Etat = 'chargement' | 'pret' | 'erreur'

const video = ref<HTMLVideoElement>()
const etat = ref<Etat>('chargement')
const enPause = ref(false)

const vitesse = computed(() => (ralenti.value ? VITESSE_RALENTI : 1))

// Changement de signe : la balise <video> recharge sa source, on repart de l'état initial.
watch(
  () => props.signe.id,
  () => {
    etat.value = 'chargement'
    enPause.value = false
  },
)

watch(vitesse, appliquerVitesse)

function appliquerVitesse() {
  if (!video.value) return
  // defaultPlaybackRate survit au rechargement de la source, playbackRate non.
  video.value.defaultPlaybackRate = vitesse.value
  video.value.playbackRate = vitesse.value
}

function surPret() {
  etat.value = 'pret'
  appliquerVitesse()
}

function lire() {
  video.value?.play().catch(() => {
    // Lecture automatique refusée par le navigateur : l'utilisateur peut appuyer sur Lecture.
    enPause.value = true
  })
}

function rejouer() {
  if (!video.value) return
  video.value.currentTime = 0
  lire()
}

function basculerPause() {
  if (!video.value) return
  if (video.value.paused) lire()
  else video.value.pause()
}

function reessayer() {
  etat.value = 'chargement'
  video.value?.load()
}
</script>

<template>
  <figure class="lecteur">
    <div class="cadre">
      <video
        v-show="etat !== 'erreur'"
        ref="video"
        :src="signe.video"
        :aria-label="masquerMot ? 'Vidéo du signe à deviner' : `Vidéo du signe « ${signe.mot} »`"
        autoplay
        loop
        muted
        playsinline
        preload="auto"
        @loadeddata="surPret"
        @error="etat = 'erreur'"
        @play="enPause = false"
        @pause="enPause = true"
        @click="controles && basculerPause()"
      />

      <div v-if="etat === 'chargement'" class="calque" aria-live="polite">
        <span class="roue" aria-hidden="true" />
        <span class="sr-only">Chargement de la vidéo…</span>
      </div>

      <div v-else-if="etat === 'erreur'" class="calque erreur" role="alert">
        <p>La vidéo n'a pas pu être chargée.</p>
        <p class="aide">Vérifie ta connexion internet.</p>
        <button v-if="controles" type="button" class="bouton" @click="reessayer">Réessayer</button>
      </div>

      <span v-if="ralenti && etat === 'pret'" class="badge-ralenti">Ralenti ×{{ VITESSE_RALENTI }}</span>
    </div>

    <div v-if="controles" class="controles">
      <button type="button" class="bouton" :disabled="etat !== 'pret'" @click="rejouer">↺ Rejouer</button>
      <button type="button" class="bouton" :disabled="etat !== 'pret'" @click="basculerPause">
        {{ enPause ? '▶ Lecture' : '⏸ Pause' }}
      </button>
      <button
        type="button"
        class="bouton"
        :class="{ actif: ralenti }"
        :aria-pressed="ralenti"
        @click="ralenti = !ralenti"
      >
        🐢 Ralenti
      </button>
    </div>
  </figure>
</template>

<style scoped>
.lecteur {
  margin: 0;
}

.cadre {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: var(--rayon);
  overflow: hidden;
  background: #000;
}

video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.calque {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 1rem;
  color: #fff;
  text-align: center;
}

.erreur p {
  margin: 0;
}

.erreur .aide {
  font-size: 0.85rem;
  opacity: 0.75;
  margin-bottom: 0.75rem;
}

.roue {
  width: 2.5rem;
  height: 2.5rem;
  border: 4px solid rgb(255 255 255 / 0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: tourner 0.8s linear infinite;
}

@keyframes tourner {
  to {
    transform: rotate(360deg);
  }
}

.badge-ralenti {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  color: #fff;
  background: rgb(0 0 0 / 0.6);
}

.controles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.controles .bouton {
  flex: 1;
}
</style>
