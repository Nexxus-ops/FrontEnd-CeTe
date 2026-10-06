<script setup>
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useI18n } from "vue-i18n";
import useInventoryStore from "../../application/inventory.store.js";
import { onMounted, toRefs } from "vue";

const router = useRouter();
const confirm = useConfirm();
const { t } = useI18n();
const store = useInventoryStore();
const { items, itemsLoaded } = toRefs(store);
const { fetchItems, deleteItem } = store;

onMounted(async () => {
  if (!itemsLoaded.value) {
    await fetchItems();
  }
});

const navigateToNew = () => router.push({ name: 'inventory-new' });
const navigateToEdit = (id) => router.push({ name: 'inventory-edit', params: { id } });

const confirmDelete = (item) => {
  confirm.require({
    message: `${t('common.warning')}: ${item.name}?`,
    header: t('inventory.delete_waste'),
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await deleteItem(item);
    },
  });
};
</script>

<template>
  <div class="p-4 md:p-5">
    <div class="flex align-items-center justify-content-between mb-4">
      <h1 class="text-3xl font-bold text-primary m-0">{{ t('inventory.title') }}</h1>
      <pv-button :label="t('inventory.add_entry')" icon="pi pi-plus" class="bg-accent border-none shadow-1" @click="navigateToNew" />
    </div>

    <pv-data-table
        :value="items"
        :loading="!itemsLoaded"
        striped-rows
        paginator
        :rows="10"
        :rows-per-page-options="[5, 10, 20]"
        class="shadow-2 border-round-xl overflow-hidden"
    >
      <pv-column field="sku" :header="t('inventory.sku')" sortable>
        <template #body="slotProps"><span class="font-semibold text-primary">{{ slotProps.data.sku }}</span></template>
      </pv-column>
      <pv-column field="name" :header="t('inventory.product_name')" sortable></pv-column>
      <pv-column field="quantity" :header="t('inventory.stock')" sortable>
        <template #body="slotProps">
          <pv-tag :severity="slotProps.data.quantity > 10 ? 'success' : 'danger'" :value="slotProps.data.quantity" class="text-sm px-3"/>
        </template>
      </pv-column>
      <pv-column field="unitPrice" :header="t('inventory.price')" sortable>
        <template #body="slotProps">
          <span class="font-medium">S/ {{ Number(slotProps.data.unitPrice).toFixed(2) }}</span>
        </template>
      </pv-column>
      <pv-column :header="t('common.actions')">
        <template #body="slotProps">
          <pv-button icon="pi pi-pencil" text rounded class="mr-2 text-primary" @click="navigateToEdit(slotProps.data.id)" v-tooltip="t('inventory.edit_adjust')"/>
          <pv-button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(slotProps.data)" v-tooltip="t('inventory.delete_waste')"/>
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>