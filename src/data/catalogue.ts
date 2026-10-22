import { themes } from './themes'
import { signes } from './signes'
import type { Signe, Theme } from './types'

export type { Signe, Theme }
export { THEME_PAR_DEFAUT } from './themes'
export { themes, signes }

const themesParId = new Map(themes.map((t) => [t.id, t]))
const signesParId = new Map(signes.map((s) => [s.id, s]))

export function getTheme(id: string): Theme | undefined {
  return themesParId.get(id)
}

export function getSigne(id: string): Signe | undefined {
  return signesParId.get(id)
}

export function signesDuTheme(themeId: string): Signe[] {
  return signes.filter((s) => s.themeId === themeId)
}

/** Minuscules et sans accents, pour une recherche tolérante (« soeur » trouve « Sœur »). */
export function normaliser(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .toLowerCase()
    .trim()
}

export function rechercher(requete: string): Signe[] {
  const r = normaliser(requete)
  if (!r) return []
  return signes.filter((s) => normaliser(s.mot).includes(r))
}

/** Signe du jour : le même pour tout le monde une journée donnée. */
export function signeDuJour(date = new Date()): Signe {
  const jour = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000)
  return signes[jour % signes.length]!
}

/** Les licences CC0 et domaine public n'exigent pas de citer l'auteur. */
export function creditRequis(signe: Signe): boolean {
  return !/^(CC0|Public domain)$/i.test(signe.licence)
}
