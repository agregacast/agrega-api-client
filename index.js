const axios = require('axios');
const { withQuery } = require('with-query');

const ENTRIES_ENDPOINT = '/entries';

class ApiClient {
    constructor() {
        // Stores the axios config
        this.config = null;

        // Axios instance
        this.axios = null;

        // Stores the config for the request being built
        this.currentRequest = {};
    }

    // Sets up the base config and axios instance
    setup(config) {
        const { config: instanceConfig } = this;
        // Overrides the original config in case the method gets called more than once
        this.config = {
            instanceConfig,
            ...config
        };
        // Sets up the internal axios instance with the update config
        this.setupAxios();

        return this;
    }
    // Sets up the endpoint for the query
    queryEndpoint(endpoint) {
        this.currentRequest.url = endpoint;
        return this;
    }
    // Shorcut method
    queryEntries() {
        return this.queryEndpoint(ENTRIES_ENDPOINT);
    }
    // Sets up the request params
    params(params) {
        this.currentRequest.params = params;
        return this;
    }
    // Shortcut method for performing a GET request
    get() {
        this.currentRequest.method = 'get';
        return this.makeRequest();
    }
    // Sets up the axios instance
    setupAxios() {
        // Axios instance
        this.axios = null;
        const { config } = this;
        // Validates the configuration before creating an axios instance
        if (this.validateConfig(config)) {
            const { apiUrl = null } = config;

            // Creates internal instance of axios
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

            // Set up axios interceptors
            this.setupInterceptors();
        }
    }
    // Validates the config provided. Throws an error if invalid
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

    // Set up axios interceptors
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
    // Performs the AJAX request with the params provided
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
    // Builds the request params
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
