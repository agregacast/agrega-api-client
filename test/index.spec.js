const ApiClient = require('../index');
const axios = require('axios');
jest.mock('axios');

describe('ApiClient', () => {
    test('Config error exception', () => {
        const config = {
            apiUrl: '',
            apiToken: '',
            apiAccessToken: ''
        };
        const client = new ApiClient();
        expect(() => {
            client.setup(config);
        }).toThrow(Error);
    });

    test('Build get request params', () => {
        const params = {
            id: 'episodes',
            filter: {
                order_by: {
                    field: 'published_at',
                    direction: 'DESC'
                },
                slice_offset_value: 0,
                slice_limit_value: 12,
                return: 'slice'
            }
        };
        const expectedParamsStr =
            'id=episodes&filter[order_by][field]=published_at&filter[order_by][direction]=DESC&filter[slice_offset_value]=0&filter[slice_limit_value]=12&filter[return]=slice';

        expect(ApiClient.buildRequestParams(params)).toEqual(expectedParamsStr);
    });

    test('Get request', async () => {
        const client = new ApiClient();
        client.setup({
            apiUrl: 'mock',
            apiToken: 'mock',
            apiAccessToken: 'mock'
        });
        client.queryEntries();
        client.params({ id: 'episodes' });

        await client.get();
        expect(axios.request).toHaveBeenCalled();
        expect(axios.request).toHaveBeenCalledWith({
            method: 'get',
            url: '/entries',
            params: {
                id: 'episodes'
            }
        });
    });

    test('Post request', async () => {
        const client = new ApiClient();
        client.setup({
            apiUrl: 'mock',
            apiToken: 'mock',
            apiAccessToken: 'mock'
        });
        client.queryEntries();
        client.body({
            id: 'test',
            data: {
                title: 'Test post',
                content: 'Test'
            }
        });

        await client.post();
        expect(axios.request).toHaveBeenCalled();
        expect(axios.request).toHaveBeenCalledWith({
            data: { content: 'Test', title: 'Test post' },
            id: 'test',
            method: 'post',
            url: '/entries'
        });
    });

    test('Patch request', async () => {
        const client = new ApiClient();
        client.setup({
            apiUrl: 'mock',
            apiToken: 'mock',
            apiAccessToken: 'mock'
        });
        client.queryEntries();
        client.body({
            id: 'test',
            data: {
                title: 'Test patch',
                content: 'Test'
            }
        });

        await client.patch();
        expect(axios.request).toHaveBeenCalled();
        expect(axios.request).toHaveBeenCalledWith({
            data: { content: 'Test', title: 'Test patch' },
            id: 'test',
            method: 'patch',
            url: '/entries'
        });
    });
});
