const ApiClient = require('./src/index');

(async () => {
    const config = {
        apiUrl: '',
        apiToken: '',
        apiAccessToken: ''
    };

    const client = new ApiClient(config);
    const data = await client.fetchApiEntries({
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
    });
    console.log(data);
})();
