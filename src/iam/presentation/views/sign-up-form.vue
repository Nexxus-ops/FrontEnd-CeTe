<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useIamStore from '../../application/iam.store.js';
import { errorMessage } from '../../../shared/infrastructure/base-api.js';
const { t } = useI18n(); const store = useIamStore(); const router = useRouter();
const form = reactive({ username: '', password: '', companyName: '', ruc: '', address: '', confirmPassword: '' });
const loading = ref(false); const error = ref('');
async function submit() {
  error.value = '';
  if (form.password !== form.confirmPassword) { error.value = t('auth.password_mismatch'); return; }
  loading.value = true;
  try { const { confirmPassword, ...command } = form; await store.signUp(command, router); }
  catch (e) { error.value = errorMessage(e); } finally { loading.value = false; }
}
</script>
<template><section class="form-panel"><h1>{{ t('auth.sign_up_title') }}</h1><p>{{ t('auth.sign_up_subtitle') }}</p><p v-if="error" role="alert" class="error-message">{{ error }}</p>
<form @submit.prevent="submit" class="form-stack">
<label>{{ t('auth.company_name') }}<input v-model="form.companyName" required maxlength="120" autocomplete="organization"></label>
<label>{{ t('auth.ruc') }}<input v-model="form.ruc" required pattern="[0-9]{11}" maxlength="11" inputmode="numeric"></label>
<label>{{ t('auth.address') }}<input v-model="form.address" required maxlength="240" autocomplete="street-address"></label>
<label>{{ t('auth.email_company') }}<input v-model="form.username" required type="email" autocomplete="username"></label>
<label>{{ t('auth.password') }}<input v-model="form.password" required type="password" minlength="10" maxlength="128" autocomplete="new-password"></label>
<label>{{ t('auth.confirm_password') }}<input v-model="form.confirmPassword" required type="password" minlength="10" maxlength="128" autocomplete="new-password"></label>
<p>{{ t('auth.password_help') }}</p><pv-button type="submit" :label="t('auth.register_button')" :loading="loading" />
<router-link :to="{name:'iam-sign-in'}">{{ t('auth.login_here') }}</router-link>
</form></section></template>
