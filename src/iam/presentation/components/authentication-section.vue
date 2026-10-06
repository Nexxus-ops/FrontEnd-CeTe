<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import useIamStore from "../../application/iam.store.js";

const { t } = useI18n();
const router = useRouter();
const store = useIamStore();

const isSignedIn = computed(() => store.isSignedIn);
const currentUsername = computed(() => store.currentUsername);

const performSignIn = () => router.push({name: 'iam-sign-in'});
const performSignUp = () => router.push({name: 'iam-sign-up'});
const performSignOut = () => store.signOut(router);
</script>

<template>
  <div class="flex align-items-center gap-2">
    <div v-if="isSignedIn" class="flex align-items-center gap-3">
      <div class="flex align-items-center gap-2 bg-primary-reverse text-primary border-round-xl px-3 py-2 font-medium">
        <i class="pi pi-user"></i>
        <span>{{ t('layout.hello') }}, {{ currentUsername }}</span>
      </div>
      <pv-button icon="pi pi-power-off" severity="danger" text rounded @click="performSignOut" v-tooltip="t('layout.logout')" />
    </div>
    <div v-else class="flex gap-2">
      <pv-button :label="t('layout.login')" text class="font-bold text-white" @click="performSignIn" />
      <pv-button :label="t('layout.register')" class="bg-accent border-none font-bold" @click="performSignUp" />
    </div>
  </div>
</template>