<script setup lang="ts">
// Pastilles discrètes dans les listes : ♥ favori, ✓ connu, • déjà vu.
defineProps<{ favori: boolean; connu: boolean; vu: boolean }>()
</script>

<template>
  <span class="etat">
    <span v-if="favori" class="favori" title="Favori">♥<span class="sr-only"> favori</span></span>
    <span v-if="connu" class="connu" title="Je connais">✓<span class="sr-only"> connu</span></span>
    <span v-else-if="vu" class="vu" title="Déjà vu">•<span class="sr-only"> déjà vu</span></span>
  </span>
</template>

<style scoped>
.etat {
  display: inline-flex;
  gap: 0.3rem;
  margin-left: auto;
  font-weight: 700;
}

.favori {
  color: #e0607e;
}

.connu {
  color: #2a9d8f;
}

.vu {
  color: var(--couleur-texte-doux);
}
</style>
