/**
 * Representa una línea de detalle dentro de una transacción comercial.
 */
export class SaleItem {
    /**
     * @param {Object} params - Atributos del detalle.
     * @param {string|number} params.inventoryItemId - ID del producto en el almacén.
     * @param {string} params.sku - Código del producto.
     * @param {string} params.name - Nombre del producto.
     * @param {number} params.quantity - Cantidad a vender.
     * @param {number} params.unitPrice - Precio al momento de la venta.
     */
    constructor({ inventoryItemId, sku, name, quantity, unitPrice }) {
        this.inventoryItemId = inventoryItemId;
        this.sku = sku;
        this.name = name;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    /**
     * Calcula el subtotal de esta línea.
     * @returns {number}
     */
    get subtotal() {
        return this.quantity * this.unitPrice;
    }
}