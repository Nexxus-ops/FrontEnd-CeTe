import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { api } from '../../shared/infrastructure/base-api.js';
export const useIamStore = defineStore('iam', () => {
  const read = () => { try { return JSON.parse(sessionStorage.getItem('cete.profile') || 'null'); } catch { return null; } };
  const profile = ref(read());
  const errors = ref([]);
  const currentUsername = computed(() => profile.value?.username || '');
  const currentUserId = computed(() => profile.value?.id || '');
  const currentRole = computed(() => profile.value?.role || '');
  const currentToken = computed(() => profile.value ? sessionStorage.getItem('cete.token') : null);
  const isSignedIn = computed(() => !!profile.value && Date.parse(profile.value.expiresAt) > Date.now());
  function clear() {
    profile.value = null; sessionStorage.removeItem('cete.profile'); sessionStorage.removeItem('cete.token');
    for (const key of ['token','username','userId']) localStorage.removeItem(key);
    window.dispatchEvent(new Event('cete:session-changed'));
  }
  window.addEventListener('cete:unauthorized', clear);
  function ensureSession() { if (profile.value && Date.parse(profile.value.expiresAt) <= Date.now()) clear(); return !!profile.value; }
  async function signIn(command, router) {
    clear();
    try {
      const { data } = await api.post('/authentication/sign-in', command);
      if (!data.token || !data.expiresAt) throw new Error('Invalid authentication response.');
      const { token, ...user } = data;
      sessionStorage.setItem('cete.token', token); sessionStorage.setItem('cete.profile', JSON.stringify(user));
      profile.value = user; errors.value = []; window.dispatchEvent(new Event('cete:session-changed'));
      await router.push({ name: 'home' });
    } catch (error) { clear(); errors.value = [error]; throw error; }
  }
  async function signUp(command, router) { await api.post('/authentication/sign-up', command); await router.push({ name: 'iam-sign-in' }); }
  async function signOut(router) { try { await api.post('/authentication/sign-out'); } finally { clear(); await router.push({ name: 'iam-sign-in' }); } }
  return { profile, errors, currentUsername, currentUserId, currentRole, currentToken, isSignedIn, signIn, signUp, signOut, ensureSession };
});
export default useIamStore;
