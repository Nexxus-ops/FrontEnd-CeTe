<script setup>
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useI18n } from "vue-i18n";
import useInventoryStore from "../../application/inventory.store.js";
import { onMounted, toRefs, ref } from "vue";
import { errorMessage } from "../../../shared/infrastructure/base-api.js";

const router = useRouter();
const confirm = useConfirm();
const { t } = useI18n();
const store = useInventoryStore();
const { items, itemsLoaded } = toRefs(store);
const { fetchItems, deleteItem } = store;
const actionError = ref("");

onMounted(async () => {
  if (!itemsLoaded.value) {
    await fetchItems();
  }
});

const navigateToNew = () => router.push({ name: "inventory-new" });
const navigateToEdit = (id) =>
  router.push({ name: "inventory-edit", params: { id } });

const confirmDelete = (item) => {
  actionError.value = "";
  confirm.require({
    message: `${t("common.warning")}: ${item.name}?`,
    header: t("inventory.archive"),
    icon: "pi pi-exclamation-triangle",
    acceptLabel: t("inventory.delete_waste"),
    rejectLabel: t("common.cancel"),
    accept: async () => {
      try {
        await deleteItem(item);
      } catch (error) {
        actionError.value = errorMessage(error);
      }
    },
  });
};
</script>

<template>
  <div class="p-4 md:p-5">
    <div class="flex align-items-center justify-content-between mb-4">
      <h1 class="text-3xl font-bold text-primary m-0">
        {{ t("inventory.title") }}
      </h1>
      <pv-button
        :label="t('inventory.add_entry')"
        icon="pi pi-plus"
        class="bg-accent border-none shadow-1"
        @click="navigateToNew"
      />
    </div>

    <p v-if="actionError" role="alert" class="error-message">
      {{ actionError }}
    </p>
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
        <template #body="slotProps"
          ><span class="font-semibold text-primary">{{
            slotProps.data.sku
          }}</span></template
        >
      </pv-column>
      <pv-column
        field="name"
        :header="t('inventory.product_name')"
        sortable
      ></pv-column>
      <pv-column field="quantity" :header="t('inventory.stock')" sortable>
        <template #body="slotProps">
          <pv-tag
            :severity="
              slotProps.data.quantity > (slotProps.data.minimumStock ?? 10)
                ? 'success'
                : 'danger'
            "
            :value="slotProps.data.quantity"
            class="text-sm px-3"
          />
        </template>
      </pv-column>
      <pv-column field="unitPrice" :header="t('inventory.price')" sortable>
        <template #body="slotProps">
          <span class="font-medium"
            >S/ {{ Number(slotProps.data.unitPrice).toFixed(2) }}</span
          >
        </template>
      </pv-column>
      <pv-column :header="t('common.actions')">
        <template #body="slotProps">
          <pv-button
            icon="pi pi-history"
            text
            rounded
            :aria-label="t('inventory.movements')"
            @click="
              router.push({
                name: 'inventory-movements',
                params: { id: slotProps.data.id },
              })
            "
          />
          <pv-button
            icon="pi pi-pencil"
            :aria-label="t('inventory.edit_adjust')"
            text
            rounded
            class="mr-2 text-primary"
            @click="navigateToEdit(slotProps.data.id)"
            v-tooltip="t('inventory.edit_adjust')"
          />
          <pv-button
            icon="pi pi-trash"
            :aria-label="t('inventory.archive')"
            text
            rounded
            severity="danger"
            @click="confirmDelete(slotProps.data)"
            v-tooltip="t('inventory.archive')"
          />
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>
