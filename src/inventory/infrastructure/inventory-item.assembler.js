import { InventoryItem } from "../domain/inventory-item.entity.js";

/**
 * Patrón Assembler para mapear los recursos HTTP hacia Entidades de Dominio puras.
 */
export class InventoryItemAssembler {
    static toEntityFromResource(resource) {
        return new InventoryItem({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200 && response.status !== 201) {
            console.error(`Error en API: ${response.status}`);
            return [];
        }

        let resources = response.data instanceof Array ? response.data : response.data['items'] || [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}