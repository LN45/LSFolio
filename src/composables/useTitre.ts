import { toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

/** Met à jour le titre de l'onglet : « Bonjour · LSFolio ». */
export function useTitre(titre: MaybeRefOrGetter<string | undefined>) {
  watchEffect(() => {
    const t = toValue(titre)
    document.title = t ? `${t} · LSFolio` : 'LSFolio'
  })
}
