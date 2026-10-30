<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { api, errorMessage } from '../../../shared/infrastructure/base-api.js';
const route=useRoute();const {t,locale}=useI18n();const receipt=ref(null);const error=ref('');
const money=value=>new Intl.NumberFormat(locale.value==='es_419'?'es-PE':'en-US',{style:'currency',currency:'PEN'}).format(value);
const date=computed(()=>receipt.value?new Intl.DateTimeFormat(locale.value==='es_419'?'es-PE':'en-US',{dateStyle:'medium',timeStyle:'medium',timeZone:'America/Lima'}).format(new Date(receipt.value.issuedAt)):'');
const printReceipt=()=>window.print();
onMounted(async()=>{try{receipt.value=(await api.get('/sales/'+route.params.id+'/receipt')).data;}catch(e){error.value=errorMessage(e);}});
</script>
<template><section><div class="no-print page-actions"><router-link :to="{name:'sales-list'}">{{t('receipt.back')}}</router-link><pv-button v-if="receipt" :label="t('receipt.print')" icon="pi pi-print" @click="printReceipt"/></div>
<p v-if="error" role="alert" class="error-message">{{error}}</p><p v-else-if="!receipt" role="status">{{t('common.loading')}}</p>
<article v-if="receipt" class="receipt" aria-labelledby="receipt-title">
<header><p class="eyebrow">{{receipt.companyName}}</p><h1 id="receipt-title">{{t('receipt.title')}}</h1><p>{{t('auth.ruc')}}: {{receipt.ruc}}</p><p>{{receipt.address}}</p></header>
<p class="receipt-status">{{t('receipt.demo')}}</p><dl class="receipt-meta"><div><dt>{{t('receipt.number')}}</dt><dd>{{receipt.number}}</dd></div><div><dt>{{t('receipt.order')}}</dt><dd class="break-anywhere">{{receipt.orderId}}</dd></div><div><dt>{{t('receipt.issued')}}</dt><dd>{{date}} · Lima</dd></div><div><dt>{{t('sales.customer')}}</dt><dd>{{receipt.customerName}}</dd></div><div><dt>{{t('receipt.cashier')}}</dt><dd>{{receipt.cashier}}</dd></div><div><dt>{{t('common.state')}}</dt><dd>{{receipt.status==='CANCELLED'?t('sales.cancelled'):t('sales.completed')}}</dd></div></dl>
<div class="table-scroll"><table><caption class="sr-only">{{t('receipt.items')}}</caption><thead><tr><th>{{t('inventory.product_name')}}</th><th>{{t('inventory.quantity')}}</th><th>{{t('inventory.price')}}</th><th>{{t('sales.total')}}</th></tr></thead><tbody><tr v-for="item in receipt.items" :key="item.sku"><td>{{item.name}}<small>{{item.sku}}</small></td><td>{{item.quantity}}</td><td>{{money(item.unitPrice)}}</td><td>{{money(item.amount)}}</td></tr></tbody></table></div>
<p class="receipt-total">{{t('sales.total')}} <strong>{{money(receipt.total)}}</strong></p><p>{{t('receipt.payment')}}: {{t('receipt.'+receipt.paymentMethod.toLowerCase())}}</p><p class="muted">{{t('receipt.thanks')}}</p>
</article></section></template>
