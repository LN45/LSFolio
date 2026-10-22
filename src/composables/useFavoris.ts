import { computed } from 'vue'
import { db, type Favori } from '@/db'
import { useLiveQuery } from './useLiveQuery'

export function useFavoris() {
  const favoris = useLiveQuery(
    () => db.favoris.orderBy('ajouteLe').reverse().toArray(),
    [] as Favori[],
  )
  const ids = computed(() => new Set(favoris.value.map((f) => f.signeId)))

  return {
    /** Du plus récent au plus ancien */
    favoris,
    estFavori: (signeId: string) => ids.value.has(signeId),
  }
}

export async function basculerFavori(signeId: string) {
  await db.transaction('rw', db.favoris, async () => {
    if (await db.favoris.get(signeId)) await db.favoris.delete(signeId)
    else await db.favoris.add({ signeId, ajouteLe: Date.now() })
  })
}
