const ApiClient = require('../src/index');
const axios = require('axios');
jest.mock('axios');

test('ApiClient instance config error exception', () => {
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

test('ApiClient build get request params', () => {
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

test('ApiClient instance get request', async () => {
    axios.request.mockResolvedValue({
        data: {
            slug: ''
        }
    });

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
    expect(axios.request).toHaveBeenLastCalledWith({
        method: 'get',
        url: '/entries',
        params: {
            id: 'episodes'
        }
    });
});
