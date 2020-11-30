const ApiClient = require('./src/index');

(async () => {
    const config = {
        apiUrl: process.env.API_URL || '',
        apiToken: process.env.API_TOKEN || '',
        apiAccessToken: process.env.API_ACCESS_TOKEN || ''
    };

    const client = new ApiClient();

    const response = await client
        .setup(config)
        .queryEntries()
        .params({
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
        })
        .get();
    console.log(response.data);
})();
