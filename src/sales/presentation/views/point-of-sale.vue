<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import useInventoryStore from "../../../inventory/application/inventory.store.js";
import useSalesStore from "../../application/sales.store.js";
import { Sale } from "../../domain/sale.entity.js";
import { errorMessage } from "../../../shared/infrastructure/base-api.js";
import "../sales-workspace.css";

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const inventoryStore = useInventoryStore();
const salesStore = useSalesStore();

const searchQuery = ref("");
const cart = ref([]);
const customerName = ref("");
const isProcessing = ref(false);
const checkoutError = ref("");
const requestId = ref(null);
const paymentMethod = ref("CASH");

onMounted(() => {
  if (!inventoryStore.itemsLoaded) inventoryStore.fetchItems();
});

const availableProducts = computed(() => {
  if (!searchQuery.value) return inventoryStore.items;
  return inventoryStore.items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.sku.includes(searchQuery.value),
  );
});

const cartTotal = computed(() => {
  return cart.value.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  );
});

const addToCart = (product) => {
  if (isProcessing.value) return;
  requestId.value = null;
  if (product.quantity <= 0) {
    toast.add({
      severity: "error",
      summary: t("sales.stock_out_title"),
      detail: t("sales.stock_out_detail"),
      life: 3000,
    });
    return;
  }

  const existingItem = cart.value.find(
    (item) => item.inventoryItemId === product.id,
  );

  if (existingItem) {
    if (existingItem.quantity >= product.quantity) {
      toast.add({
        severity: "warn",
        summary: t("common.warning"),
        detail: `${product.quantity} disp.`,
        life: 3000,
      });
      return;
    }
    existingItem.quantity++;
  } else {
    cart.value.push({
      inventoryItemId: product.id,
      sku: product.sku,
      name: product.name,
      quantity: 1,
      unitPrice: product.unitPrice,
    });
  }
};

const removeFromCart = (index) => {
  if (isProcessing.value) return;
  requestId.value = null;
  cart.value.splice(index, 1);
};

