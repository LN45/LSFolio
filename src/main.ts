import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/main.css'

// Demande au navigateur de ne pas effacer les favoris et la progression
// quand l'espace disque vient à manquer (accordé d'office aux PWA installées).
navigator.storage?.persist?.().catch(() => {})

createApp(App).use(router).mount('#app')
