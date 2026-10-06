<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import useIamStore from "../../application/iam.store.js";
import { SignInCommand } from "../../domain/sign-in.command.js";
import { useI18n } from "vue-i18n";

const router = useRouter();
const toast = useToast();
const store = useIamStore();
const { t } = useI18n();

const form = reactive({ username: '', password: '' });
const isLoading = ref(false);

const performSignIn = async () => {
  if (!form.username || !form.password) return;

  isLoading.value = true;
  try {
    let signInCommand = new SignInCommand(form);
    await store.signIn(signInCommand, router);
    toast.add({ severity: 'success', summary: t('auth.welcome'), detail: t('auth.login_success'), life: 3000 });
  } catch (e) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('auth.invalid_credentials'), life: 3000 });
  } finally {
    isLoading.value = false;
  }
};

const goToSignUp = () => router.push({ name: 'iam-sign-up' });
</script>

<template>
  <div class="flex align-items-center justify-content-center min-h-screen surface-ground">
    <pv-card class="w-full max-w-26rem shadow-4 border-round-xl">
      <template #title>
        <div class="text-center mb-2">
          <i class="pi pi-box text-primary text-5xl mb-3"></i>
          <h2 class="text-3xl font-bold m-0 text-900">{{ t('auth.sign_in_title') }}</h2>
          <p class="text-500 text-sm mt-2">{{ t('auth.sign_in_subtitle') }}</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="performSignIn" class="flex flex-column gap-4 mt-2">
          <pv-float-label>
            <label for="username">{{ t('auth.email_user') }}</label>
            <pv-input-text id="username" v-model="form.username" class="w-full p-inputtext-lg" required />
          </pv-float-label>

          <pv-float-label>
            <label for="password">{{ t('auth.password') }}</label>
            <pv-input-text id="password" type="password" v-model="form.password" class="w-full p-inputtext-lg" required />
          </pv-float-label>

          <pv-button type="submit" :label="t('layout.login')" size="large" class="w-full font-bold mt-2" :loading="isLoading" />
        </form>

        <div class="text-center mt-4 border-top-1 surface-border pt-4">
          <span class="text-600">{{ t('auth.no_account') }} </span>
          <a @click="goToSignUp" class="text-primary font-bold cursor-pointer hover:underline">{{ t('auth.register_here') }}</a>
        </div>
      </template>
    </pv-card>
  </div>
</template>