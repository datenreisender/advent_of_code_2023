module.exports = {
  testMatch: ['**/day[0-9].ts', '**/day[0-9][0-9].ts'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
};
