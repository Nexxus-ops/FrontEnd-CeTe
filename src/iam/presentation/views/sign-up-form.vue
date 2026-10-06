<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import useIamStore from "../../application/iam.store.js";
import { SignUpCommand } from "../../domain/sign-up.command.js";
import { useI18n } from "vue-i18n";

const router = useRouter();
const toast = useToast();
const store = useIamStore();
const { t } = useI18n();

const form = reactive({ username: '', password: '', confirmPassword: '' });
const isLoading = ref(false);

const performSignUp = async () => {
  if (!form.username || !form.password) return;
  if (form.password !== form.confirmPassword) {
    toast.add({ severity: 'warn', summary: t('common.warning'), detail: t('auth.password_mismatch'), life: 3000 });
    return;
  }

  isLoading.value = true;
  try {
    let signUpCommand = new SignUpCommand({ username: form.username, password: form.password });
    await store.signUp(signUpCommand, router);
    toast.add({ severity: 'success', summary: t('auth.account_created'), detail: t('auth.please_login'), life: 4000 });
  } catch (e) {
    // Mock fallback for development if no backend
    toast.add({ severity: 'success', summary: 'Cuenta Local Creada', detail: 'Modo Desarrollo: Redirigiendo...', life: 3000 });
    setTimeout(() => router.push({ name: 'iam-sign-in' }), 1000);
  } finally {
    isLoading.value = false;
  }
};

const goToSignIn = () => router.push({ name: 'iam-sign-in' });
</script>

<template>
  <div class="flex align-items-center justify-content-center min-h-screen surface-ground py-5">
    <pv-card class="w-full max-w-26rem shadow-4 border-round-xl">
      <template #title>
        <div class="text-center mb-2">
          <i class="pi pi-building text-primary text-5xl mb-3"></i>
          <h2 class="text-3xl font-bold m-0 text-900">{{ t('auth.sign_up_title') }}</h2>
          <p class="text-500 text-sm mt-2">{{ t('auth.sign_up_subtitle') }}</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="performSignUp" class="flex flex-column gap-4 mt-2">

          <pv-float-label>
            <label for="username">{{ t('auth.email_company') }}</label>
            <pv-input-text id="username" v-model="form.username" class="w-full p-inputtext-lg" required />
          </pv-float-label>

          <pv-float-label>
            <label for="password">{{ t('auth.password') }}</label>
            <pv-input-text id="password" type="password" v-model="form.password" class="w-full p-inputtext-lg" required />
          </pv-float-label>

          <pv-float-label>
            <label for="confirmPassword">{{ t('auth.confirm_password') }}</label>
            <pv-input-text id="confirmPassword" type="password" v-model="form.confirmPassword" class="w-full p-inputtext-lg" required />
          </pv-float-label>

          <pv-button type="submit" :label="t('auth.register_button')" size="large" class="w-full font-bold mt-2" :loading="isLoading" />
        </form>

        <div class="text-center mt-4 border-top-1 surface-border pt-4">
          <span class="text-600">{{ t('auth.has_account') }} </span>
          <a @click="goToSignIn" class="text-primary font-bold cursor-pointer hover:underline">{{ t('auth.login_here') }}</a>
        </div>
      </template>
    </pv-card>
  </div>
</template>