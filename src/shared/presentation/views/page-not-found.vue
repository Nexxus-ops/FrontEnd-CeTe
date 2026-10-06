<script setup>
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const unavailableRoute = route.path;
const { t } = useI18n();

const goHome = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <div class="flex align-items-center justify-content-center min-h-screen">
    <div class="text-center">
      <i class="pi pi-exclamation-circle text-orange-500 text-6xl mb-4"></i>
      <h1 class="text-4xl font-bold text-900 mb-3">Error 404</h1>
      <p class="text-600 mb-5 text-lg">
        La ruta <span class="font-bold text-primary">{{ unavailableRoute }}</span> no está disponible en CeTe.
      </p>
      <pv-button label="Volver al Dashboard" icon="pi pi-home" @click="goHome" size="large" />
    </div>
  </div>
</template>