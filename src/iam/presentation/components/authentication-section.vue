<script setup>
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import useIamStore from "../../application/iam.store.js";
const router = useRouter();
const { t } = useI18n();
const store = useIamStore();
async function logout() {
  try {
    await store.signOut(router);
  } catch {
    /* Session is cleared even when the network is unavailable. */
  }
}
</script>
<template>
  <div class="authentication-section">
    <template v-if="store.isSignedIn"
      ><span class="user-name" :title="store.currentUsername">{{
        store.currentUsername
      }}</span
      ><pv-button
        icon="pi pi-sign-out"
        :aria-label="t('layout.logout')"
        :label="t('layout.logout')"
        text
        class="text-white"
        @click="logout" /></template
    ><template v-else
      ><router-link :to="{ name: 'iam-sign-in' }">{{
        t("layout.login")
      }}</router-link
      ><router-link :to="{ name: 'iam-sign-up' }">{{
        t("layout.register")
      }}</router-link></template
    >
  </div>
</template>
