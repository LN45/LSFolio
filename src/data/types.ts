export interface Theme {
  /** Identifiant utilisé dans les URL, ex. « salutations » */
  id: string
  nom: string
  emoji: string
  /** Couleur d'accent de la carte du thème */
  couleur: string
}

/** Une vidéo telle qu'importée depuis Wikimedia Commons (src/data/videos-commons.json). */
export interface VideoCommons {
  /** Identifiant unique utilisé dans les URL, ex. « bonjour » */
  id: string
  mot: string
  /** Précision sur le sens, ex. « théâtre » pour « Acte » */
  note?: string
  /** URL directe du fichier vidéo */
  video: string
  /** Personne à créditer, comme demandé par la licence */
  auteur: string
  /** Licence de la vidéo, ex. « CC BY 3.0 » ou « CC0 » */
  licence: string
  /** Page de description du fichier sur Wikimedia Commons */
  source: string
}

export interface Signe extends VideoCommons {
  themeId: string
}
