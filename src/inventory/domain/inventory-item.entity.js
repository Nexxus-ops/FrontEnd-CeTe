/**
 * Entidad principal del Bounded Context de Inventario.
 * Representa un artículo físico en el almacén de CeTe.
 */
export class InventoryItem {
    /**
     * @param {Object} params - Atributos de la entidad.
     * @param {number|string|null} [params.id=null] - Identificador único.
     * @param {string} [params.sku=''] - Código de barras o SKU del producto.
     * @param {string} [params.name=''] - Nombre descriptivo del producto.
     * @param {number} [params.quantity=0] - Cantidad física en stock.
     * @param {number} [params.unitPrice=0.0] - Precio unitario referencial.
     */
    constructor({ id = null, sku = '', name = '', quantity = 0, unitPrice = 0.0 }) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }
}