module.exports = {
    testEnvironment: "node",
    moduleNameMapper: {
        "@error": "<rootDir>/errors/ApiError",
        "@configs/(.*)": "<rootDir>/configs/$1"
    },
    globalSetup: "<rootDir>/__test__/env.setup.js",
    setupFilesAfterEnv: ["<rootDir>/__test__/jest.config.js"]
};