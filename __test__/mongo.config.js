const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const mongodb = new MongoMemoryServer({});

module.exports = {
    connect: async () => {
        const testUri = await mongodb.getUri();

        await mongoose.connect(testUri);
    },

    disconnect: async () => {
        mongoose.connection.dropDatabase();
        mongoose.connection.close();

        await mongodb.stop(true);
    },

    clearDB: async () => {
        const collections = mongoose.connection.collection;

        for (const key in collections) {
            const collection = collections[key];

            await collection.deleteMany({});
        }
    }
}
