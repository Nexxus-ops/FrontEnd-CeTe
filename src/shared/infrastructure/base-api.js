import axios from "axios";
import { iamInterceptor } from "../../iam/infrastructure/iam.interceptor.js";

const platformApi = import.meta.env.VITE_CETE_API_URL;

/**
 * Shared infrastructure base class that configures the HTTP client.
 *
 * @class BaseApi
 */
export class BaseApi {
    #http;

    /**
     * Initializes the Axios HTTP client with the base URL from environment variables.
     */
    constructor() {
        this.#http = axios.create({
            baseURL: platformApi,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        });

        // Cada vez que un módulo hace una petición al API, pasará por esta validación
        this.#http.interceptors.request.use(iamInterceptor);
    }

    /**
     * Returns the configured Axios HTTP client.
     * @returns {import('axios').AxiosInstance}
     */
    get http() {
        return this.#http;
    }
}