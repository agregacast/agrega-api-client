const axios = require('axios');
const { withQuery } = require('with-query');

const ENTRIES_ENDPOINT = '/entries';

class ApiClient {
    constructor() {
        // Stores the axios config
        this.config = null;

        // Stores the config for the request being built
        this.currentRequest = {};

        // To do: Should we cache the request history ?
        this.requestHistory = [];

        // To do: Should we cache the response history ?
        this.responseHistory = [];

        // Axios instance
        this.axios = null;
    }

    setup(config) {
        const { config: instanceConfig } = this;
        this.config = {
            instanceConfig,
            ...config
        };
        this.setupAxios();
        return this;
    }

    queryEndpoint(endpoint) {
        this.currentRequest.url = endpoint;
        return this;
    }
    queryEntries() {
        return this.queryEndpoint(ENTRIES_ENDPOINT);
    }
    params(params) {
        this.currentRequest.params = params;
        return this;
    }
    get() {
        this.currentRequest.method = 'get';
        return this.makeRequest();
    }

    setupAxios() {
        // Axios instance
        this.axios = null;
        const { config } = this;
        if (this.validateConfig(config)) {
            const { apiUrl = null } = config;

            // Internal instance of axios
            this.axios = axios.create({
                baseURL: apiUrl,
                timeout: 5000,
                paramsSerializer: (params) => {
                    const { apiToken } = config;
                    return ApiClient.buildRequestParams({
                        token: apiToken,
                        ...params
                    });
                }
            });
            this.setupInterceptors();
        }
    }

    validateConfig(config) {
        const {
            apiUrl = null,
            apiToken = null,
            apiAccessToken = null
        } = config;

        if (!apiUrl || !apiToken || !apiAccessToken) {
            throw new Error('Invalid API configuration detected.');
        }

        return true;
    }

    setupInterceptors() {
        this.axios.interceptors.request.use(
            function (config) {
                // Do something before the request is sent
                return config;
            },
            function (error) {
                // Do something with request error
                return Promise.reject(error);
            }
        );

        this.axios.interceptors.response.use(
            function (response) {
                // Any status code that lie within the range of 2xx cause this function to trigger
                // Do something with response data
                // console.log(response);
                return response;
            },
            function (error) {
                // Any status codes that falls outside the range of 2xx cause this function to trigger
                // Do something with response error
                // console.log(error);
                return Promise.reject(error);
            }
        );
    }

    async makeRequest() {
        const { url, method = 'get', params, data } = this.currentRequest;
        const response = await this.axios.request({
            url,
            method,
            params,
            ...(method === 'post' ? data : null)
        });

        // Reset state
        this.currentRequest = {};

        return response;
    }

    static buildRequestParams(params) {
        const queryOptions = {
            stringifyOpt: {
                encode: false,
                addQueryPrefix: false
            },
            parseOpt: {
                parseArray: false
            }
        };
        // To do: Investigate why the query appends and additional "?"
        return withQuery(null, params, queryOptions).replace('?', '');
    }
}

module.exports = ApiClient;
