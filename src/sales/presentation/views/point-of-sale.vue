<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import useInventoryStore from "../../../inventory/application/inventory.store.js";
import useSalesStore from "../../application/sales.store.js";
import { Sale } from "../../domain/sale.entity.js";

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const inventoryStore = useInventoryStore();
const salesStore = useSalesStore();

const searchQuery = ref('');
const cart = ref([]);
const customerName = ref('');
const isProcessing = ref(false);

onMounted(() => {
  if (!inventoryStore.itemsLoaded) inventoryStore.fetchItems();
});

const availableProducts = computed(() => {
  if (!searchQuery.value) return inventoryStore.items;
  return inventoryStore.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.sku.includes(searchQuery.value)
  );
});

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
});

const addToCart = (product) => {
  if (product.quantity <= 0) {
    toast.add({ severity: 'error', summary: t('sales.stock_out_title'), detail: t('sales.stock_out_detail'), life: 3000 });
    return;
  }

  const existingItem = cart.value.find(item => item.inventoryItemId === product.id);

  if (existingItem) {
    if (existingItem.quantity >= product.quantity) {
      toast.add({ severity: 'warn', summary: t('common.warning'), detail: `${product.quantity} disp.`, life: 3000 });
      return;
    }
    existingItem.quantity++;
  } else {
    cart.value.push({
      inventoryItemId: product.id,
      sku: product.sku,
      name: product.name,
      quantity: 1,
      unitPrice: product.unitPrice
    });
  }
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

const processCheckout = async () => {
  if (cart.value.length === 0) return;
  isProcessing.value = true;

  try {
    const salePayload = new Sale({
      id: Date.now().toString(),
      customerName: customerName.value || 'General',
      totalAmount: cartTotal.value,
      status: 'COMPLETED',
      items: cart.value
    });

    await salesStore.registerSale(salePayload);

    for (const cartItem of cart.value) {
      const inventoryItem = inventoryStore.getItemById(cartItem.inventoryItemId);
      if(inventoryItem) {
        inventoryItem.quantity -= cartItem.quantity;
        await inventoryStore.updateItem(inventoryItem);
      }
    }

    toast.add({ severity: 'success', summary: t('sales.sale_success'), detail: t('sales.sale_success_detail'), life: 3000 });
    router.push({ name: 'sales-list' });
  } catch (error) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: 'Error', life: 3000 });
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="grid h-full m-0 gap-3">
    <div class="col-12 md:col-7 lg:col-8 flex flex-column gap-3 p-0">
      <pv-card class="shadow-2 border-round-xl">
        <template #content>
          <pv-icon-field iconPosition="left" class="w-full">
            <pv-input-icon class="pi pi-search" />
            <pv-input-text v-model="searchQuery" :placeholder="t('sales.search')" class="w-full p-inputtext-lg" />
          </pv-icon-field>
        </template>
      </pv-card>

      <div class="grid m-0 overflow-y-auto" style="max-height: calc(100vh - 200px);">
        <div v-for="product in availableProducts" :key="product.id" class="col-12 sm:col-6 lg:col-4 p-2">
          <div class="surface-card shadow-1 p-3 border-round-xl cursor-pointer hover:shadow-3 transition-all transition-duration-200 border-1 surface-border"
               @click="addToCart(product)"
               :class="{'opacity-50 pointer-events-none': product.quantity === 0}">
            <div class="flex justify-content-between align-items-start mb-3">
              <span class="text-sm text-500 font-medium">{{ product.sku }}</span>
              <pv-tag :severity="product.quantity > 0 ? 'success' : 'danger'" :value="product.quantity > 0 ? `${t('inventory.stock')}: ${product.quantity}` : t('sales.out_of_stock')" />
            </div>
            <div class="text-xl font-bold text-900 mb-1 line-height-3">{{ product.name }}</div>
            <div class="text-xl font-semibold text-primary">S/ {{ Number(product.unitPrice).toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 md:col flex-1 p-0">
      <pv-card class="shadow-3 border-round-xl h-full flex flex-column">
        <template #title>
          <div class="flex align-items-center justify-content-between border-bottom-1 surface-border pb-3">
            <span class="text-xl font-bold">{{ t('sales.cart') }}</span>
            <pv-tag :value="`${cart.length} ${t('sales.items')}`" severity="info" rounded/>
          </div>
        </template>
        <template #content>

          <div class="flex flex-column gap-3 mb-4 mt-2">
            <label class="font-medium text-sm text-600">{{ t('sales.customer_name') }}</label>
            <pv-input-text v-model="customerName" placeholder="..." class="w-full" />
          </div>

          <div class="flex-grow-1 overflow-y-auto mb-4" style="max-height: 40vh;">
            <div v-if="cart.length === 0" class="text-center text-500 py-5">
              <i class="pi pi-shopping-cart text-4xl mb-3 text-300"></i>
              <p class="m-0">{{ t('sales.empty_cart') }}</p>
            </div>

            <div v-for="(item, index) in cart" :key="index" class="flex align-items-center justify-content-between py-3 border-bottom-1 surface-border">
              <div class="flex-1 pr-3">
                <div class="font-bold text-900">{{ item.name }}</div>
                <div class="text-sm text-500">{{ item.quantity }} x S/ {{ Number(item.unitPrice).toFixed(2) }}</div>
              </div>
              <div class="font-bold text-lg mr-3">S/ {{ (item.quantity * item.unitPrice).toFixed(2) }}</div>
              <pv-button icon="pi pi-times" text rounded severity="danger" @click="removeFromCart(index)" />
            </div>
          </div>

          <div class="mt-auto border-top-1 surface-border pt-4">
            <div class="flex justify-content-between align-items-center mb-4">
              <span class="text-xl font-bold text-600">{{ t('sales.total_charge') }}</span>
              <span class="text-3xl font-bold text-primary">S/ {{ cartTotal.toFixed(2) }}</span>
            </div>
            <pv-button :label="t('sales.process_sale')" icon="pi pi-check" size="large" class="w-full p-3 text-lg font-bold shadow-2"
                       :disabled="cart.length === 0" :loading="isProcessing" @click="processCheckout" />
          </div>
        </template>
      </pv-card>
    </div>
  </div>
</template>