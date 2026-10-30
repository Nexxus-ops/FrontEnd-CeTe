import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import es from "./locales/es.json";
const preferred = localStorage.getItem("cete.locale");
const locale = ["en_US", "es_419"].includes(preferred) ? preferred : "en_US";
document.documentElement.lang = locale === "es_419" ? "es-419" : "en-US";
export default createI18n({
  legacy: false,
  locale,
  fallbackLocale: "en_US",
  messages: { en_US: en, es_419: es },
});
