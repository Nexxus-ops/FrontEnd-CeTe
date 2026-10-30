<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const landing =
  import.meta.env.VITE_LANDING_URL || "https://cete-landing-av2.onrender.com/";
</script>

<template>
  <footer class="cete-footer">
    <div
      class="flex flex-column align-items-center justify-content-center text-center"
    >
      <p class="m-0 text-sm font-medium text-400">
        {{ t("layout.copyright") }}
      </p>
      <p class="m-0 text-xs mt-2 text-500">
        {{ t("layout.subtitle") }}
      </p>
    </div>
    <nav class="footer-navigation" aria-label="Legal">
      <a
        :href="landing + 'terms.html'"
        target="_blank"
        rel="noopener noreferrer"
        >{{ t("legal.terms") }}</a
      ><a
        :href="landing + 'privacy.html'"
        target="_blank"
        rel="noopener noreferrer"
        >{{ t("legal.privacy") }}</a
      ><a
        :href="landing + 'guide.html'"
        target="_blank"
        rel="noopener noreferrer"
        >{{ t("legal.guide") }}</a
      >
    </nav>
  </footer>
</template>

<style scoped>
.cete-footer {
  width: 100%;
  box-sizing: border-box;
  padding: 2rem 1rem;
  background: #0f172a;
  color: #cbd5e1;
  text-align: center;
}
.cete-footer p {
  color: #cbd5e1 !important;
}
.cete-footer a {
  color: #fff;
}
.cete-footer a:focus-visible {
  outline: 3px solid #fbbf24;
  outline-offset: 4px;
}
</style>
