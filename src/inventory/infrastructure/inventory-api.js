import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const inventoryEndpointPath = "/inventory"; // Asumimos esta ruta temporal para json-server

/**
 * Puerta de enlace de infraestructura (Gateway) para el API de Inventario.
 */
export class InventoryApi extends BaseApi {
    #inventoryEndpoint;

    constructor() {
        super();
        this.#inventoryEndpoint = new BaseEndpoint(this, inventoryEndpointPath);
    }

    getItems() {
        return this.#inventoryEndpoint.getAll();
    }

    getItemById(id) {
        return this.#inventoryEndpoint.getById(id);
    }

    createItem(resource) {
        return this.#inventoryEndpoint.create(resource);
    }

    updateItem(resource) {
        return this.#inventoryEndpoint.update(resource.id, resource);
    }

    deleteItem(id) {
        return this.#inventoryEndpoint.delete(id);
    }
}