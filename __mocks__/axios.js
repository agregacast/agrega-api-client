const axios = jest.genMockFromModule('axios');

// this is the key to fix the axios.create() undefined error!
axios.create = jest.fn(() => axios);
axios.baseURL = 'https://api.fakeapi.com';

module.exports = axios;
