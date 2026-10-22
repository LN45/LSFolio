import { liveQuery } from 'dexie'
import { onScopeDispose, shallowRef, type Ref } from 'vue'

/**
 * Résultat d'une requête Dexie, tenu à jour automatiquement :
 * dès que la base change (ici ou dans un autre onglet), la valeur est recalculée.
 */
export function useLiveQuery<T>(requete: () => Promise<T>, valeurInitiale: T): Readonly<Ref<T>> {
  const valeur = shallowRef(valeurInitiale) as Ref<T>
  const abonnement = liveQuery(requete).subscribe({
    next: (resultat) => (valeur.value = resultat),
    error: (erreur) => console.error('Lecture IndexedDB impossible', erreur),
  })
  onScopeDispose(() => abonnement.unsubscribe())
  return valeur
}
