import useIamStore from '../application/iam.store.js';
export const authenticationGuard = to => {
  if (to.meta.public) return true;
  const store = useIamStore();
  if (!store.ensureSession()) return { name: 'iam-sign-in' };
  if (to.meta.roles && !to.meta.roles.includes(store.currentRole)) return { name: 'home' };
  return true;
};
