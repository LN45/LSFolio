import Dexie, { type EntityTable } from 'dexie'

export interface Favori {
  signeId: string
  ajouteLe: number
}

export interface Progression {
  signeId: string
  /** Dernière fois que la page du signe a été ouverte */
  vuLe: number
  /** « Je connais ce signe » : coché à la main, ou après plusieurs bonnes réponses au quiz */
  connu: boolean
  /** Résultats du quiz (absents tant que le signe n'a pas été interrogé) */
  reussites?: number
  echecs?: number
  /** Bonnes réponses d'affilée */
  serie?: number
}

// Base IndexedDB locale à l'appareil : rien n'est envoyé sur internet.
// Seuls les champs indexés sont déclarés dans stores() ; ajouter un champ non indexé
// ne demande pas de nouvelle version du schéma.
export const db = new Dexie('lsfolio') as Dexie & {
  favoris: EntityTable<Favori, 'signeId'>
  progression: EntityTable<Progression, 'signeId'>
}

db.version(1).stores({
  favoris: 'signeId, ajouteLe',
  progression: 'signeId, vuLe',
})
