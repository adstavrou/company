/** @type {import('jest').Config} */
export default {
  displayName: 'tools',
  roots: ['<rootDir>/tools/src/generators'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|js|mjs)$': 'babel-jest'
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js', 'mjs'],
  transformIgnorePatterns: ['node_modules/(?!.*)'],
  moduleNameMapper: {
    '^company-generators/prompt$': '<rootDir>/tools/libs/src/prompt.ts',
    '^company-generators/naming$': '<rootDir>/tools/libs/src/naming.ts',
    '^company-generators/fs$': '<rootDir>/tools/libs/src/fs.ts'
  }
};
