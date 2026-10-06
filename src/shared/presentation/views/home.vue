<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="flex flex-column h-full">
    <div class="flex align-items-center justify-content-between mb-4">
      <h1 class="text-3xl font-bold text-900 m-0">{{ t('sidebar.home') }}</h1>
    </div>

    <div class="grid">
      <div class="col-12">
        <pv-card class="shadow-2 border-round-xl">
          <template #content>
            <div class="text-center py-6">
              <i class="pi pi-chart-line text-6xl text-primary mb-4"></i>
              <h2 class="text-2xl font-semibold text-700 mt-0 mb-2">{{ t('home.welcome_title') }}</h2>
              <p class="text-500 line-height-3 max-w-20rem mx-auto">
                {{ t('home.welcome_description') }}
              </p>
            </div>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>