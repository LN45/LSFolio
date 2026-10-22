// Importe les vidéos LSF de Lingua Libre hébergées sur Wikimedia Commons
// et génère src/data/videos-commons.json.
//
// Usage : npm run import-videos

import { writeFile } from 'node:fs/promises'

const API = 'https://commons.wikimedia.org/w/api.php'
const PREFIXE = 'LL-Q33302 (fsl)-' // Q33302 = langue des signes française sur Wikidata
const SORTIE = new URL('../src/data/videos-commons.json', import.meta.url)
const ENTETES = { 'User-Agent': 'LSFolio/0.1 (https://github.com/LN45/LSFolio)' }

// Ordre de préférence quand un même mot est signé par plusieurs personnes :
// on privilégie les licences les moins contraignantes.
const PREFERENCE_LICENCES = ['CC0', 'Public domain', 'CC BY 4.0', 'CC BY 3.0', 'CC BY-SA 4.0', 'CC BY-SA 3.0']

// Coquilles présentes dans les titres des fichiers Commons.
const CORRECTIONS = {
  Beacoup: 'Beaucoup',
  Vieu: 'Vieux',
  'Verre de terre': 'Ver de terre',
  Réveur: 'Rêveur',
  "S'il vous plait": "S'il vous plaît",
  Vitrolle: 'Vitrolles',
  Mange: 'Manger',
}

// Enregistrements de test ou sans signe exploitable.
const EXCLUSIONS = [/cam .*light/i, /^Non-signé$/, /^Signaire$/, /^Verbe directionnel$/, /^Pronom$/]

async function appelApi(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`
  const reponse = await fetch(url, { headers: ENTETES })
  if (!reponse.ok) throw new Error(`Commons a répondu ${reponse.status} pour ${url}`)
  return reponse.json()
}

async function listerFichiers() {
  const titres = []
  let suite
  do {
    const data = await appelApi({
      action: 'query',
      list: 'allpages',
      apnamespace: '6',
      apprefix: PREFIXE.replaceAll(' ', '_'),
      aplimit: '500',
      ...(suite && { apcontinue: suite }),
    })
    titres.push(...data.query.allpages.map((p) => p.title))
    suite = data.continue?.apcontinue
  } while (suite)
  return titres
}

async function infosFichiers(titres) {
  const infos = []
  for (let i = 0; i < titres.length; i += 50) {
    const data = await appelApi({
      action: 'query',
      titles: titres.slice(i, i + 50).join('|'),
      prop: 'imageinfo',
      iiprop: 'url|extmetadata',
      iiextmetadatafilter: 'LicenseShortName|Artist',
    })
    infos.push(...data.query.pages)
  }
  return infos
}

function texteBrut(html = '') {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

/** « Speaker: X Recorder: Y » ou « Original video: X Video editing: Y » → nom lisible à créditer. */
function nomAuteur(artiste, signeur) {
  const texte = texteBrut(artiste)
  const lingua = texte.match(/Speaker:\s*(.*?)\s*Recorder:/)
  if (lingua) return lingua[1]
  const montage = texte.match(/Original video:\s*(.*?)\s*Video editing:\s*(.*)$/)
  if (montage) return `${montage[1]} (montage : ${montage[2]})`
  return texte || signeur
}

function slug(texte) {
  return texte
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/œ/g, 'oe')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** « File:LL-Q33302 (fsl)-Taliba31-acte (théâtre).webm » → { signeur, mot: 'Acte', note: 'théâtre' } */
function analyserTitre(titre) {
  const reste = titre.replace(/^File:/, '').slice(PREFIXE.length).replace(/\.webm$/i, '')
  const tiret = reste.indexOf('-')
  const signeur = reste.slice(0, tiret)
  const libelle = reste.slice(tiret + 1).trim()
  const [, brut, note] = libelle.match(/^(.*?)\s*(?:\((.*)\))?$/)
  const mot = brut.charAt(0).toUpperCase() + brut.slice(1)
  return { signeur, mot: CORRECTIONS[mot] ?? mot, note: note?.trim() }
}

const rangLicence = (licence) => {
  const rang = PREFERENCE_LICENCES.indexOf(licence)
  return rang === -1 ? PREFERENCE_LICENCES.length : rang
}

const titres = await listerFichiers()
console.log(`${titres.length} vidéos trouvées sur Commons`)

const parId = new Map()
for (const page of await infosFichiers(titres)) {
  const info = page.imageinfo?.[0]
  if (!info) continue
  const { signeur, mot, note } = analyserTitre(page.title)
  // Les titres avec « ? » signalent un signe dont le sens est incertain : on les écarte,
  // de même que les doublons numérotés (« Histoire (2) ») et les enregistrements de test.
  if (!mot || note === '?' || mot.includes('?')) continue
  if (note && /^\d+$/.test(note)) continue
  if (EXCLUSIONS.some((motif) => motif.test(mot))) continue

  const video = {
    id: slug(note ? `${mot} ${note}` : mot),
    mot,
    ...(note && { note }),
    video: info.url.split('?')[0],
    auteur: nomAuteur(info.extmetadata?.Artist?.value, signeur),
    licence: info.extmetadata?.LicenseShortName?.value ?? 'inconnue',
    source: info.descriptionurl,
  }

  const existante = parId.get(video.id)
  if (!existante || rangLicence(video.licence) < rangLicence(existante.licence)) {
    parId.set(video.id, video)
  }
}

const videos = [...parId.values()].sort((a, b) => a.id.localeCompare(b.id))
await writeFile(SORTIE, JSON.stringify(videos, null, 2) + '\n')
console.log(`${videos.length} signes uniques écrits dans src/data/videos-commons.json`)
