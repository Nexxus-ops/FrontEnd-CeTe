import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const salesEndpointPath = import.meta.env.VITE_SALES_ENDPOINT_PATH || "/sales";

/**
 * Puerta de enlace de infraestructura para el API de Ventas.
 */
export class SalesApi extends BaseApi {
    #salesEndpoint;

    constructor() {
        super();
        this.#salesEndpoint = new BaseEndpoint(this, salesEndpointPath);
    }

    /** Obtiene el historial de ventas */
    getSales() {
        return this.#salesEndpoint.getAll();
    }

    /** Registra una nueva transacción comercial */
    createSale(resource) {
        return this.#salesEndpoint.create(resource);
    }

    /** Cambia el estado de una venta a anulada (No se borra por auditoría) */
    cancelSale(id, resource) {
        return this.#salesEndpoint.update(id, resource);
    }
}