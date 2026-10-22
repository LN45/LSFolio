<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useInstallation } from '@/composables/useInstallation'

const { installable, installer } = useInstallation()
const logo = `${import.meta.env.BASE_URL}logo.svg`
</script>

<template>
  <header class="entete">
    <RouterLink to="/" class="logo">
      <img :src="logo" alt="" width="32" height="32" />
      LSFolio
    </RouterLink>
    <nav class="menu">
      <button v-if="installable" type="button" class="installer" @click="installer">⬇ Installer</button>
      <RouterLink :to="{ name: 'quiz-choix' }">🎯 Quiz</RouterLink>
      <RouterLink :to="{ name: 'favoris' }">♥ Favoris</RouterLink>
    </nav>
  </header>

  <main class="contenu">
    <RouterView />
  </main>
</template>

<style scoped>
.entete {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  padding-top: max(0.75rem, env(safe-area-inset-top));
  background: var(--couleur-surface);
  border-bottom: 1px solid var(--couleur-bordure);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--couleur-primaire);
  text-decoration: none;
}

.menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu a {
  font-weight: 600;
  text-decoration: none;
  color: var(--couleur-texte-doux);
}

.menu a.router-link-active {
  color: var(--couleur-primaire);
}

.installer {
  padding: 0.3rem 0.7rem;
  font: inherit;
  font-weight: 600;
  color: #fff;
  background: var(--couleur-primaire);
  border: none;
  border-radius: 999px;
  cursor: pointer;
}

.contenu {
  max-width: 48rem;
  margin: 0 auto;
  padding: 1rem 1rem 3rem;
  padding-bottom: max(3rem, env(safe-area-inset-bottom));
}
</style>
