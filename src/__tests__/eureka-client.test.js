jest.mock('eureka-js-client', () => ({
  Eureka: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    on: jest.fn(),
  })),
}));

const eurekaClient = require('../eureka-client');
const appState = require('../state');
const common = require('../utils/common');
const errors = require('../utils/errors');

describe('initConnection', () => {
  console.error = jest.fn();
  console.warn = jest.fn();
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should register to Eureka server', async () => {
    const result = await eurekaClient.initConnection();

    expect(result.status).toBe(errors.STATUS_NO_ERROR);
    expect(result.body.message).toBe('eureka registration success');
  });
  it('should return an error if conversion to YAML fails', async () => {
    jest.spyOn(common, 'execShellCommand').mockResolvedValue({ status: 1 });
    jest.spyOn(appState, 'setAppStateError').mockImplementation(() => { });

    const result = await eurekaClient.initConnection();

    expect(result.status).toBe(errors.EUREKA_CLIENT_FAILURE);
    expect(result.body.message).toBe('failed to parse yaml file');
    expect(appState.setAppStateError).toHaveBeenCalledWith('failed to convert property file to yaml');
  });

  it('should return an error if initialization fails', async () => {
    jest.spyOn(common, 'execShellCommand').mockRejectedValue(new Error('test error'));
    jest.spyOn(console, 'error').mockImplementation(() => { });

    const result = await eurekaClient.initConnection();

    expect(result.status).toBe(errors.EUREKA_CLIENT_FAILURE);
    expect(result.body.message).toBe('failed init eureka connection');
  });
});
