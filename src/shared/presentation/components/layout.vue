<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import LanguageSwitcher from "./language-switcher.vue";
import FooterContent from "./footer-content.vue";
import AuthenticationSection from "../../../iam/presentation/components/authentication-section.vue";

const { t } = useI18n();
const router = useRouter();

const drawerVisible = ref(false);

const toggleDrawer = () => {
  drawerVisible.value = !drawerVisible.value;
};

const menuItems = [
  { label: 'sidebar.home', icon: 'pi pi-home', to: '/home' },
  { label: 'sidebar.inventory', icon: 'pi pi-box', to: '/inventory' },
  { label: 'sidebar.sales', icon: 'pi pi-shopping-cart', to: '/sales' },
  { label: 'sidebar.dispatches', icon: 'pi pi-truck', to: '/dispatches' },
  { label: 'sidebar.reports', icon: 'pi pi-chart-bar', to: '/about' }
];

const navigateTo = (path) => {
  router.push(path);
  drawerVisible.value = false;
};
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>

  <div class="min-h-screen flex flex-column">
    <header class="fixed top-0 left-0 w-full z-5 shadow-2">
      <pv-toolbar class="bg-primary border-none border-noround px-4 py-3">
        <template #start>
          <pv-button icon="pi pi-bars" text class="text-white mr-3 hover:bg-white-alpha-20" @click="toggleDrawer" />
          <div class="flex align-items-center gap-2 cursor-pointer" @click="navigateTo('/home')">
            <i class="pi pi-box text-2xl text-white"></i>
            <h2 class="m-0 text-white font-bold tracking-wides">{{ t('layout.workspace') }}</h2>
          </div>
        </template>
        <template #end>
          <div class="flex align-items-center gap-3">
            <authentication-section/>
            <language-switcher/>
          </div>
        </template>
      </pv-toolbar>
    </header>

    <pv-drawer v-model:visible="drawerVisible" class="w-18rem">
      <template #header>
        <div class="flex align-items-center gap-2 font-bold text-xl text-primary">
          <i class="pi pi-box text-2xl"></i>
          <span>{{ t('layout.workspace') }}</span>
        </div>
      </template>

      <div class="flex flex-column h-full mt-4 gap-2">
        <pv-button
            v-for="item in menuItems"
            :key="item.label"
            :icon="item.icon"
            :label="t(item.label)"
            class="p-button-text text-left text-700 hover:surface-100 justify-content-start font-medium border-round-lg px-3 py-3 w-full"
            @click="navigateTo(item.to)"
        />
      </div>
    </pv-drawer>

    <main class="flex-grow-1 p-4 md:p-5 mt-7 surface-ground">
      <router-view/>
    </main>

    <footer-content/>
  </div>
</template>

<style scoped>
</style>