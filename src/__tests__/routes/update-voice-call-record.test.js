const request = require('supertest');
const publicApp = require('../../public-app');
const cxRequests = require('../../utils/cxengage-requests');
const sfRequests = require('../../utils/sf-rest-requests');
const errors = require('../../utils/errors');
const common = require('../../utils/common');

describe('API update voice call record', () => {
  beforeEach(() => {
    common.getIntegration = jest.fn().mockImplementation(() => ({
      active: true,
      properties: { data: {} },
    }));
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return error for missing parameter user id', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        requestType: 'end-call',
        sfVoiceCallId: '0055i000000qbsCAAQ',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .expect(400)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.error).toEqual('missing parameter user id');
        return done();
      });
  });

  it('should return error for missing parameter CxEngage user id', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        requestType: 'end-call',
        sfVoiceCallId: '0055i000000qbsCAAQ',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac1')
      .set('Content-Type', 'application/json')
      .expect(400)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.error).toEqual('invalid CxEngage user id');
        return done();
      });
  });

  it('should return error for missing parameter tenant id', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac1/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        requestType: 'end-call',
        sfVoiceCallId: '0055i000000qbsCAAQ',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .set('Content-Type', 'application/json')
      .expect(400)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.error).toEqual('invalid parameter tenant id');
        return done();
      });
  });

  it('should return error for missing parameter interaction id', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac1/xms/update-voice-call-record')
      .send({
        requestType: 'end-call',
        sfVoiceCallId: '0055i000000qbsCAAQ',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .set('Content-Type', 'application/json')
      .expect(400)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.error).toEqual('invalid parameter interaction id');
        return done();
      });
  });

  it('should return error for missing parameter interaction id', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        sfVoiceCallId: '0055i000000qbsCAAQ',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .set('Content-Type', 'application/json')
      .expect(400)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.error).toEqual('missing parameter extension type');
        return done();
      });
  });

  it('should return error for invalid request type', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        requestType: 'switch-call',
        sfVoiceCallId: '0055i000000qbsCAAQ',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect(400)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.error).toEqual('invalid request type: switch-call');
        return done();
      });
  });

  it('should return error for missing parameter SF voice call id', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        requestType: 'end-call',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect(400)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.error).toEqual('missing parameter xms voice call id');
        return done();
      });
  });

  it('should return error for internal error', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        requestType: 'end-call',
        sfVoiceCallId: '0055i000000qbsCAAQ',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect(400)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.error).toEqual('internal error, failed to update voice call record');
        return done();
      });
  });

  it('should return error when failed to get tenant details', (done) => {
    cxRequests.getRequest = jest.fn().mockImplementation(() => ({
      status: errors.HTTP_GET_REQ_TO_CX_FAILED,
    }));
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        requestType: 'end-call',
        sfVoiceCallId: '0055i000000qbsCAAQ',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect(400)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.error).toEqual('failed to get tenant details');
        return done();
      });
  });

  it('should return error when tenant state is inactive', (done) => {
    const bodyResp = '{"active":false}';
    cxRequests.getRequest = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      body: JSON.parse(bodyResp),
    }));
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        requestType: 'end-call',
        sfVoiceCallId: '0055i000000qbsCAAQ',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect(400)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.error).toEqual('tenant state is inactive');
        return done();
      });
  });

  it('should return error when failed to get xms integration is inactive', (done) => {
    const bodyResp = '{"active":true}';
    common.getIntegration = jest.fn().mockImplementation(() => ({ active: false }));
    cxRequests.getRequest = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      body: JSON.parse(bodyResp),
    }));
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        requestType: 'end-call',
        sfVoiceCallId: '0055i000000qbsCAAQ',
        integrations: 'b1ea1c3a-e35d-11ed-b5ea-0242ac120002',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect(400)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.error).toEqual('error, XMS services integration is not active');
        return done();
      });
  });

  it('should return error when failed to get xms integration is inactive', (done) => {
    const bodyResp = '{"active":true }';
    cxRequests.getRequest = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      body: JSON.parse(bodyResp),
    }));
    sfRequests.updateVoiceCallRecord = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      body: JSON.parse(bodyResp),
    }));
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        requestType: 'out-bound-call',
        sfVoiceCallId: '0055i000000qbsCAAQ',
        integrations: 'b1ea1c3a-e35d-11ed-b5ea-0242ac120002',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect(400)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.error).toEqual('failed to update voice call record, invalid response');
        return done();
      });
  });

  it('should return error when failed to get xms integration is inactive', (done) => {
    const bodyResp = '{"active":true }';
    cxRequests.getRequest = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      body: JSON.parse(bodyResp),
    }));
    sfRequests.updateVoiceCallRecord = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      body: { status: 'pending' },
    }));
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        requestType: 'out-bound-call',
        sfVoiceCallId: '0055i000000qbsCAAQ',
        integrations: 'b1ea1c3a-e35d-11ed-b5ea-0242ac120002',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect(400)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.error).toEqual('failed to update xms voice call record, status is not pending');
        return done();
      });
  });

  it('should return success when Out Bound voice call record successful', (done) => {
    const bodyResp = '{"active":true }';
    cxRequests.getRequest = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      body: JSON.parse(bodyResp),
    }));
    sfRequests.updateVoiceCallRecord = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      body: { status: 'Pending' },
    }));
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        requestType: 'out-bound-call',
        sfVoiceCallId: '0055i000000qbsCAAQ',
        integrations: 'b1ea1c3a-e35d-11ed-b5ea-0242ac120002',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect(200)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.message).toEqual(
          'update voice call record successful, Out Bound Call',
        );
        return done();
      });
  });

  it('should return error when missing agent details in interaction', (done) => {
    const bodyResp = '{"active":true}';
    cxRequests.getRequest = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      body: JSON.parse(bodyResp),
    }));
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        requestType: 'end-call',
        sfVoiceCallId: '0055i000000qbsCAAQ',
        integrations: 'b1ea1c3a-e35d-11ed-b5ea-0242ac120002',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect(500)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.error).toEqual('missing agent details in interaction');
        return done();
      });
  });

  it('should return error when missing timestamp details in interaction', (done) => {
    const bodyResp = '{"active":true, "agents":[]}';
    cxRequests.getRequest = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      body: JSON.parse(bodyResp),
    }));
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        requestType: 'end-call',
        sfVoiceCallId: '0055i000000qbsCAAQ',
        integrations: 'b1ea1c3a-e35d-11ed-b5ea-0242ac120002',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect(500)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.error).toEqual('missing timestamp details in interaction');
        return done();
      });
  });

  it('should return error when missing timestamp details in interaction', (done) => {
    const bodyResp = {
      status: 'Pending',
      active: true,
      agents: [{ agentId: '996d95f6-e35d-11ed-b5ea-0242ac120002', startTimestamp: new Date(), endTimestamp: new Date() }],
    };
    cxRequests.getRequest = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      body: bodyResp,
    }));
    sfRequests.updateVoiceCallRecord = jest.fn().mockImplementation(() => ({
      status: errors.STATUS_NO_ERROR,
      body: bodyResp,
    }));
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/xms/update-voice-call-record')
      .send({
        requestType: 'end-call',
        sfVoiceCallId: '0055i000000qbsCAAQ',
        integrations: 'b1ea1c3a-e35d-11ed-b5ea-0242ac120002',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect(200)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.result.message).toEqual('update voice call record successful, End Call');
        return done();
      });
  });
});
