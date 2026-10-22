<script setup lang="ts">
import { creditRequis, type Signe } from '@/data/catalogue'

defineProps<{ signe: Signe }>()
</script>

<template>
  <p class="credit">
    <template v-if="creditRequis(signe)">Vidéo : {{ signe.auteur }} – </template>
    <a :href="signe.source" target="_blank" rel="noopener">{{ signe.licence }}, Wikimedia Commons</a>
  </p>
</template>

<style scoped>
.credit {
  margin: 0.4rem 0 0;
  font-size: 0.75rem;
  color: var(--couleur-texte-doux);
}

.credit a {
  color: inherit;
}
</style>
