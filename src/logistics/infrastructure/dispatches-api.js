import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const dispatchesEndpointPath = import.meta.env.VITE_DISPATCHES_ENDPOINT_PATH || "/dispatches";

/**
 * Puerta de enlace de infraestructura para el API de Logística/Despachos.
 *
 * @class DispatchesApi
 * @extends BaseApi
 */
export class DispatchesApi extends BaseApi {
    #dispatchesEndpoint;

    constructor() {
        super();
        this.#dispatchesEndpoint = new BaseEndpoint(this, dispatchesEndpointPath);
    }

    /** Obtiene todo el historial de manifiestos de despacho */
    getDispatches() {
        return this.#dispatchesEndpoint.getAll();
    }

    /** Obtiene un manifiesto por su ID */
    getDispatchById(id) {
        return this.#dispatchesEndpoint.getById(id);
    }

    /** Registra un nuevo manifiesto de despacho (Asignación de ruta) */
    createDispatch(resource) {
        return this.#dispatchesEndpoint.create(resource);
    }

    /** Actualiza el estado de un despacho (Ej. De IN_TRANSIT a DELIVERED) */
    updateDispatchStatus(id, resource) {
        return this.#dispatchesEndpoint.update(id, resource);
    }
}