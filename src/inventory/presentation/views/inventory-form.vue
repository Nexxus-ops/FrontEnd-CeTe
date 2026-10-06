<script setup>
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import useInventoryStore from "../../application/inventory.store.js";
import { computed, onMounted, ref } from "vue";
import { InventoryItem } from "../../domain/inventory-item.entity.js";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const store = useInventoryStore();
const { addItem, updateItem, getItemById, fetchItems } = store;

const form = ref({ sku: '', name: '', quantity: 0, unitPrice: 0.0 });
const isEdit = computed(() => !!route.params.id);
const isLoading = ref(false);

onMounted(async () => {
  if (!store.itemsLoaded) {
    await fetchItems();
  }

  if (isEdit.value) {
    const item = getItemById(route.params.id);
    if (item) {
      form.value.sku = item.sku;
      form.value.name = item.name;
      form.value.quantity = item.quantity;
      form.value.unitPrice = item.unitPrice;
    } else {
      router.push({ name: 'inventory-list' });
    }
  }
});

const saveItem = async () => {
  isLoading.value = true;
  try {
    const item = new InventoryItem({
      id: isEdit.value ? route.params.id : Date.now().toString(),
      sku: form.value.sku,
      name: form.value.name,
      quantity: form.value.quantity,
      unitPrice: form.value.unitPrice
    });

    if (isEdit.value) {
      await updateItem(item);
    } else {
      await addItem(item);
    }

    navigateBack();
  } catch (error) {
    console.error("Error", error);
  } finally {
    isLoading.value = false;
  }
};

const navigateBack = () => router.push({ name: 'inventory-list' });
</script>

<template>
  <div class="p-4 max-w-30rem mx-auto mt-5">
    <pv-card class="shadow-3 border-round-xl">
      <template #title>
        <h2 class="text-2xl font-bold text-center m-0 text-primary">
          {{ isEdit ? t('inventory.adjust_stock') : t('inventory.add_entry') }}
        </h2>
      </template>
      <template #content>
        <form @submit.prevent="saveItem" class="flex flex-column gap-4 mt-3">

          <pv-float-label>
            <label for="sku">{{ t('inventory.sku') }}</label>
            <pv-input-text id="sku" v-model="form.sku" required class="w-full p-inputtext-lg" />
          </pv-float-label>

          <pv-float-label>
            <label for="name">{{ t('inventory.product_name') }}</label>
            <pv-input-text id="name" v-model="form.name" required class="w-full p-inputtext-lg" />
          </pv-float-label>

          <div class="flex gap-3">
            <pv-float-label class="flex-1">
              <label for="quantity">{{ t('inventory.quantity') }}</label>
              <pv-input-number id="quantity" v-model="form.quantity" required class="w-full p-inputtext-lg" :min="0" showButtons />
            </pv-float-label>

            <pv-float-label class="flex-1">
              <label for="price">{{ t('inventory.price') }}</label>
              <pv-input-number id="price" v-model="form.unitPrice" mode="currency" currency="PEN" locale="es-PE" required class="w-full p-inputtext-lg" :min="0" />
            </pv-float-label>
          </div>

          <div class="flex justify-content-end gap-2 mt-4 pt-3 border-top-1 surface-border">
            <pv-button :label="t('common.cancel')" severity="secondary" @click="navigateBack" text class="font-bold" />
            <pv-button :label="t('common.save')" type="submit" icon="pi pi-check" class="bg-accent border-none font-bold" :loading="isLoading" />
          </div>
        </form>
      </template>
    </pv-card>
  </div>
</template>