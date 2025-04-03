import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.jest.json',
    },
  },
  transformIgnorePatterns: [
    '/node_modules/',
  ],
};

export default config;