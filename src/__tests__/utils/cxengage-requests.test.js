const axios = require('axios');
const { getRequest, postRequest } = require('../../utils/cxengage-requests');
const secrets = require('../../utils/aws-secrets-manager');
const errors = require('../../utils/errors');
const logger = require('../../utils/logger');

jest.unmock('../../utils/cxengage-requests');
jest.mock('axios', () => (() => ({ data: {} })));

describe('getRequest', () => {
  it('should failed to get required secrets', async () => {
    secrets.getSecret = jest.fn().mockImplementation(() => false);
    const path = 'some/path';
    const payload = { data: 'some data' };
    const resp = {
      status: errors.FAILED_GET_SECRET_VALUE,
      body: {
        message: 'failed to get required secret',
      },
    };
    expect(await postRequest(path, payload)).toEqual(resp);
  });

  it('should return success data for getRequest', async () => {
    const path = 'some/path';
    secrets.getSecret = jest.fn().mockImplementation(() => (
      { data: {} }
    ));
    expect(await getRequest(path)).toEqual({
      status: errors.STATUS_NO_ERROR,
      body: {},
    });
  });
});

describe('postRequest', () => {
  logger.error = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should failed to get required secrets', async () => {
    secrets.getSecret = jest.fn().mockImplementation(() => false);
    axios.post = jest.fn();
    const path = 'some/path';
    const payload = { data: 'some data' };
    const resp = {
      status: errors.FAILED_GET_SECRET_VALUE,
      body: {
        message: 'failed to get required secret',
      },
    };
    expect(await postRequest(path, payload)).toEqual(resp);
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('should return the result from the POST request with data result object', async () => {
    secrets.getSecret = jest.fn().mockReturnValue({ username: 'foo', password: 'bar' });

    const mockResponse = { data: { result: { message: 'success' } } };
    axios.post = jest.fn().mockImplementation(() => mockResponse);

    const path = 'some/path';
    const payload = { data: {} };
    const result = await postRequest(path, payload);
    expect(result).toEqual({ status: 0, body: { message: 'success' } });
  });

  it('should return the result from the POST request with data', async () => {
    secrets.getSecret = jest.fn().mockReturnValue({ username: 'foo', password: 'bar' });

    const mockResponse = { data: {} };
    axios.post = jest.fn().mockResolvedValue(mockResponse);

    const path = 'some/path';
    const payload = { data: 'some data' };
    const result = await postRequest(path, payload);

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('some/path'), payload, expect.any(Object));
    expect(result).toEqual({ status: 0, body: {} });
  });

  it('should return an error if the POST request fails', async () => {
    secrets.getSecret = jest.fn().mockReturnValue({ username: 'foo', password: 'bar' });

    const mockError = new Error('HTTP error');
    mockError.response = { data: { error: 'some error message' } };
    axios.post = jest.fn().mockRejectedValue(mockError);

    const path = 'some/path';
    const payload = { data: 'some data' };
    const result = await postRequest(path, payload);

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('some/path'), payload, expect.any(Object));
    expect(result).toEqual({ status: 1001, body: { error: { error: 'some error message' }, message: 'failed, http get request' } });
  });
});
