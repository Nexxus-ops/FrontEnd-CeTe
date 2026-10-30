<script setup>
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
const { locale, t } = useI18n();
watch(locale, value => { localStorage.setItem('cete.locale', value); document.documentElement.lang = value === 'es_419' ? 'es-419' : 'en-US'; });
</script>
<template><select v-model="locale" :aria-label="t('common.language')" class="language-select"><option value="en_US">English</option><option value="es_419">Español</option></select></template>
