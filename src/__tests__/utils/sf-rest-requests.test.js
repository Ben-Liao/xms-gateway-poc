const axios = require('axios');
const JWT = require('jsonwebtoken');
const sfRequests = require('../../utils/sf-rest-requests');
const errors = require('../../utils/errors');

jest.unmock('../../utils/sf-rest-requests');

describe('SF Request', () => {
  beforeEach(() => {
    JWT.sign = jest.fn().mockReturnValue(() => 'token');
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  it('should return postVoiceCall data for cold transfer', async () => {
    const extensionType = 'extension';
    const sfProperties = {
      callCenterName: 'callCenterName',
      baseUrlTelephony: 'baseUrlTelephony',
      organisationId: '12344',
      certificate: 'certificate',
    };
    const callTo = '+123456';
    const callFrom = '+654321';
    const interactionId = 'interactionId';
    const transfer = 'new';
    const outboundTransfer = false;
    axios.post = jest.fn().mockImplementation(() => ({ data: 'data', status: errors.STATUS_NO_ERROR }));
    const response = await sfRequests.postVoiceCall(
      extensionType,
      sfProperties,
      callTo,
      callFrom,
      interactionId,
      transfer,
      outboundTransfer,
    );
    const sampleResponse = {
      status: errors.STATUS_NO_ERROR,
      body: 'data',
    };
    expect(response).toStrictEqual(sampleResponse);
  });

  it('should return postVoiceCall data for cold transfer', async () => {
    const extensionType = 'extension';
    const sfProperties = {
      callCenterName: 'callCenterName',
      baseUrlTelephony: 'baseUrlTelephony',
      organisationId: '12344',
      certificate: 'certificate',
    };
    const callTo = '+123456';
    const callFrom = '+654321';
    const interactionId = 'interactionId';
    const transfer = 'cold-transfer';
    const outboundTransfer = true;
    axios.post = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      body: { records: [{ VendorCallKey: 'VendorCallKey' }] },
      data: {
        access_token: 'access_token',
      },
    }));

    axios.get = jest.fn().mockImplementation(() => ({ data: { records: [{ VendorCallKey: 'VendorCallKey' }] }, status: errors.STATUS_NO_ERROR }));
    const response = await sfRequests.postVoiceCall(
      extensionType,
      sfProperties,
      callTo,
      callFrom,
      interactionId,
      transfer,
      outboundTransfer,
    );
    const sampleResponse = {
      status: errors.STATUS_NO_ERROR,
      body: {
        access_token: 'access_token',
      },
    };
    expect(response).toStrictEqual(sampleResponse);
  });

  it('should return getOauthToken', async () => {
    const sfProperties = {
      baseUrl: 'https',
      username: 'abc@gmail.com',
      password: 'pwd',
      consumerKey: 'consumerKey',
      consumerSecret: 'consumerSecret',
      securityToken: 'securityToken',
    };

    const sampleResponse = {
      status: errors.STATUS_NO_ERROR,
      body: 'access_token',
    };

    axios.post = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      data: {
        access_token: 'access_token',
      },
    }));
    const response = await sfRequests.getOauthToken(sfProperties);
    expect(response).toStrictEqual(sampleResponse);
  });

  it('should return PSR object for the voice call ID', async () => {
    const sfProperties = {
      baseUrl: 'https',
      certificate: 'certificate',
    };
    const sfVoiceCallId = '123456';
    sfRequests.getOauthToken = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      body: 'body',
    }));
    axios.post = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      data: {
        access_token: 'access_token',
      },
    }));
    axios.get = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      data: {
        access_token: 'access_token',
      },
    }));
    const response = await sfRequests.getPSRRequest(
      sfProperties,
      sfVoiceCallId,
    );
    const sampleResponse = {
      status: errors.STATUS_NO_ERROR,
      body: {
        access_token: 'access_token',
      },
    };
    expect(response).toStrictEqual(sampleResponse);
  });

  it('should return agent work data', async () => {
    const sfProperties = {
      baseUrl: 'https',
      certificate: 'certificate',
    };
    const sfVoiceCallId = '123456';
    sfRequests.getOauthToken = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      body: 'token',
    }));
    axios.post = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      data: {
        access_token: 'access_token',
      },
    }));
    const response = await sfRequests.createAgentWork(
      sfProperties,
      sfVoiceCallId,
    );
    const sampleResponse = {
      status: errors.STATUS_NO_ERROR,
      body: {
        access_token: 'access_token',
      },
    };
    expect(response).toStrictEqual(sampleResponse);
  });

  it('should update voice call record', async () => {
    const payload = 'payload';
    const sfProperties = {
      callCenterName: 'callCenterName',
      baseUrlTelephony: 'baseUrlTelephony',
      organisationId: '12344',
      certificate: 'certificate',
    };
    const sfVoiceCallId = '+123456';
    axios.patch = jest.fn().mockImplementation(() => ({ data: 'data', status: errors.STATUS_NO_ERROR }));
    const response = await sfRequests.updateVoiceCallRecord(
      payload,
      sfVoiceCallId,
      sfProperties,
    );
    const sampleResponse = {
      status: errors.STATUS_NO_ERROR,
      body: 'data',
    };
    expect(response).toStrictEqual(sampleResponse);
  });
});
