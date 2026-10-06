/**
 * Entidad principal del Bounded Context de Logística (Despachos).
 * Representa un manifiesto de ruta para entregar ventas a clientes.
 *
 * @class Dispatch
 */
export class Dispatch {
    /**
     * @param {Object} params - Atributos de la entidad.
     * @param {string|number|null} [params.id=null] - Identificador único del manifiesto.
     * @param {string} [params.driverName=''] - Nombre del conductor asignado.
     * @param {string} [params.licensePlate=''] - Placa del vehículo de transporte.
     * @param {string} [params.status='PENDING'] - Estado del despacho (PENDING, IN_TRANSIT, DELIVERED, INCIDENT).
     * @param {Array} [params.saleIds=[]] - IDs de las ventas consolidadas en este despacho.
     * @param {string} [params.createdAt=new Date().toISOString()] - Fecha de creación del manifiesto.
     */
    constructor({ id = null, driverName = '', licensePlate = '', status = 'PENDING', saleIds = [], createdAt = new Date().toISOString() }) {
        this.id = id;
        this.driverName = driverName;
        this.licensePlate = licensePlate;
        this.status = status;
        this.saleIds = saleIds;
        this.createdAt = createdAt;
    }

    /**
     * Verifica si el despacho está en tránsito.
     * @returns {boolean}
     */
    get isInTransit() {
        return this.status === 'IN_TRANSIT';
    }

    /**
     * Verifica si el despacho ya fue entregado.
     * @returns {boolean}
     */
    get isDelivered() {
        return this.status === 'DELIVERED';
    }
}