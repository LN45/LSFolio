<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { signes, signesDuTheme, themes } from '@/data/catalogue'
import { useTitre } from '@/composables/useTitre'
import { useFavoris } from '@/composables/useFavoris'

useTitre('Quiz')

const { favoris } = useFavoris()
</script>

<template>
  <h1>🎯 Quiz</h1>
  <p class="texte-doux">
    Une vidéo s'affiche : trouve le bon mot parmi 4. Les signes que tu rates reviennent plus souvent.
  </p>

  <ul class="grille">
    <li>
      <RouterLink :to="{ name: 'quiz', params: { source: 'tous' } }" class="carte">
        <span class="emoji" aria-hidden="true">🌍</span>
        <span>
          Tous les signes
          <br />
          <small class="texte-doux">{{ signes.length }} signes</small>
        </span>
      </RouterLink>
    </li>
    <li v-if="favoris.length > 0">
      <RouterLink :to="{ name: 'quiz', params: { source: 'favoris' } }" class="carte">
        <span class="emoji" aria-hidden="true">♥</span>
        <span>
          Mes favoris
          <br />
          <small class="texte-doux">{{ favoris.length }} signes</small>
        </span>
      </RouterLink>
    </li>
    <li v-for="theme in themes" :key="theme.id">
      <RouterLink
        :to="{ name: 'quiz', params: { source: theme.id } }"
        class="carte"
        :style="{ borderLeft: `6px solid ${theme.couleur}` }"
      >
        <span class="emoji" aria-hidden="true">{{ theme.emoji }}</span>
        <span>
          {{ theme.nom }}
          <br />
          <small class="texte-doux">{{ signesDuTheme(theme.id).length }} signes</small>
        </span>
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
.emoji {
  font-size: 1.8rem;
}
</style>
