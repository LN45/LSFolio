<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import IntrouvableView from './IntrouvableView.vue'
import LecteurSigne from '@/components/LecteurSigne.vue'
import CreditVideo from '@/components/CreditVideo.vue'
import { getSigne, getTheme, signes, signesDuTheme, type Signe } from '@/data/catalogue'
import { db } from '@/db'
import { creerQuiz, type Question } from '@/quiz/creerQuiz'
import { enregistrerReponse, SERIE_POUR_CONNU } from '@/composables/useProgression'
import { useTitre } from '@/composables/useTitre'

/** « tous », « favoris » ou l'identifiant d'un thème */
const props = defineProps<{ source: string }>()

const theme = computed(() => getTheme(props.source))
const sourceValide = computed(() => ['tous', 'favoris'].includes(props.source) || !!theme.value)
const titre = computed(() => {
  if (props.source === 'tous') return 'Tous les signes'
  if (props.source === 'favoris') return 'Mes favoris'
  return theme.value?.nom ?? 'Quiz'
})
useTitre(() => `Quiz · ${titre.value}`)

const questions = ref<Question[]>([])
const index = ref(0)
const reponseId = ref<string>()
const score = ref(0)
const rates = ref<Signe[]>([])
const nouveauxConnus = ref<Signe[]>([])
const chargement = ref(true)

const question = computed(() => questions.value[index.value])
const termine = computed(() => questions.value.length > 0 && index.value >= questions.value.length)
const correcte = computed(() => reponseId.value === question.value?.signe.id)

async function poolDuQuiz(): Promise<Signe[]> {
  if (props.source === 'tous') return signes
  if (props.source === 'favoris') {
    const favoris = await db.favoris.toArray()
    return favoris.map((f) => getSigne(f.signeId)).filter((s): s is Signe => s !== undefined)
  }
  return signesDuTheme(props.source)
}

async function demarrer() {
  chargement.value = true
  const pool = await poolDuQuiz()
  const progression = await db.progression.bulkGet(pool.map((s) => s.id))
  const parSigne = new Map(progression.flatMap((p) => (p ? [[p.signeId, p] as const] : [])))

  questions.value = creerQuiz(pool, parSigne)
  index.value = 0
  reponseId.value = undefined
  score.value = 0
  rates.value = []
  nouveauxConnus.value = []
  chargement.value = false
}

watch(() => props.source, () => sourceValide.value && demarrer(), { immediate: true })

async function repondre(choix: Signe) {
  const q = question.value
  if (!q || reponseId.value) return
  reponseId.value = choix.id
  const bonne = choix.id === q.signe.id
  if (bonne) score.value++
  else rates.value.push(q.signe)
  if (await enregistrerReponse(q.signe.id, bonne)) nouveauxConnus.value.push(q.signe)
}

function suivant() {
  index.value++
  reponseId.value = undefined
}

function classeChoix(choix: Signe) {
  if (!reponseId.value) return ''
  if (choix.id === question.value?.signe.id) return 'bonne'
  if (choix.id === reponseId.value) return 'mauvaise'
  return 'estompee'
}

const message = computed(() => {
  const ratio = score.value / questions.value.length
  if (ratio === 1) return 'Sans faute, bravo ! 🎉'
  if (ratio >= 0.7) return 'Très bien ! 👏'
  if (ratio >= 0.4) return 'Pas mal, continue comme ça ! 💪'
  return 'Ça viendra avec un peu de pratique ! 🌱'
})
</script>

