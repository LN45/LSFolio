<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import IntrouvableView from './IntrouvableView.vue'
import EtatSigne from '@/components/EtatSigne.vue'
import { getTheme, signesDuTheme } from '@/data/catalogue'
import { useTitre } from '@/composables/useTitre'
import { useFavoris } from '@/composables/useFavoris'
import { useProgression } from '@/composables/useProgression'

const props = defineProps<{ themeId: string }>()

const theme = computed(() => getTheme(props.themeId))
const signes = computed(() => signesDuTheme(props.themeId))

const { estFavori } = useFavoris()
const { estVu, estConnu, nbConnus } = useProgression()
const connus = computed(() => nbConnus(signes.value.map((s) => s.id)))

useTitre(() => theme.value?.nom)
</script>

<template>
  <IntrouvableView v-if="!theme" />

  <template v-else>
    <RouterLink to="/" class="lien-retour">← Thèmes</RouterLink>
    <h1>
      <span aria-hidden="true">{{ theme.emoji }}</span> {{ theme.nom }}
    </h1>
    <p class="texte-doux">{{ connus }} / {{ signes.length }} signes connus</p>
    <RouterLink :to="{ name: 'quiz', params: { source: theme.id } }" class="bouton actif lancer-quiz">
      🎯 Quiz sur ce thème
    </RouterLink>

    <ul class="grille">
      <li v-for="signe in signes" :key="signe.id">
        <RouterLink
          :to="{ name: 'signe', params: { signeId: signe.id } }"
          class="carte"
          :style="{ borderLeft: `6px solid ${theme.couleur}` }"
        >
          <span>
            {{ signe.mot }}
            <small v-if="signe.note" class="texte-doux">({{ signe.note }})</small>
          </span>
          <EtatSigne :favori="estFavori(signe.id)" :connu="estConnu(signe.id)" :vu="estVu(signe.id)" />
        </RouterLink>
      </li>
    </ul>
  </template>
</template>

<style scoped>
.lancer-quiz {
  display: inline-block;
  margin-bottom: 1rem;
  text-decoration: none;
}
</style>
