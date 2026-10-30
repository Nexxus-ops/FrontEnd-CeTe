<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const landing = import.meta.env.VITE_LANDING_URL || 'https://nexxus-ops.github.io/nexxus-landing-page/';
</script>

<template>
  <footer class="w-full surface-900 py-4 px-4 border-top-1 surface-border">
    <div class="flex flex-column align-items-center justify-content-center text-center">
      <p class="m-0 text-sm font-medium text-400">
        {{ t('layout.copyright') }}
      </p>
      <p class="m-0 text-xs mt-2 text-500">
        {{ t('layout.subtitle') }}
      </p>
    </div>
  <nav class="footer-navigation" aria-label="Legal"><a :href="landing+'terms.html'" target="_blank" rel="noopener noreferrer">{{t('legal.terms')}}</a><a :href="landing+'privacy.html'" target="_blank" rel="noopener noreferrer">{{t('legal.privacy')}}</a><a :href="landing+'guide.html'" target="_blank" rel="noopener noreferrer">{{t('legal.guide')}}</a></nav></footer>
</template>