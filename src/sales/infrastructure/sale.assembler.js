import { Sale } from "../domain/sale.entity.js";

/**
 * Ensamblador para mapear JSON a entidades puras de Venta
 */
export class SaleAssembler {
    static toEntityFromResource(resource) {
        return new Sale({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200 && response.status !== 201) {
            console.error(`Error en API Ventas: ${response.status}`);
            return [];
        }

        let resources = response.data instanceof Array ? response.data : response.data['sales'] || [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}