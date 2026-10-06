import { defineStore } from "pinia";
import { ref } from "vue";
import { DispatchesApi } from "../infrastructure/dispatches-api.js";
import { DispatchAssembler } from "../infrastructure/dispatch.assembler.js";

const dispatchesApi = new DispatchesApi();

/**
 * Store de Pinia que orquesta los casos de uso de Logística.
 */
export const useDispatchesStore = defineStore('dispatches', () => {
    const dispatches = ref([]);
    const errors = ref([]);
    const dispatchesLoaded = ref(false);

    function fetchDispatches() {
        dispatchesApi.getDispatches().then(response => {
            dispatches.value = DispatchAssembler.toEntitiesFromResponse(response);
            dispatchesLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function createDispatch(dispatch) {
        return new Promise((resolve, reject) => {
            dispatchesApi.createDispatch(dispatch).then(response => {
                const newDispatch = DispatchAssembler.toEntityFromResource(response.data);
                dispatches.value.unshift(newDispatch);
                resolve(newDispatch);
            }).catch(error => {
                errors.value.push(error);
                reject(error);
            });
        });
    }

    function updateDispatchStatus(dispatchId, newStatus) {
        const dispatchToUpdate = dispatches.value.find(d => d.id === dispatchId);
        if (!dispatchToUpdate) return;

        const updatedPayload = { ...dispatchToUpdate, status: newStatus };

        dispatchesApi.updateDispatchStatus(dispatchId, updatedPayload).then(response => {
            const index = dispatches.value.findIndex(d => d.id === dispatchId);
            if (index !== -1) {
                dispatches.value[index] = DispatchAssembler.toEntityFromResource(response.data);
            }
        }).catch(error => errors.value.push(error));
    }

    return {
        dispatches,
        errors,
        dispatchesLoaded,
        fetchDispatches,
        createDispatch,
        updateDispatchStatus
    };
});

export default useDispatchesStore;