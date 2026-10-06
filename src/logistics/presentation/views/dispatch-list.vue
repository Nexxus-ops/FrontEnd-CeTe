<script setup>
import { onMounted, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import useDispatchesStore from "../../application/dispatches.store.js";

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const store = useDispatchesStore();
const { dispatches, dispatchesLoaded } = toRefs(store);
const { fetchDispatches, updateDispatchStatus } = store;

onMounted(() => {
  if (!store.dispatchesLoaded) fetchDispatches();
});

const navigateToNew = () => {
  router.push({ name: 'dispatch-new' });
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'PENDING': return 'warn';
    case 'IN_TRANSIT': return 'info';
    case 'DELIVERED': return 'success';
    case 'INCIDENT': return 'danger';
    default: return 'secondary';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'PENDING': return t('logistics.pending');
    case 'IN_TRANSIT': return t('logistics.in_transit');
    case 'DELIVERED': return t('logistics.delivered');
    case 'INCIDENT': return t('logistics.incident');
    default: return status;
  }
};

const markAsInTransit = (id) => {
  updateDispatchStatus(id, 'IN_TRANSIT');
  toast.add({ severity: 'info', summary: t('common.success'), detail: t('logistics.in_transit'), life: 3000 });
};

const markAsDelivered = (id) => {
  updateDispatchStatus(id, 'DELIVERED');
  toast.add({ severity: 'success', summary: t('common.success'), detail: t('logistics.delivered'), life: 3000 });
};

const formatDate = (isoString) => {
  return new Date(isoString).toLocaleString();
};
</script>

<template>
  <div class="flex flex-column h-full">
    <div class="flex align-items-center justify-content-between mb-4">
      <h1 class="text-3xl font-bold text-color m-0">{{ t('logistics.monitoring') }}</h1>
      <pv-button :label="t('logistics.new_manifest')" icon="pi pi-plus" class="bg-primary border-round-lg shadow-1" @click="navigateToNew" />
    </div>

    <pv-data-table
        :value="dispatches"
        :loading="!dispatchesLoaded"
        striped-rows
        paginator
        :rows="10"
        class="shadow-2 border-round-xl overflow-hidden"
    >
      <pv-column field="id" :header="t('logistics.guide')">
        <template #body="slotProps"><span class="font-bold text-primary">{{ slotProps.data.id }}</span></template>
      </pv-column>

      <pv-column field="createdAt" :header="t('logistics.date')">
        <template #body="slotProps">{{ formatDate(slotProps.data.createdAt) }}</template>
      </pv-column>

      <pv-column field="driverName" :header="t('logistics.driver')">
        <template #body="slotProps">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-user text-500"></i>
            <span>{{ slotProps.data.driverName }}</span>
          </div>
        </template>
      </pv-column>

      <pv-column field="licensePlate" :header="t('logistics.plate')">
        <template #body="slotProps">
          <span class="border-1 surface-border p-1 border-round text-sm font-medium bg-yellow-100 text-yellow-800">{{ slotProps.data.licensePlate }}</span>
        </template>
      </pv-column>

      <pv-column field="status" :header="t('common.state')">
        <template #body="slotProps">
          <pv-tag :severity="getStatusSeverity(slotProps.data.status)"
                  :value="getStatusLabel(slotProps.data.status)" />
        </template>
      </pv-column>

      <pv-column :header="t('logistics.control')">
        <template #body="slotProps">
          <div class="flex gap-2">
            <pv-button v-if="slotProps.data.status === 'PENDING'"
                       icon="pi pi-send" size="small" :label="t('logistics.start')"
                       @click="markAsInTransit(slotProps.data.id)" />

            <pv-button v-if="slotProps.data.status === 'IN_TRANSIT'"
                       icon="pi pi-check" size="small" severity="success" :label="t('logistics.delivered')"
                       @click="markAsDelivered(slotProps.data.id)" />
          </div>
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>