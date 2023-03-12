const { disconnect, clearDB, connect } = require('./mongo.config');

beforeAll(async () => {
    await connect();
});

beforeEach(async () => {
    await clearDB();
});

afterAll(async () => {
    await disconnect();
});