<script setup>
import { ref,onMounted } from 'vue';import {useI18n} from 'vue-i18n';
import useIamStore from '../../../iam/application/iam.store.js';
import {api,errorMessage} from '../../infrastructure/base-api.js';
const {t,locale}=useI18n();const auth=useIamStore();const data=ref(null),error=ref(''),rate=ref(null);
const money=v=>new Intl.NumberFormat(locale.value==='es_419'?'es-PE':'en-US',{style:'currency',currency:'PEN'}).format(v);
onMounted(async()=>{if(auth.currentRole!=='Admin')return;try{data.value=(await api.get('/analytics/dashboard')).data;}catch(e){error.value=errorMessage(e);}try{rate.value=(await api.get('/integrations/exchange-rates')).data;}catch{rate.value=null;}});
</script>
<template><section><p class="eyebrow">{{t('layout.workspace')}}</p><h1>{{t('home.welcome_title')}}</h1><p>{{t('home.welcome_description')}}</p><p v-if="error" role="alert" class="error-message">{{error}}</p>
<div v-if="data" class="metric-grid"><article class="metric"><span>{{t('dashboard.revenue')}}</span><strong>{{money(data.dailyRevenue)}}</strong></article><article class="metric"><span>{{t('dashboard.sales')}}</span><strong>{{data.dailySales}}</strong></article><article class="metric"><span>{{t('dashboard.products')}}</span><strong>{{data.productCount}}</strong></article><article class="metric"><span>{{t('dashboard.dispatches')}}</span><strong>{{data.pendingDispatches}}</strong></article></div>
<div v-if="data" class="dashboard-grid"><article class="surface-panel"><h2>{{t('dashboard.low_stock')}}</h2><p v-if="!data.lowStock.length">{{t('dashboard.healthy')}}</p><ul class="stock-list"><li v-for="item in data.lowStock" :key="item.id"><span>{{item.name}}</span><strong>{{item.quantity}} / {{item.minimumStock}}</strong></li></ul></article>
<article class="surface-panel"><h2>{{t('dashboard.trends')}}</h2><p v-if="!data.trends.length">{{t('common.empty')}}</p><div v-for="day in data.trends" :key="day.date" class="trend-row"><span>{{day.date}}</span><meter :value="day.total" :max="Math.max(...data.trends.map(d=>d.total),1)" :aria-label="day.date"/><strong>{{money(day.total)}}</strong></div></article></div>
<article v-if="rate" class="surface-panel"><h2>{{t('dashboard.exchange')}}</h2><p>1 USD = {{rate.pen}} PEN</p><p class="muted">{{rate.updatedAt}}</p><a :href="rate.sourceUrl" target="_blank" rel="noopener noreferrer">{{rate.source}}</a></article>
<router-link :to="{name:'inventory-list'}">{{t('sidebar.inventory')}}</router-link></section></template>
