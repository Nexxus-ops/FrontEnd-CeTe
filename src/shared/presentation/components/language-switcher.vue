<script setup>
import { useI18n } from "vue-i18n";
const { locale, availableLocales } = useI18n();
</script>

<template>
  <pv-select-button v-model="locale" :options="availableLocales" aria-labelledby="basic" class="custom-switcher">
    <template #option="slotProps">
      <span class="text-sm font-bold">{{ slotProps.option.toUpperCase() }}</span>
    </template>
  </pv-select-button>
</template>

<style scoped>
/* Pequeños ajustes para que encaje bien en la barra superior */
.custom-switcher :deep(.p-togglebutton) {
  padding: 0.5rem 0.75rem;
}
</style>