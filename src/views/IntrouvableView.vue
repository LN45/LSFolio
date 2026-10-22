<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useTitre } from '@/composables/useTitre'

useTitre('Page introuvable')
</script>

<template>
  <section class="introuvable">
    <h1>Page introuvable</h1>
    <p class="texte-doux">Ce signe ou ce thème n'existe pas (ou plus).</p>
    <RouterLink to="/">Retour à l'accueil</RouterLink>
  </section>
</template>

<style scoped>
.introuvable {
  text-align: center;
  padding: 3rem 0;
}
</style>
