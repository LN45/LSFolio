<script setup lang="ts">
const titre = 'LSFolio'
</script>

<template>
  <main class="accueil">
    <h1>{{ titre }}</h1>
    <p>Apprendre la Langue des Signes Française, un signe à la fois.</p>
  </main>
</template>

<style scoped>
.accueil {
  max-width: 40rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  text-align: center;
}

h1 {
  color: var(--couleur-primaire);
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}
</style>
