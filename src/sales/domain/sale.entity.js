import { SaleItem } from "./sale-item.entity.js";

/**
 * Entidad principal (Aggregate Root) del Bounded Context de Ventas.
 */
export class Sale {
    /**
     * @param {Object} params - Atributos de la cabecera de la venta.
     * @param {string|number|null} [params.id=null] - Identificador único de la transacción.
     * @param {string} [params.customerName='Cliente Frecuente'] - Nombre o Razón Social.
     * @param {number} [params.totalAmount=0.0] - Monto total calculado.
     * @param {string} [params.status='COMPLETED'] - Estado de la transacción (COMPLETED, CANCELLED).
     * @param {Array} [params.items=[]] - Arreglo de SaleItem.
     * @param {string} [params.createdAt=new Date().toISOString()] - Fecha de la transacción.
     */
    constructor({ id = null, customerName = 'Cliente Frecuente', totalAmount = 0.0, status = 'COMPLETED', items = [], createdAt = new Date().toISOString() }) {
        this.id = id;
        this.customerName = customerName;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.items = items.map(item => new SaleItem(item));
    }
}