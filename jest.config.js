module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/cucumber'],
  testMatch: ['**/*.steps.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
