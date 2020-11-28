const axios = require('axios');
const { withQuery } = require('with-query');

class ApiClient {
    constructor(config) {
        if (this.validateConfig(config)) {
            this.config = config;
            const { apiUrl = null } = config;

            // Internal instance of axios
            this.instance = axios.create({
                baseURL: apiUrl,
                timeout: 1000
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
                // Do something before request is sent
                // console.log(config);
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
                // console.log(response);
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
            ...(method === 'post' ? data : null),
            paramsSerializer: (params) => {
                // To do: Investigate why the query appends and additional "?"
                return this.buildRequestParams(params).replace('?', '');
            }
        });
    }

    buildRequestParams(params) {
        const { apiToken } = this.config;

        const queryOptions = {
            stringifyOpt: {
                encode: false,
                addQueryPrefix: false
            },
            parseOpt: {
                parseArray: false
            }
        };
        return withQuery(null, { token: apiToken, ...params }, queryOptions);
    }

    async fetchApiEntry(params) {
        const url = '/entries';
        const data = await this.makeRequest({ url, params });
        return data.data;
    }

    async fetchApiEntries(params) {
        const url = '/entries';
        const data = await this.makeRequest({ url, params });
        return data.data;
    }

    async countEntries(params) {
        const url = '/entries';
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
