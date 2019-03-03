module.exports = {
  preset: 'react-native',
  collectCoverageFrom: [
    'src/**/*.js',
    '!demo/**/*',
  ],
  modulePathIgnorePatterns: ['demo'],
};
