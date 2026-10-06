import { createApp } from 'vue';
import './style.css';
import App from './app.vue';
import i18n from "./i18n.js";
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';
import { definePreset } from '@primeuix/themes';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import Tooltip from 'primevue/tooltip';

import {
    Button,
    Card,
    Checkbox,
    Column,
    ConfirmationService,
    ConfirmDialog,
    DataTable,
    Dialog,
    DialogService,
    Drawer,
    FloatLabel,
    IconField,
    InputIcon,
    InputNumber,
    InputText,
    Menu,
    Select,
    SelectButton,
    Tag,
    Toast,
    ToastService,
    Toolbar
} from "primevue";

import router from "./router.js";
import pinia from "./pinia.js";

const CeTePreset = definePreset(Material, {
    semantic: {
        primary: {
            50: '#fff3e8',
            100: '#ffe0c2',
            200: '#ffc085',
            300: '#ff9e4d',
            400: '#ff8126',
            500: '#ff6a00',
            600: '#e65c00',
            700: '#bf4c00',
            800: '#993d00',
            900: '#732e00',
            950: '#4d1f00'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{primary.500}',
                    inverseColor: '#ffffff',
                    hoverColor: '{primary.600}',
                    activeColor: '{primary.700}'
                }
            }
        }
    }
});

const app = createApp(App);

app.use(i18n)
    .use(PrimeVue, {
        theme: {
            preset: CeTePreset,
            options: {
                darkModeSelector: 'none' // Apaga el modo oscuro automático forzando el Light Theme
            }
        },
        ripple: true
    })
    .use(ConfirmationService)
    .use(DialogService)
    .use(ToastService)
    .use(router)
    .use(pinia);

app.component('pv-button', Button)
    .component('pv-card', Card)
    .component('pv-column', Column)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-checkbox', Checkbox)
    .component('pv-data-table', DataTable)
    .component('pv-dialog', Dialog)
    .component('pv-select', Select)
    .component('pv-select-button', SelectButton)
    .component('pv-float-label', FloatLabel)
    .component('pv-icon-field', IconField)
    .component('pv-input-icon', InputIcon)
    .component('pv-input-text', InputText)
    .component('pv-input-number', InputNumber)
    .component('pv-menu', Menu)
    .component('pv-drawer', Drawer)
    .component('pv-tag', Tag)
    .component('pv-toolbar', Toolbar)
    .component('pv-toast', Toast)
    .directive('tooltip', Tooltip);

app.mount('#app');