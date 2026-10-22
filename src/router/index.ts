import { createRouter, createWebHashHistory } from 'vue-router'
import AccueilView from '@/views/AccueilView.vue'

// Historique « hash » (#/signe/bonjour) : GitHub Pages ne sait pas rediriger
// les URL inconnues vers index.html, le # garantit que tout lien partagé s'ouvre.
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'accueil', component: AccueilView },
    {
      path: '/theme/:themeId',
      name: 'theme',
      component: () => import('@/views/ThemeView.vue'),
      props: true,
    },
    {
      path: '/signe/:signeId',
      name: 'signe',
      component: () => import('@/views/SigneView.vue'),
      props: true,
    },
    {
      path: '/quiz',
      name: 'quiz-choix',
      component: () => import('@/views/QuizChoixView.vue'),
    },
    {
      path: '/quiz/:source',
      name: 'quiz',
      component: () => import('@/views/QuizView.vue'),
      props: true,
    },
    {
      path: '/favoris',
      name: 'favoris',
      component: () => import('@/views/FavorisView.vue'),
    },
    {
      path: '/:cheminInconnu(.*)*',
      name: 'introuvable',
      component: () => import('@/views/IntrouvableView.vue'),
    },
  ],
  scrollBehavior(_to, _from, positionSauvegardee) {
    return positionSauvegardee ?? { top: 0 }
  },
})

export default router
