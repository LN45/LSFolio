import { computed, shallowRef } from 'vue'

/** Événement propre à Chrome/Edge (Android et ordinateur), absent des types DOM standard. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Écouté dès le chargement du module : l'événement peut arriver avant le montage des composants.
const invitation = shallowRef<BeforeInstallPromptEvent>()

window.addEventListener('beforeinstallprompt', (event) => {
  // Empêche la bannière automatique : on propose notre propre bouton « Installer ».
  event.preventDefault()
  invitation.value = event as BeforeInstallPromptEvent
})

window.addEventListener('appinstalled', () => {
  invitation.value = undefined
})

export function useInstallation() {
  async function installer() {
    const evenement = invitation.value
    if (!evenement) return
    await evenement.prompt()
    await evenement.userChoice
    // Une invitation ne sert qu'une fois ; le navigateur en renverra une si besoin.
    invitation.value = undefined
  }

  return {
    installable: computed(() => invitation.value !== undefined),
    installer,
  }
}
