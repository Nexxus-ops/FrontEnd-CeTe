/**
 * Reusable endpoint client with CRUD operations over a resource collection.
 *
 * @class BaseEndpoint
 */
export class BaseEndpoint {
    /**
     * @param {import('./base-api.js').BaseApi} baseApi - Configured API client owner.
     * @param {string} endpointPath - Relative resource path.
     */
    constructor(baseApi, endpointPath) {
        this.http = baseApi.http;
        this.endpointPath = endpointPath;
    }

    getAll() {
        return this.http.get(this.endpointPath);
    }

    getById(id) {
        return this.http.get(`${this.endpointPath}/${id}`);
    }

    create(resource) {
        return this.http.post(this.endpointPath, resource);
    }

    update(id, resource) {
        return this.http.put(`${this.endpointPath}/${id}`, resource);
    }

    delete(id) {
        return this.http.delete(`${this.endpointPath}/${id}`);
    }
}