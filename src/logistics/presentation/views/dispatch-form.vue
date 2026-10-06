<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import useDispatchesStore from "../../application/dispatches.store.js";
import useSalesStore from "../../../sales/application/sales.store.js";
import { Dispatch } from "../../domain/dispatch.entity.js";

const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const dispatchesStore = useDispatchesStore();
const salesStore = useSalesStore();

const form = ref({ driverName: '', licensePlate: '', selectedSales: [] });
const isProcessing = ref(false);

onMounted(() => {
  if (!salesStore.salesLoaded) salesStore.fetchSales();
});

const availableSales = computed(() => {
  return salesStore.sales.filter(sale => sale.status === 'COMPLETED').map(sale => ({
    id: sale.id,
    label: `#${sale.id} - ${sale.customerName} (S/ ${sale.totalAmount})`
  }));
});

const saveManifest = async () => {
  if (!form.value.driverName || !form.value.licensePlate || form.value.selectedSales.length === 0) {
    toast.add({ severity: 'warn', summary: t('common.warning'), detail: '...', life: 3000 });
    return;
  }

  isProcessing.value = true;
  try {
    const dispatchPayload = new Dispatch({
      id: `DSP-${Date.now()}`,
      driverName: form.value.driverName,
      licensePlate: form.value.licensePlate,
      status: 'PENDING',
      saleIds: form.value.selectedSales
    });

    await dispatchesStore.createDispatch(dispatchPayload);
    toast.add({ severity: 'success', summary: t('logistics.manifest_created'), detail: t('logistics.manifest_success'), life: 3000 });
    navigateBack();
  } catch (error) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: 'Error', life: 3000 });
  } finally {
    isProcessing.value = false;
  }
};

const navigateBack = () => {
  router.push({ name: 'dispatches-list' });
};
</script>

<template>
  <div class="p-4 max-w-30rem mx-auto mt-5">
    <pv-card class="shadow-3 border-round-xl">
      <template #title>
        <div class="flex align-items-center gap-2 mb-3 border-bottom-1 surface-border pb-3">
          <i class="pi pi-truck text-2xl text-primary"></i>
          <h2 class="text-2xl font-bold m-0 text-color">{{ t('logistics.new_manifest') }}</h2>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="saveManifest" class="flex flex-column gap-4 mt-3">

          <pv-float-label>
            <label for="driverName">{{ t('logistics.driver_name') }}</label>
            <pv-input-text id="driverName" v-model="form.driverName" required class="w-full p-inputtext-lg" />
          </pv-float-label>

          <pv-float-label>
            <label for="licensePlate">{{ t('logistics.plate') }}</label>
            <pv-input-text id="licensePlate" v-model="form.licensePlate" required class="w-full p-inputtext-lg" />
          </pv-float-label>

          <div class="flex flex-column gap-2">
            <label class="font-medium text-sm text-600">{{ t('logistics.sales_dispatch') }}</label>
            <pv-select
                v-model="form.selectedSales"
                :options="availableSales"
                optionLabel="label"
                optionValue="id"
                :placeholder="t('logistics.select_transactions')"
                class="w-full" />
          </div>

          <div class="flex justify-content-end gap-2 mt-4 pt-3 border-top-1 surface-border">
            <pv-button :label="t('common.cancel')" severity="secondary" @click="navigateBack" text class="font-bold" />
            <pv-button :label="t('logistics.schedule_route')" type="submit" icon="pi pi-map" class="font-bold" :loading="isProcessing"/>
          </div>
        </form>
      </template>
    </pv-card>
  </div>
</template>