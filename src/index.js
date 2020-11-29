const axios = require('axios');
const { withQuery } = require('with-query');

const ENTRIES_ENDPOINT = '/entries';

class ApiClient {
    constructor(config) {
        if (this.validateConfig(config)) {
            this.config = config;
            const { apiUrl = null } = config;

            // Internal instance of axios
            this.instance = axios.create({
                baseURL: apiUrl,
                timeout: 5000,
                paramsSerializer: (params) => {
                    const { apiToken } = this.config;
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
        this.instance.interceptors.request.use(
            function (config) {
                // Do something before the request is sent
                return config;
            },
            function (error) {
                // Do something with request error
                return Promise.reject(error);
            }
        );

        this.instance.interceptors.response.use(
            function (response) {
                // Any status code that lie within the range of 2xx cause this function to trigger
                // Do something with response data
                console.log(response);
                return response;
            },
            function (error) {
                // Any status codes that falls outside the range of 2xx cause this function to trigger
                // Do something with response error
                console.log(error);
                return Promise.reject(error);
            }
        );
    }

    makeRequest({ url, method = 'get', params, data }) {
        return this.instance.request({
            url,
            method,
            params,
            ...(method === 'post' ? data : null)
        });
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

    async fetchApiEntry(params) {
        const url = ENTRIES_ENDPOINT;
        const data = await this.makeRequest({ url, params });
        return data.data;
    }

    async fetchApiEntries(params) {
        const url = ENTRIES_ENDPOINT;
        const data = await this.makeRequest({ url, params });
        return data.data;
    }

    async countEntries(params) {
        const url = ENTRIES_ENDPOINT;
        const baseParams = {
            filter: {
                return: 'count'
            }
        };
        const data = await this.makeRequest({
            url,
            params: { params, ...baseParams }
        });
        return data.data;
    }
}

module.exports = ApiClient;
