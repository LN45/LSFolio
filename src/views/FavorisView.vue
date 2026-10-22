<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import EtatSigne from '@/components/EtatSigne.vue'
import { getSigne, getTheme, type Signe } from '@/data/catalogue'
import { useTitre } from '@/composables/useTitre'
import { useFavoris } from '@/composables/useFavoris'
import { useProgression } from '@/composables/useProgression'

useTitre('Mes favoris')

const { favoris } = useFavoris()
const { estVu, estConnu } = useProgression()

// Un favori peut pointer vers un signe retiré du catalogue depuis : on l'ignore.
const signes = computed(() =>
  favoris.value.map((f) => getSigne(f.signeId)).filter((s): s is Signe => s !== undefined),
)
</script>

<template>
  <h1>♥ Mes favoris</h1>

  <div v-if="signes.length === 0" class="vide">
    <p>Tu n'as pas encore de favoris.</p>
    <p class="texte-doux">
      Sur la page d'un signe, appuie sur « ♡ Ajouter aux favoris » pour le retrouver ici.
    </p>
    <RouterLink to="/" class="bouton">Parcourir les thèmes</RouterLink>
  </div>

  <template v-else>
    <p class="texte-doux">{{ signes.length }} signe{{ signes.length > 1 ? 's' : '' }}</p>
    <RouterLink :to="{ name: 'quiz', params: { source: 'favoris' } }" class="bouton actif lancer-quiz">
      🎯 Quiz sur mes favoris
    </RouterLink>
    <ul class="grille">
      <li v-for="signe in signes" :key="signe.id">
        <RouterLink
          :to="{ name: 'signe', params: { signeId: signe.id } }"
          class="carte"
          :style="{ borderLeft: `6px solid ${getTheme(signe.themeId)?.couleur}` }"
        >
          <span>
            {{ signe.mot }}
            <small v-if="signe.note" class="texte-doux">({{ signe.note }})</small>
            <br />
            <small class="texte-doux">{{ getTheme(signe.themeId)?.nom }}</small>
          </span>
          <EtatSigne :favori="false" :connu="estConnu(signe.id)" :vu="estVu(signe.id)" />
        </RouterLink>
      </li>
    </ul>
  </template>
</template>

<style scoped>
.vide {
  text-align: center;
  padding: 2rem 0;
}

.vide .bouton,
.lancer-quiz {
  display: inline-block;
  text-decoration: none;
}

.lancer-quiz {
  margin-bottom: 1rem;
}
</style>
