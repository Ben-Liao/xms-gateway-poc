const errors = require('../../utils/errors');

const secrets = require('../../utils/aws-secrets-manager');

jest.mock('aws-sdk', () => ({
  config: {
    update() {
    },
  },
  // eslint-disable-next-line func-names, object-shorthand
  SecretsManager: function () {
    return {
      getSecretValue: () => ({
        promise: () => ({ data: {} }),
      }),
    };
  },
}));

describe('aws secrets', () => {
  it('should return the result from the POST request with data result object', async () => {
    const data = { id: '1234' };
    secrets.storeSecret('123', JSON.stringify(data));
    expect(secrets.getSecret('123')).toEqual(data);
  });

  it('should return getSecretValue', async () => {
    const secretId = '1234';
    const results = await secrets.getSecretValue(secretId);
    expect(results).toEqual({
      status: errors.STATUS_NO_ERROR,
      body: {
        data: { data: {} },
      },
    });
  });
});