const processCheckout = async () => {
  if (cart.value.length === 0 || isProcessing.value) return;
  checkoutError.value = "";
  isProcessing.value = true;

  try {
    const salePayload = new Sale({
      id: requestId.value || (requestId.value = crypto.randomUUID()),
      paymentMethod: paymentMethod.value,
      customerName: customerName.value || "General",
      totalAmount: cartTotal.value,
      status: "COMPLETED",
      items: cart.value,
    });

    const completed = await salesStore.registerSale({
      ...salePayload,
      paymentMethod: paymentMethod.value,
    });

    await inventoryStore.fetchItems();
    cart.value = [];
    toast.add({
      severity: "success",
      summary: t("sales.sale_success"),
      detail: t("sales.sale_success_detail"),
      life: 3000,
    });
    router.push({ name: "sales-receipt", params: { id: completed.id } });
  } catch (error) {
    checkoutError.value = errorMessage(error);
    toast.add({
      severity: "error",
      summary: t("common.error"),
      detail: checkoutError.value,
      life: 3000,
    });
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <section class="sales-page">
    <header class="sales-page-heading">
      <div>
        <h1>{{ t("sales.new_sale") }}</h1>
        <p class="muted">{{ t("sales.workspace_help") }}</p>
      </div>
      <router-link class="sales-back-link" :to="{ name: 'sales-list' }">
        <i class="pi pi-arrow-left" aria-hidden="true"></i>{{ t("sales.history") }}
      </router-link>
    </header>
    <p v-if="checkoutError" role="alert" class="error-message">{{ checkoutError }}</p>
    <div class="pos-layout">
      <div class="pos-catalogue">
        <pv-card class="shadow-2 border-round-xl">
          <template #content>
            <pv-icon-field iconPosition="left" class="w-full">
              <pv-input-icon class="pi pi-search" />
              <pv-input-text
                v-model="searchQuery"
                :aria-label="t('sales.search')"
                :placeholder="t('sales.search')"
                class="w-full p-inputtext-lg"
              />
            </pv-icon-field>
          </template>
        </pv-card>

        <div class="pos-products">
          <div
            v-for="product in availableProducts"
            :key="product.id"
            class="pos-product"
          >
            <button
              type="button"
              class="surface-card shadow-1 p-3 border-round-xl cursor-pointer hover:shadow-3 transition-all transition-duration-200 border-1 surface-border w-full text-left"
              :disabled="product.quantity <= 0 || isProcessing"
              @click="addToCart(product)"
              :class="{
                'opacity-50 pointer-events-none': product.quantity === 0,
              }"
            >
              <div class="flex justify-content-between align-items-start mb-3">
                <span class="text-sm text-500 font-medium">{{
                  product.sku
                }}</span>
                <pv-tag
                  :severity="product.quantity > 0 ? 'success' : 'danger'"
                  :value="
                    product.quantity > 0
                      ? `${t('inventory.stock')}: ${product.quantity}`
                      : t('sales.out_of_stock')
                  "
                />
              </div>
              <div class="text-xl font-bold text-900 mb-1 line-height-3">
                {{ product.name }}
              </div>
              <div class="text-xl font-semibold text-primary">
                S/ {{ Number(product.unitPrice).toFixed(2) }}
              </div>
            </button>
          </div>
        </div>
      </div>

      <aside class="pos-cart" :aria-label="t('sales.cart')">
        <pv-card class="shadow-3 border-round-xl h-full flex flex-column">
          <template #title>
            <div
              class="flex align-items-center justify-content-between border-bottom-1 surface-border pb-3"
            >
              <span class="text-xl font-bold">{{ t("sales.cart") }}</span>
              <pv-tag
                :value="`${cart.length} ${t('sales.items')}`"
                severity="info"
                rounded
              />
            </div>
          </template>
          <template #content>
            <div class="flex flex-column gap-3 mb-4 mt-2">
              <label for="sale-customer" class="font-medium text-sm text-600">{{
                t("sales.customer_name")
              }}</label>
              <pv-input-text
                id="sale-customer"
                v-model="customerName"
                :disabled="isProcessing"
                autocomplete="name"
                placeholder="..."
                class="w-full"
              />
            </div>

            <div
              class="pos-cart-items mb-4"
            >
              <div v-if="cart.length === 0" class="text-center text-500 py-5">
                <i class="pi pi-shopping-cart text-4xl mb-3 text-300"></i>
                <p class="m-0">{{ t("sales.empty_cart") }}</p>
              </div>

              <div
                v-for="(item, index) in cart"
                :key="item.inventoryItemId"
                class="pos-cart-row"
              >
                <div class="pos-cart-item">
                  <div class="font-bold text-900">{{ item.name }}</div>
                  <div class="text-sm text-500">
                    {{ item.quantity }} x S/
                    {{ Number(item.unitPrice).toFixed(2) }}
                  </div>
                </div>
                <div class="pos-line-total">
                  S/ {{ (item.quantity * item.unitPrice).toFixed(2) }}
                </div>
                <pv-button
                  icon="pi pi-times"
                  text
                  rounded
                  severity="danger"
                  :aria-label="t('sales.remove_item', { name: item.name })"
                  :disabled="isProcessing"
                  @click="removeFromCart(index)"
                />
              </div>
            </div>

            <div class="mt-auto border-top-1 surface-border pt-4">
              <label for="point-of-sale-select-1">{{
                t("receipt.payment")
              }}</label
              ><select
                id="point-of-sale-select-1"
                class="pos-payment-select"
                v-model="paymentMethod"
                :disabled="isProcessing"
              >
                <option value="CASH">{{ t("receipt.cash") }}</option>
                <option value="CARD">{{ t("receipt.card") }}</option>
                <option value="TRANSFER">{{ t("receipt.transfer") }}</option>
              </select>
              <div class="pos-total">
                <span class="text-xl font-bold text-600">{{
                  t("sales.total_charge")
                }}</span>
                <span class="text-3xl font-bold text-primary"
                  >S/ {{ cartTotal.toFixed(2) }}</span
                >
              </div>
              <pv-button
                :label="t('sales.process_sale')"
                icon="pi pi-check"
                size="large"
                class="w-full p-3 text-lg font-bold shadow-2"
                :disabled="cart.length === 0 || isProcessing"
                :loading="isProcessing"
                @click="processCheckout"
              />
            </div>
          </template>
        </pv-card>
      </aside>
    </div>
  </section>
</template>