<template>
  <IntrouvableView v-if="!sourceValide" />

  <section v-else>
    <RouterLink :to="{ name: 'quiz-choix' }" class="lien-retour">← Choisir un autre quiz</RouterLink>
    <h1>Quiz · {{ titre }}</h1>

    <p v-if="chargement" class="texte-doux">Préparation du quiz…</p>

    <div v-else-if="questions.length === 0" class="vide">
      <p>Aucun signe à réviser ici.</p>
      <p class="texte-doux">Ajoute des signes à tes favoris pour pouvoir t'entraîner dessus.</p>
      <RouterLink to="/" class="bouton">Parcourir les thèmes</RouterLink>
    </div>

    <!-- Fin du quiz -->
    <div v-else-if="termine" class="resultat">
      <p class="score">{{ score }} / {{ questions.length }}</p>
      <p>{{ message }}</p>

      <p v-if="nouveauxConnus.length" class="nouveaux">
        ✓ {{ nouveauxConnus.length }} signe{{ nouveauxConnus.length > 1 ? 's' : '' }} maintenant
        connu{{ nouveauxConnus.length > 1 ? 's' : '' }} ({{ SERIE_POUR_CONNU }} bonnes réponses d'affilée) :
        {{ nouveauxConnus.map((s) => s.mot).join(', ') }}
      </p>

      <template v-if="rates.length">
        <h2>À revoir</h2>
        <ul class="grille">
          <li v-for="signe in rates" :key="signe.id">
            <RouterLink :to="{ name: 'signe', params: { signeId: signe.id } }" class="carte">
              {{ signe.mot }}
              <small v-if="signe.note" class="texte-doux">({{ signe.note }})</small>
            </RouterLink>
          </li>
        </ul>
      </template>

      <div class="actions">
        <button type="button" class="bouton actif" @click="demarrer">Rejouer</button>
        <RouterLink :to="{ name: 'quiz-choix' }" class="bouton">Autre quiz</RouterLink>
      </div>
    </div>

    <!-- Question en cours -->
    <div v-else-if="question">
      <p class="avancement texte-doux">
        Question {{ index + 1 }} / {{ questions.length }} · Score : {{ score }}
      </p>
      <div class="barre" aria-hidden="true">
        <span :style="{ width: `${(index / questions.length) * 100}%` }" />
      </div>

      <LecteurSigne :signe="question.signe" masquer-mot />

      <div class="choix" role="group" aria-label="Quel est ce signe ?">
        <button
          v-for="choix in question.choix"
          :key="choix.id"
          type="button"
          class="bouton"
          :class="classeChoix(choix)"
          :disabled="!!reponseId"
          @click="repondre(choix)"
        >
          {{ choix.mot }}
          <small v-if="choix.note">({{ choix.note }})</small>
        </button>
      </div>

      <div v-if="reponseId" class="retour" role="status">
        <p v-if="correcte" class="bravo">✓ Bonne réponse !</p>
        <p v-else class="rate">
          ✗ C'était « {{ question.signe.mot }} ».
          <RouterLink :to="{ name: 'signe', params: { signeId: question.signe.id } }">Revoir ce signe</RouterLink>
        </p>
        <CreditVideo :signe="question.signe" />
        <button type="button" class="bouton actif suivant" @click="suivant">
          {{ index + 1 < questions.length ? 'Question suivante →' : 'Voir mon score' }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.avancement {
  margin: 0 0 0.4rem;
}

.barre {
  height: 6px;
  margin-bottom: 0.75rem;
  border-radius: 3px;
  background: var(--couleur-bordure);
  overflow: hidden;
}

.barre span {
  display: block;
  height: 100%;
  background: var(--couleur-primaire);
  transition: width 0.3s;
}

.choix {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 1rem;
}

.choix .bouton {
  padding: 0.9rem 0.5rem;
}

.choix .bouton:disabled {
  opacity: 1;
}

.choix .bonne {
  color: #fff;
  background: #2a9d8f;
  border-color: #2a9d8f;
}

.choix .mauvaise {
  color: #fff;
  background: #d62828;
  border-color: #d62828;
}

.choix .estompee {
  opacity: 0.45 !important;
}

.retour {
  margin-top: 1rem;
}

.retour p {
  margin: 0;
  font-weight: 600;
}

.bravo {
  color: #2a9d8f;
}

.rate {
  color: #d62828;
}

.suivant {
  width: 100%;
  margin-top: 0.75rem;
}

.resultat,
.vide {
  text-align: center;
}

.score {
  margin: 1rem 0 0;
  font-size: 3rem;
  font-weight: 800;
  color: var(--couleur-primaire);
}

.nouveaux {
  color: #2a9d8f;
}

.resultat .grille {
  text-align: left;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.resultat .bouton,
.vide .bouton {
  display: inline-block;
  text-decoration: none;
}
</style>
