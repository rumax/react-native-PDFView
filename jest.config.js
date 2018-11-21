module.exports = {
  preset: 'react-native',
  collectCoverageFrom: [
    'src/**/*.js',
    '!demo/**/*',
  ],
  modulePathIgnorePatterns: ['demo'],
  transform: { '^.+\\.js$': './preprocessor.js' },
};
