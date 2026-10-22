<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import IntrouvableView from './IntrouvableView.vue'
import CreditVideo from '@/components/CreditVideo.vue'
import LecteurSigne from '@/components/LecteurSigne.vue'
import { getSigne, getTheme, signesDuTheme } from '@/data/catalogue'
import { useTitre } from '@/composables/useTitre'
import { basculerFavori, useFavoris } from '@/composables/useFavoris'
import { basculerConnu, marquerVu, useProgression } from '@/composables/useProgression'

const props = defineProps<{ signeId: string }>()

const signe = computed(() => getSigne(props.signeId))
const theme = computed(() => (signe.value ? getTheme(signe.value.themeId) : undefined))

/** Signes précédent et suivant dans le même thème. */
const voisins = computed(() => {
  const liste = signe.value ? signesDuTheme(signe.value.themeId) : []
  const i = liste.findIndex((s) => s.id === props.signeId)
  return {
    precedent: i > 0 ? liste[i - 1] : undefined,
    suivant: i >= 0 && i < liste.length - 1 ? liste[i + 1] : undefined,
  }
})

const { estFavori } = useFavoris()
const { estConnu } = useProgression()

const favori = computed(() => estFavori(props.signeId))
const connu = computed(() => estConnu(props.signeId))

watch(
  () => props.signeId,
  (id) => {
    if (getSigne(id)) marquerVu(id)
  },
  { immediate: true },
)

useTitre(() => signe.value?.mot)
</script>

<template>
  <IntrouvableView v-if="!signe" />

  <article v-else>
    <RouterLink v-if="theme" :to="{ name: 'theme', params: { themeId: theme.id } }" class="lien-retour">
      ← {{ theme.nom }}
    </RouterLink>

    <h1>
      {{ signe.mot }}
      <small v-if="signe.note" class="texte-doux">({{ signe.note }})</small>
    </h1>

    <LecteurSigne :signe="signe" />
    <CreditVideo :signe="signe" />

    <div class="actions">
      <button
        type="button"
        class="bouton"
        :class="{ actif: favori }"
        :aria-pressed="favori"
        @click="basculerFavori(signe.id)"
      >
        {{ favori ? '♥ Dans mes favoris' : '♡ Ajouter aux favoris' }}
      </button>
      <button
        type="button"
        class="bouton"
        :class="{ actif: connu }"
        :aria-pressed="connu"
        @click="basculerConnu(signe.id)"
      >
        {{ connu ? '✓ Je connais' : 'Je connais ce signe' }}
      </button>
    </div>

    <nav class="voisins" aria-label="Signes du même thème">
      <RouterLink
        v-if="voisins.precedent"
        :to="{ name: 'signe', params: { signeId: voisins.precedent.id } }"
        class="carte"
      >
        ← {{ voisins.precedent.mot }}
      </RouterLink>
      <span v-else />
      <RouterLink
        v-if="voisins.suivant"
        :to="{ name: 'signe', params: { signeId: voisins.suivant.id } }"
        class="carte"
      >
        {{ voisins.suivant.mot }} →
      </RouterLink>
    </nav>
  </article>
</template>

<style scoped>
h1 {
  margin: 0 0 0.75rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.actions .bouton {
  flex: 1;
}

.voisins {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
</style>
