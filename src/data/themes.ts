import type { Theme } from './types'

export const THEME_PAR_DEFAUT = 'autres'

export const themes: Theme[] = [
  { id: 'salutations', nom: 'Salutations et politesse', emoji: '👋', couleur: '#5b4bdb' },
  { id: 'personnes', nom: 'Famille et personnes', emoji: '👪', couleur: '#e0607e' },
  { id: 'emotions', nom: 'Émotions et caractère', emoji: '😊', couleur: '#e76f51' },
  { id: 'couleurs', nom: 'Couleurs', emoji: '🎨', couleur: '#f0a020' },
  { id: 'nourriture', nom: 'Nourriture', emoji: '🍎', couleur: '#43aa8b' },
  { id: 'animaux', nom: 'Animaux', emoji: '🐱', couleur: '#9c6644' },
  { id: 'temps', nom: 'Le temps qui passe', emoji: '📅', couleur: '#4d7cfe' },
  { id: 'nature', nom: 'Nature et météo', emoji: '🌳', couleur: '#2a9d8f' },
  { id: 'transports', nom: 'Transports', emoji: '🚆', couleur: '#577590' },
  { id: 'lieux', nom: 'Lieux et villes', emoji: '🏙️', couleur: '#6d597a' },
  { id: 'loisirs', nom: 'Loisirs et sports', emoji: '⚽', couleur: '#f3722c' },
  { id: 'ecole', nom: 'École et travail', emoji: '🎓', couleur: '#277da1' },
  { id: 'bibliotheque', nom: 'Bibliothèque et lecture', emoji: '📚', couleur: '#b5838d' },
  { id: 'objets', nom: 'Maison, objets et vêtements', emoji: '🪑', couleur: '#8d99ae' },
  { id: 'communication', nom: 'Communiquer', emoji: '💬', couleur: '#00a6a6' },
  { id: 'questions', nom: 'Questions et petits mots', emoji: '❓', couleur: '#c77dff' },
  { id: 'actions', nom: 'Actions', emoji: '🏃', couleur: '#d62828' },
  { id: THEME_PAR_DEFAUT, nom: 'Autres mots', emoji: '✨', couleur: '#6c757d' },
]

/**
 * Rangement des signes (identifiants de src/data/videos-commons.json) par thème.
 * Un signe absent de cette liste va dans « Autres mots ».
 */
