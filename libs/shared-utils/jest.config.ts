import type { Config } from 'jest';

const config: Config = {
  displayName: 'shared-utils',
  preset: '../../jest.preset.js',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|js|mjs)$': ['ts-jest', { useESM: true }],
  },
};

export default config;
