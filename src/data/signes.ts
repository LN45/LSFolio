import videos from './videos-commons.json'
import { classement, THEME_PAR_DEFAUT } from './themes'
import type { Signe, VideoCommons } from './types'

const themeParSigne = new Map(
  Object.entries(classement).flatMap(([themeId, ids]) => ids.map((id) => [id, themeId] as const)),
)

export const signes: Signe[] = (videos as VideoCommons[])
  .map((v) => ({ ...v, themeId: themeParSigne.get(v.id) ?? THEME_PAR_DEFAUT }))
  .sort((a, b) => a.mot.localeCompare(b.mot, 'fr'))
