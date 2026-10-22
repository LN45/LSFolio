<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import CreditVideo from '@/components/CreditVideo.vue'
import LecteurSigne from '@/components/LecteurSigne.vue'
import EtatSigne from '@/components/EtatSigne.vue'
import { getTheme, rechercher, signeDuJour, signes, signesDuTheme, themes } from '@/data/catalogue'
import { useTitre } from '@/composables/useTitre'
import { useFavoris } from '@/composables/useFavoris'
import { useProgression } from '@/composables/useProgression'

useTitre(undefined)

const duJour = signeDuJour()
const requete = ref('')
const resultats = computed(() => rechercher(requete.value))

const { estFavori } = useFavoris()
const { estVu, estConnu, nbConnus, nbConnusTotal } = useProgression()

const themesAvecProgres = computed(() =>
  themes.map((theme) => {
    const ids = signesDuTheme(theme.id).map((s) => s.id)
    return { theme, total: ids.length, connus: nbConnus(ids) }
  }),
)
</script>

<template>
  <p class="accroche texte-doux">Apprendre la Langue des Signes Française, un signe à la fois.</p>

  <input
    v-model="requete"
    type="search"
    class="recherche"
    placeholder="Chercher un mot…"
    aria-label="Chercher un mot"
  />

  <section v-if="requete.trim()">
    <h2>{{ resultats.length }} résultat{{ resultats.length > 1 ? 's' : '' }}</h2>
    <ul class="grille">
      <li v-for="signe in resultats" :key="signe.id">
        <RouterLink :to="{ name: 'signe', params: { signeId: signe.id } }" class="carte">
          <span>
            <strong>{{ signe.mot }}</strong>
            <small v-if="signe.note" class="texte-doux"> ({{ signe.note }})</small>
            <br />
            <small class="texte-doux">{{ getTheme(signe.themeId)?.nom }}</small>
          </span>
          <EtatSigne :favori="estFavori(signe.id)" :connu="estConnu(signe.id)" :vu="estVu(signe.id)" />
        </RouterLink>
      </li>
    </ul>
  </section>

  <template v-else>
    <section class="du-jour">
      <h2>Signe du jour</h2>
      <RouterLink :to="{ name: 'signe', params: { signeId: duJour.id } }" class="carte carte-du-jour">
        <LecteurSigne :signe="duJour" :controles="false" class="apercu" />
        <strong>{{ duJour.mot }}</strong>
      </RouterLink>
      <CreditVideo :signe="duJour" />
    </section>

    <section>
      <h2>Thèmes</h2>
      <p class="texte-doux">Tu connais {{ nbConnusTotal }} signes sur {{ signes.length }}.</p>
      <ul class="grille">
        <li v-for="{ theme, total, connus } in themesAvecProgres" :key="theme.id">
          <RouterLink
            :to="{ name: 'theme', params: { themeId: theme.id } }"
            class="carte"
            :style="{ borderLeft: `6px solid ${theme.couleur}` }"
          >
            <span class="emoji" aria-hidden="true">{{ theme.emoji }}</span>
            <span class="infos-theme">
              {{ theme.nom }}
              <br />
              <small class="texte-doux">{{ connus }} / {{ total }} connus</small>
              <span class="barre" aria-hidden="true">
                <span :style="{ width: `${(connus / total) * 100}%`, background: theme.couleur }" />
              </span>
            </span>
          </RouterLink>
        </li>
      </ul>
    </section>
  </template>
</template>

<style scoped>
.accroche {
  margin-top: 0;
}

.recherche {
  width: 100%;
  padding: 0.8rem 1rem;
  font: inherit;
  color: inherit;
  background: var(--couleur-surface);
  border: 1px solid var(--couleur-bordure);
  border-radius: var(--rayon);
}

.carte-du-jour {
  flex-direction: column;
  max-width: 24rem;
  font-size: 1.3rem;
}

.apercu {
  width: 100%;
}

.emoji {
  font-size: 1.8rem;
}

.infos-theme {
  flex: 1;
}

.barre {
  display: block;
  height: 4px;
  margin-top: 0.4rem;
  border-radius: 2px;
  background: var(--couleur-bordure);
  overflow: hidden;
}

.barre span {
  display: block;
  height: 100%;
  transition: width 0.3s;
}
</style>
