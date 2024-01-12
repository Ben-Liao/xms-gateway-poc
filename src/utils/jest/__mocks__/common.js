/* eslint-disable no-unused-vars */
const common = require('../../common');

jest.mock('../../common', () => ({
  ...jest.requireActual('../../common'), // Use rest of the functions as actual
  execShellCommand: jest.fn().mockResolvedValue({
    status: 0,
    body: {
      result: '',
      message: 'success',
    },
  }),
}));