export const classement: Record<string, string[]> = {
  salutations: [
    'a-bientot', 'a-tout-a-l-heure', 'au-revoir', 'bon-appetit', 'bonjour', 'bonne-journee',
    'bonne-soiree', 'bonsoir', 'ca-va', 'coucou-accrocher-le-regard', 'de-rien', 'merci',
    'non-merci', 'pardon', 's-il-vous-plait', 'salut', 'salut-arrivee', 'salut-depart',
    'oui', 'non', 'pas-grave', 'dommage', 'super', 'accueillir',
  ],
  personnes: [
    'adolescent', 'amie', 'amies', 'amant', 'bebe', 'cousin', 'enfant', 'famille', 'femme',
    'fille', 'fille-la', 'fils', 'frere', 'garcon', 'grand-mere', 'grand-parent', 'grand-pere',
    'monsieur', 'neveu', 'niece', 'oncle', 'papa', 'parent', 'petits-enfants', 'soeur', 'tante',
    'personne', 'tout-le-monde', 'sourd', 'entendant', 'corps', 'prenom', 'divorcer',
  ],
  emotions: [
    'adorer', 'amour', 'chance', 'content', 'pas-content', 'coup-de-coeur', 'esperer', 'etonner',
    'fatigue', 'fier', 'gentil', 'laid', 'mechant', 'peur', 'pleurer', 'rire', 'sourire',
    'sympathique', 'terrible', 'triste', 'reveur', 'preferee', 'preferer', 'seule', 'mauvais', 'bon',
  ],
  couleurs: [
    'argente', 'blanc', 'bleu', 'bleu-marine', 'blond', 'chatain', 'clair', 'couleur', 'dore',
    'fonce', 'marron', 'noir', 'or', 'orange', 'rose', 'rouge', 'roux', 'vert', 'violet',
  ],
  nourriture: [
    'banane', 'boeuf', 'boire', 'cafe', 'carotte', 'champignon', 'chocolat',
    'chocolatine-pain-au-chocolat', 'coca', 'concombre', 'couscous', 'croissant', 'cuisine',
    'dessert', 'eau', 'frite', 'fromage', 'fruit', 'gateau', 'manger', 'oeuf', 'paella', 'pain',
    'pate', 'pomme', 'pomme-de-terre', 'restaurant', 'riz', 'sandwich', 'saucisson', 'sucre',
    'tartine', 'the',
  ],
  animaux: [
    'abeille', 'canard', 'cerf', 'chat', 'chien', 'coquillage', 'crabe', 'crabes', 'escargot',
    'girafe', 'lapin', 'mouton', 'oie', 'ours', 'poisson', 'poule', 'rat', 'sanglier', 'souris',
    'taureau', 'tortue-de-mer', 'tortue-de-terre', 'vache', 'veau', 'ver-de-terre', 'zoo',
  ],
  temps: [
    'anniversaire', 'apres', 'apres-midi', 'aujourd-hui', 'avant', 'bientot', 'demain', 'ete',
    'maintenant', 'matin', 'midi', 'printemps', 'retard', 'saisons-de-l-annee', 'soir', 'souvent',
    'tard', 'tot', 'tous-les-quinze-jours', 'toute-la-nuit', 'vacances', 'week-end',
    'je-n-ai-pas-le-temps', 'encore', 'sans-interruption', 'rendez-vous',
  ],
  nature: [
    'arbre', 'campagne', 'chaud', 'fleur', 'froid', 'il-y-a-du-vent', 'mer', 'montagne', 'planete',
    'plage', 'pleuvoir', 'riviere', 'soleil', 'terre', 'tremblement-de-terre', 'vent',
  ],
  transports: [
    'autoroute', 'avion', 'bus', 'camion', 'car', 'chemin', 'gare', 'montgolfiere', 'moto', 'pont',
    'route-nationale', 'rouler', 'soucoupe-volante', 'sous-marin', 'tgv', 'train', 'sens-direction',
  ],
  lieux: [
    'aix', 'aubagne', 'banque', 'bretagne', 'bureau', 'centre-ville', 'gap', 'marignane',
    'marseille', 'paris', 'usine', 'village', 'ville', 'vitrolles', 'piscine', 'cinema',
    'entree', 'sortie', 'salle', 'espace-lieu', 'emplacement', 'accueil-lieu', 'ascenseur',
    'toilettes', 'wc',
  ],
  loisirs: [
    'ballon', 'billard', 'bowling', 'cirque', 'clown', 'comedien', 'danser', 'dessin-anime', 'fete',
    'feter', 'film', 'filet', 'foot', 'jeux', 'jouet', 'jouets', 'musique', 'nager', 'palme',
    'patin-a-glace', 'patin-a-roulettes', 'ping-pong', 'pique-nique', 'planche-a-voile', 'plonger',
    'promenade', 'roller', 'se-promener', 'ski', 'snowboard', 'television', 'tennis', 'theatre',
    'acte-theatre', 'role', 'moliere', 'hypnose', 'concours', 'atelier', 'animation', 'animer',
  ],
  ecole: [
    'apprendre', 'cdi', 'certificat', 'college', 'cours', 'crayon', 'devoir', 'diplome',
    'directeur', 'ecole', 'ecrire', 'educateur', 'eleve', 'enseigner-apprendre', 'formateur',
    'formation', 'maitresse', 'medecin', 'papier', 'patron', 'pompier', 'psychologue',
    'reviser', 'salle-d-etude', 'stage', 'stagiaire', 'tableau', 'travailler', 'femme-de-menage',
    'francais-langue', 'polonais-langue', 'chinois', 'histoire-discipline', 'vocabulaire', 'mot',
    'phrase', 'president-de-la-republique', 'soigner',
  ],
  bibliotheque: [
    'bande-dessinee', 'bd', 'bibliobus', 'bibliotheque', 'carte-de-bibliotheque', 'cassette',
    'catalogue', 'catalogue-liste', 'cd', 'conte', 'consultation-sur-place',
    'consultation-sur-place-livre', 'culture', 'dvd', 'emprunter', 'espace-jeunesse', 'histoire',
    'histoire-recit', 'inscription', 'journal', 'lire', 'litterature', 'livre', 'livre-cd',
    'livre-policier', 'livre-pour-enfant', 'livre-pour-enfants', 'manga', 'multimedia', 'poesie',
    'pret', 'preter', 'prolongation-d-emprunt', 'raconter', 'rayon-lieu', 'reportage',
    'reservation', 'reserver', 'retour-des-documents', 'salle-du-conte', 'science-fiction',
    'section', 'rembourser', 'accueil',
  ],
  objets: [
    'bracelet', 'canape', 'chaise', 'chapeau', 'collant-vetement', 'fenetre', 'lit',
    'montre-accessoire', 'objet', 'pantalon', 'porte', 'poubelle', 'pullover', 'robe',
    'sac-a-main', 'short-vetement', 'vetement', 'dossier',
  ],
  communication: [
    'adresse-email', 'adresse-mail', 'appeler', 'communiquer', 'comprendre', 'compris',
    'conference-pour-les-entendants', 'conference-pour-les-sourds', 'dialoguer', 'dire',
    'discuter', 'email', 'envoyer', 'faxer', 'internet', 'je-ne-comprends-pas',
    'je-ne-crois-pas', 'je-suis-d-accord', 'parle', 'portable', 'repondre', 'se-taire', 'silence',
    'telephone', 'telephoner', 'visuel', 'conseil', 'conseiller', 'conseiller-n', 'conseiller-v',
    'demander', 'demander-conseil', 'critiquer', 'etre-contre', 'proposer', 'refuser',
    'capter-des-mots', 'nouvelle',
  ],
  questions: [
    'combien', 'comment', 'ou', 'pourquoi', 'quand', 'qui', 'moi', 'toi', 'nous', 'ma-mes',
    'son-sa-ses-leurs', 'j-ai', 'avec', 'pour', 'pour-rien', 'sauf', 'tout', 'plusieurs',
    'nombreux', 'beaucoup', 'bien', 'pareil', 'different', 'important', 'petit', 'vieux',
    'premiere', 'derniere', 'devant', 'derriere', 'au-bord-de', 'a-peu-pres', 'attention',
    'ouvert', 'ferme', 'ensemble',
  ],
  actions: [
    'a-genoux', 'abandonner', 'accompagner', 'acheter', 'achat', 'aller', 'aller-chercher',
    'apercevoir', 'apporter', 'approcher', 'arreter', 'attendre', 'boiter', 'casser', 'chercher',
    'chercher-les-ennuis', 'commande', 'commander', 'commencer', 'concentrer', 'courir', 'croiser',
    'donner-rendre', 'dormir', 'essayer', 'finir', 'glisser', 'marcher', 'mettre',
    'mettre-a-la-porte', 'moquer', 'se-moquer', 'offrir', 'oublier', 'participer', 'partir',
    'payer', 'prendre', 'presenter-montrer', 'proteger', 'regarder', 'rencontrer', 'rester',
    's-asseoir', 'se-lever', 'se-rappeler', 'se-reveiller', 'suivre', 'tomber', 'vendre', 'venir',
    'voler',
  ],
}
