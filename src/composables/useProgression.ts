import { computed } from 'vue'
import { db, type Progression } from '@/db'
import { useLiveQuery } from './useLiveQuery'

export function useProgression() {
  const entrees = useLiveQuery(() => db.progression.toArray(), [] as Progression[])
  const parSigne = computed(() => new Map(entrees.value.map((p) => [p.signeId, p])))

  /** Nombre de signes connus parmi une liste d'identifiants */
  function nbConnus(signeIds: string[]): number {
    return signeIds.filter((id) => parSigne.value.get(id)?.connu).length
  }

  return {
    estVu: (signeId: string) => parSigne.value.has(signeId),
    estConnu: (signeId: string) => parSigne.value.get(signeId)?.connu ?? false,
    nbVus: computed(() => entrees.value.length),
    nbConnus,
    nbConnusTotal: computed(() => entrees.value.filter((p) => p.connu).length),
  }
}

export async function marquerVu(signeId: string) {
  await db.transaction('rw', db.progression, async () => {
    const p = await db.progression.get(signeId)
    await db.progression.put({ ...p, signeId, connu: p?.connu ?? false, vuLe: Date.now() })
  })
}

/** Nombre de bonnes réponses d'affilée au quiz pour qu'un signe passe en « connu ». */
export const SERIE_POUR_CONNU = 3

/** Enregistre une réponse au quiz. Renvoie true si le signe vient de passer en « connu ». */
export async function enregistrerReponse(signeId: string, correcte: boolean): Promise<boolean> {
  return db.transaction('rw', db.progression, async () => {
    const p = await db.progression.get(signeId)
    const serie = correcte ? (p?.serie ?? 0) + 1 : 0
    const devientConnu = !p?.connu && serie >= SERIE_POUR_CONNU
    await db.progression.put({
      ...p,
      signeId,
      vuLe: p?.vuLe ?? Date.now(),
      connu: (p?.connu ?? false) || devientConnu,
      reussites: (p?.reussites ?? 0) + (correcte ? 1 : 0),
      echecs: (p?.echecs ?? 0) + (correcte ? 0 : 1),
      serie,
    })
    return devientConnu
  })
}

export async function basculerConnu(signeId: string) {
  await db.transaction('rw', db.progression, async () => {
    const p = await db.progression.get(signeId)
    await db.progression.put({ ...p, signeId, connu: !p?.connu, vuLe: p?.vuLe ?? Date.now() })
  })
}
