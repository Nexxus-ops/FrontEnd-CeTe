import { defineStore } from "pinia";
import { ref } from "vue";
import { SalesApi } from "../infrastructure/sales-api.js";
import { SaleAssembler } from "../infrastructure/sale.assembler.js";

const salesApi = new SalesApi();

/**
 * Store de Pinia que orquesta los casos de uso de Ventas.
 */
export const useSalesStore = defineStore('sales', () => {
    const sales = ref([]);
    const errors = ref([]);
    const salesLoaded = ref(false);

    function fetchSales() {
        return new Promise((resolve, reject) => {
            salesApi.getSales().then(response => {
                sales.value = SaleAssembler.toEntitiesFromResponse(response);
                salesLoaded.value = true;
                resolve(sales.value);
            }).catch(error => {
                errors.value.push(error);
                reject(error);
            });
        });
    }

    function registerSale(sale) {
        return new Promise((resolve, reject) => {
            salesApi.createSale(sale).then(response => {
                const newSale = SaleAssembler.toEntityFromResource(response.data);
                sales.value.unshift(newSale); // Agregamos al inicio del historial local
                resolve(newSale);
            }).catch(error => {
                errors.value.push(error);
                reject(error);
            });
        });
    }

    function cancelSale(saleId) {
        return new Promise((resolve, reject) => {
            const saleToCancel = sales.value.find(s => s.id === saleId);
            if (!saleToCancel) return reject(new Error("Venta no encontrada"));

            const updatedPayload = { ...saleToCancel, status: 'CANCELLED' };

            salesApi.cancelSale(saleId, updatedPayload).then(response => {
                const index = sales.value.findIndex(s => s.id === saleId);
                if (index !== -1) {
                    sales.value[index] = SaleAssembler.toEntityFromResource(response.data);
                }
                resolve(sales.value[index]);
            }).catch(error => {
                errors.value.push(error);
                reject(error);
            });
        });
    }

    return {
        sales,
        errors,
        salesLoaded,
        fetchSales,
        registerSale,
        cancelSale
    };
});

export default useSalesStore;