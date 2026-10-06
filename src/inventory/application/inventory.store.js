import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { InventoryApi } from "../infrastructure/inventory-api.js";
import { InventoryItemAssembler } from "../infrastructure/inventory-item.assembler.js";

const inventoryApi = new InventoryApi();

/**
 * Store de Pinia que orquesta los casos de uso de Inventario.
 * Utiliza Promesas para permitir que la UI espere las respuestas del API.
 */
const useInventoryStore = defineStore('inventory', () => {
    // Estado (State)
    const items = ref([]);
    const errors = ref([]);
    const itemsLoaded = ref(false);

    // Getters
    const itemsCount = computed(() => itemsLoaded.value ? items.value.length : 0);

    // Acciones (Actions)
    function fetchItems() {
        return new Promise((resolve, reject) => {
            inventoryApi.getItems().then(response => {
                items.value = InventoryItemAssembler.toEntitiesFromResponse(response);
                itemsLoaded.value = true;
                resolve(items.value);
            }).catch(error => {
                errors.value.push(error);
                reject(error);
            });
        });
    }

    function getItemById(id) {
        return items.value.find(item => item.id == id); // Usamos == para no tener problemas de tipos (string vs number)
    }

    function addItem(item) {
        return new Promise((resolve, reject) => {
            inventoryApi.createItem(item).then(response => {
                const newEntity = InventoryItemAssembler.toEntityFromResource(response.data);
                items.value.push(newEntity); // Actualizamos estado local
                resolve(newEntity); // Resolvemos promesa
            }).catch(error => {
                errors.value.push(error);
                reject(error);
            });
        });
    }

    function updateItem(item) {
        return new Promise((resolve, reject) => {
            inventoryApi.updateItem(item).then(response => {
                const updatedEntity = InventoryItemAssembler.toEntityFromResource(response.data);
                const index = items.value.findIndex(i => i.id === updatedEntity.id);
                if (index !== -1) items.value[index] = updatedEntity;
                resolve(updatedEntity);
            }).catch(error => {
                errors.value.push(error);
                reject(error);
            });
        });
    }

    function deleteItem(item) {
        return new Promise((resolve, reject) => {
            inventoryApi.deleteItem(item.id).then(() => {
                const index = items.value.findIndex(i => i.id === item.id);
                if (index !== -1) items.value.splice(index, 1);
                resolve();
            }).catch(error => {
                errors.value.push(error);
                reject(error);
            });
        });
    }

    return {
        items, errors, itemsLoaded, itemsCount,
        fetchItems, getItemById, addItem, updateItem, deleteItem
    };
});

export default useInventoryStore;