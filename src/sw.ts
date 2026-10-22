/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { createPartialResponse } from 'workbox-range-requests'

declare let self: ServiceWorkerGlobalScope

// --- Application : HTML, JS, CSS et icônes, disponibles hors ligne ---
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// Nouvelle version déployée : elle prend la main sans attendre la fermeture des onglets.
self.skipWaiting()
clientsClaim()

// --- Vidéos des signes (Wikimedia Commons) ---
//
// Le navigateur lit les vidéos par morceaux (en-tête « Range », réponses 206),
// et une réponse partielle ne peut pas être mise en cache. On télécharge donc
// le fichier entier une seule fois, on le garde, puis on découpe nous-mêmes
// les morceaux demandés à partir de la copie en cache.

const CACHE_VIDEOS = 'lsfolio-videos-v1'
/** Au-delà, les vidéos les plus anciennement mises en cache sont supprimées (~1 Mo chacune). */
const MAX_VIDEOS = 300

const telechargementsEnCours = new Map<string, Promise<Response>>()

function estVideoDeSigne(url: URL) {
  return url.hostname === 'upload.wikimedia.org' && url.pathname.endsWith('.webm')
}

async function limiterCache(cache: Cache) {
  const cles = await cache.keys()
  for (const cle of cles.slice(0, Math.max(0, cles.length - MAX_VIDEOS))) {
    await cache.delete(cle)
  }
}

/** Renvoie la vidéo complète depuis le cache, ou la télécharge (une seule fois même si plusieurs demandes arrivent). */
async function videoComplete(url: string): Promise<Response> {
  const cache = await caches.open(CACHE_VIDEOS)
  const enCache = await cache.match(url)
  if (enCache) return enCache

  let telechargement = telechargementsEnCours.get(url)
  if (!telechargement) {
    telechargement = (async () => {
      const reponse = await fetch(url, { mode: 'cors', credentials: 'omit' })
      if (reponse.ok) {
        await cache.put(url, reponse.clone())
        await limiterCache(cache)
      }
      return reponse
    })().finally(() => telechargementsEnCours.delete(url))
    telechargementsEnCours.set(url, telechargement)
  }
  return (await telechargement).clone()
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || !estVideoDeSigne(new URL(request.url))) return

  event.respondWith(
    (async () => {
      try {
        const complete = await videoComplete(request.url)
        if (!complete.ok) return complete
        return request.headers.has('range') ? await createPartialResponse(request, complete) : complete
      } catch {
        // Hors ligne et vidéo jamais vue : le lecteur affichera son message d'erreur.
        return Response.error()
      }
    })(),
  )
})
