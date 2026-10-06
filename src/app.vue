<script setup>
import Layout from "./shared/presentation/components/layout.vue";
import {useI18n} from "vue-i18n";
import {watch} from "vue";

const { t, locale } = useI18n();

// Cambia el título de la página si el usuario cambia el idioma
watch(locale, () => {
  document.title = `CeTe SaaS - ${t('sidebar.home')}`;
});
</script>

<template>
  <layout/>
</template>