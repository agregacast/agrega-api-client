const axios = jest.genMockFromModule('axios');

axios.create = jest.fn(() => axios);
axios.request = jest.fn((data) => {
    Promise.resolve();
});

module.exports = axios;
