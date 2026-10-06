import { Dispatch } from "../domain/dispatch.entity.js";

/**
 * Mapea los recursos de la API hacia entidades de dominio puras.
 *
 * @class DispatchAssembler
 */
export class DispatchAssembler {
    /**
     * @param {Object} resource - Payload JSON desde la API.
     * @returns {Dispatch} Entidad de dominio construida.
     */
    static toEntityFromResource(resource) {
        return new Dispatch({ ...resource });
    }

    /**
     * @param {import('axios').AxiosResponse} response - Respuesta HTTP cruda.
     * @returns {Dispatch[]} Colección de entidades.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`Error en API Logística: ${response.status} - ${response.statusText}`);
            return [];
        }

        let resources = response.data instanceof Array ? response.data : response.data['dispatches'] || [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}