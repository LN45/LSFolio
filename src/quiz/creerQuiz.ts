import { normaliser, signes as tousLesSignes, signesDuTheme, type Signe } from '@/data/catalogue'
import type { Progression } from '@/db'

export const NB_QUESTIONS = 10
export const NB_CHOIX = 4

export interface Question {
  signe: Signe
  /** La bonne réponse et NB_CHOIX - 1 leurres, dans le désordre */
  choix: Signe[]
}

export function melanger<T>(liste: readonly T[]): T[] {
  const copie = [...liste]
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copie[i], copie[j]] = [copie[j]!, copie[i]!]
  }
  return copie
}

/**
 * Plus le score est bas, plus le signe a de chances d'être interrogé :
 * on revoit en priorité ce qu'on rate ou qu'on n'a jamais vu en quiz.
 * Une part de hasard évite de toujours tomber sur les mêmes.
 */
function priorite(p: Progression | undefined): number {
  const maitrise = p ? (p.reussites ?? 0) - 2 * (p.echecs ?? 0) + (p.connu ? 2 : 0) : -1
  return maitrise + Math.random() * 3
}

/** Leurres : d'abord dans le même thème (plus difficile), puis ailleurs ; jamais deux fois le même mot. */
function leurres(signe: Signe): Signe[] {
  const motsPris = new Set([normaliser(signe.mot)])
  const candidats = [
    ...melanger(signesDuTheme(signe.themeId)),
    ...melanger(tousLesSignes.filter((s) => s.themeId !== signe.themeId)),
  ]
  const retenus: Signe[] = []
  for (const candidat of candidats) {
    const mot = normaliser(candidat.mot)
    if (motsPris.has(mot)) continue
    motsPris.add(mot)
    retenus.push(candidat)
    if (retenus.length === NB_CHOIX - 1) break
  }
  return retenus
}

export function creerQuiz(pool: Signe[], progression: Map<string, Progression>): Question[] {
  const choisis = pool
    .map((signe) => ({ signe, poids: priorite(progression.get(signe.id)) }))
    .sort((a, b) => a.poids - b.poids)
    .slice(0, NB_QUESTIONS)
    .map(({ signe }) => signe)

  return melanger(choisis).map((signe) => ({
    signe,
    choix: melanger([signe, ...leurres(signe)]),
  }))
}
