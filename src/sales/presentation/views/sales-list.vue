<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { onMounted, toRefs } from "vue";
import useSalesStore from "../../application/sales.store.js";

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useSalesStore();
const { sales, salesLoaded, errors } = toRefs(store);
const { fetchSales, cancelSale } = store;

onMounted(() => {
  if (!store.salesLoaded) fetchSales();
});

const navigateToPOS = () => {
  router.push({ name: 'sales-pos' });
};

const confirmCancel = (sale) => {
  confirm.require({
    message: `${t('sales.cancel_sale')}: S/ ${sale.totalAmount}?`,
    header: t('common.warning'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => { cancelSale(sale.id); },
  });
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString();
};
</script>

<template>
  <div class="flex flex-column h-full">
    <div class="flex align-items-center justify-content-between mb-4">
      <h1 class="text-3xl font-bold text-color m-0">{{ t('sales.history') }}</h1>
      <pv-button :label="t('sales.new_sale')" icon="pi pi-shopping-cart" class="bg-primary border-round-lg shadow-1" @click="navigateToPOS" />
    </div>

    <pv-data-table
        :value="sales"
        :loading="!salesLoaded"
        striped-rows
        paginator
        :rows="10"
        class="shadow-2 border-round-xl overflow-hidden"
    >
      <pv-column field="id" :header="t('sales.transaction_no')">
        <template #body="slotProps"><span class="text-500 text-sm">{{ slotProps.data.id }}</span></template>
      </pv-column>
      <pv-column field="createdAt" :header="t('sales.date')">
        <template #body="slotProps">{{ formatDate(slotProps.data.createdAt) }}</template>
      </pv-column>
      <pv-column field="customerName" :header="t('sales.customer')"></pv-column>
      <pv-column field="totalAmount" :header="t('sales.total')">
        <template #body="slotProps">
          <span class="font-bold text-lg text-primary">S/ {{ Number(slotProps.data.totalAmount).toFixed(2) }}</span>
        </template>
      </pv-column>

      <pv-column field="status" :header="t('common.state')">
        <template #body="slotProps">
          <pv-tag :severity="slotProps.data.status === 'COMPLETED' ? 'success' : 'danger'"
                  :value="slotProps.data.status === 'COMPLETED' ? t('sales.completed') : t('sales.cancelled')" />
        </template>
      </pv-column>
      <pv-column :header="t('common.actions')">
        <template #body="slotProps">
          <pv-button v-if="slotProps.data.status === 'COMPLETED'"
                     icon="pi pi-times-circle" text rounded severity="danger"
                     @click="confirmCancel(slotProps.data)" v-tooltip="t('sales.cancel_sale')"/>
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>