/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-else-return */
const request = require('supertest');
const publicApp = require('../../public-app');
const cxRequests = require('../../utils/cxengage-requests');
const sfRequests = require('../../utils/sf-rest-requests');
const common = require('../../utils/common');

jest.mock('../../utils/common');
jest.mock('../../utils/cxengage-requests');
jest.mock('../../utils/sf-rest-requests');

describe('API init-psr-flow test', () => {
  beforeEach(() => {
    // jest.restoreAllMocks();
    // jest.clearAllMocks();
  });

  it('API success', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        sfUserId: '0055i000000qbsXYZ',
        interactionId: 'a9831c04-e35d-11ed-b5ea-0242ac120002',
        transfer: 'cold-transfer',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('failed to get PSR', (done) => {
    sfRequests.getPSRRequest = jest.fn().mockResolvedValue({ status: 100 });

    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        sfUserId: '0055i000000qbsCAAQ',
        interactionId: 'a9831c04-e35d-11ed-b5ea-0242ac120002',
        transfer: 'cold-transfer',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
    jest.clearAllMocks();
  });

  it('No extension type in payload', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        sfUserId: '0055i000000qbsCAAQ',
        interactionId: 'a9831c04-e35d-11ed-b5ea-0242ac120002',
        transfer: 'cold-transfer',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('No sfUserId in payload', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        interactionId: 'a9831c04-e35d-11ed-b5ea-0242ac120002',
        transfer: 'cold-transfer',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('No interactionId in payload', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        sfUserId: '0055i000000qbsCAAQ',
        transfer: 'cold-transfer',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('No transfer in payload', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        sfUserId: '0055i000000qbsCAAQ',
        interactionId: 'a9831c04-e35d-11ed-b5ea-0242ac120002',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('No outboundTransfer in payload', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        sfUserId: '0055i000000qbsCAAQ',
        interactionId: 'a9831c04-e35d-11ed-b5ea-0242ac120002',
        transfer: 'cold-transfer',
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('Invalid tenant uuid', (done) => {
    request(publicApp)
      .post('/v1/tenants/2/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        sfUserId: '0055i000000qbsCAAQ',
        interactionId: 'a9831c04-e35d-11ed-b5ea-0242ac120002',
        transfer: 'cold-transfer',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('Invalid user uuid', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/2/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        sfUserId: '0055i000000qbsCAAQ',
        interactionId: 'a9831c04-e35d-11ed-b5ea-0242ac120002',
        transfer: 'cold-transfer',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('Invalid interaction uuid', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        sfUserId: '0055i000000qbsCAAQ',
        interactionId: '3',
        transfer: 'cold-transfer',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('Failed to get tenant details', (done) => {
    cxRequests.getRequest = jest.fn().mockImplementationOnce((path) => ({
      status: 100,
      body: { },
    }));

    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        sfUserId: '0055i000000qbsCAAQ',
        interactionId: 'a9831c04-e35d-11ed-b5ea-0242ac120002',
        transfer: 'cold-transfer',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('in active cx tenant', (done) => {
    cxRequests.getRequest = jest.fn().mockImplementationOnce((path) => ({
      status: 0,
      body: JSON.parse('{"description":"test tenant","parentIds":["00000000-0000-0000-0000-000000000000"],"timezone":"timezone/timezone","regionId":"00000000-0000-0000-0000-000000000000","createdBy":"00000000-0000-0000-0000-000000000000","parent":{"id":"00000000-0000-0000-0000-000000000000","name":"name"},"defaultIdentityProvider":null,"updated":"0000-00-00T00:00:00Z","name":"tenant","clientLogLevel":null,"adminUserId":"00000000-0000-0000-0000-000000000000","created":"0000-00-00T00:00:00Z","outboundIntegrationId":"00000000-0000-0000-0000-000000000000","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"8509ef60-e35d-11ed-b5ea-0242ac120002","capacityRuleId":null,"defaultSlaId":"00000000-0000-0000-0000-000000000000","cxengageIdentityProvider":"enabled","childIds":["00000000-0000-0000-0000-000000000000"],"parentId":"00000000-0000-0000-0000-000000000000"}'),
    }));

    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        sfUserId: '0055i000000qbsCAAQ',
        interactionId: 'a9831c04-e35d-11ed-b5ea-0242ac120002',
        transfer: 'cold-transfer',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('get cx user id fail', (done) => {
    cxRequests.getRequest = jest.fn().mockImplementation((path) => {
      let body = '{}';
      if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002') {
        // get tenants
        body = '{"description":"test tenant","parentIds":["00000000-0000-0000-0000-000000000000"],"timezone":"timezone/timezone","regionId":"00000000-0000-0000-0000-000000000000","createdBy":"00000000-0000-0000-0000-000000000000","parent":{"id":"00000000-0000-0000-0000-000000000000","name":"name"},"defaultIdentityProvider":null,"updated":"0000-00-00T00:00:00Z","name":"tenant","clientLogLevel":null,"adminUserId":"00000000-0000-0000-0000-000000000000","created":"0000-00-00T00:00:00Z","outboundIntegrationId":"00000000-0000-0000-0000-000000000000","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"8509ef60-e35d-11ed-b5ea-0242ac120002","capacityRuleId":null,"defaultSlaId":"00000000-0000-0000-0000-000000000000","cxengageIdentityProvider":"enabled","childIds":["00000000-0000-0000-0000-000000000000"],"parentId":"00000000-0000-0000-0000-000000000000"}';
        return {
          status: 0,
          body: JSON.parse(body),
        };
      } else if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002') {
        // get tenants/users/id
        body = '{"roleName":"Agent","aliasPlatformUserId":"0000","email":"user@platform.com","defaultTenant":null,"activeExtension":{"provider":"twilio","region":"default","sdkVersion":"default","type":"webrtc","value":"ext-value","description":"Default Twilio extension"},"createdBy":"00000000-0000-0000-0000-000000000000","additionalRoleIds":[],"personalTelephone":null,"locale":null,"defaultIdentityProvider":null,"platformStatus":"enabled","authToken":null,"updated":"0000-00-00T00:00:00Z","clientLogLevel":null,"noPassword":null,"supervisorId":null,"resetPasswordExpiryDate":null,"firstName":"Pradeep","created":"0000-00-00T00:00:00Z","transferLists":[],"state":"offline","extension":"00000000-0000-0000-0000-000000000000","skills":[],"externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","status":"accepted","extensions":[{"provider":"twilio","region":"default","sdkVersion":"default","type":"webrtc","value":"00000000-0000-0000-0000-000000000000","description":"Default Twilio extension"},{"description":"PSTN Phone","type":"pstn","value":"+919423270622"},{"description":"ms teams extension","provider":"ms-teams","type":"sip","value":"sip:+12345678901;ext=00000@000.00.00.000"}],"id":"996d95f6-e35d-11ed-b5ea-0242ac120002","lastName":"Patil","capacityRules":[],"effectiveCapacityRule":null,"groups":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","memberId":"00000000-0000-0000-0000-000000000000","groupId":"00000000-0000-0000-0000-000000000000","memberType":"user","added":"2022-04-06T19:10:46Z","name":"everyone","owner":"00000000-0000-0000-0000-000000000000","description":"everyone group"}],"messageTemplates":[],"invitationStatus":"enabled","location":null,"aliasTenantUserId":11457,"roleId":"00000000-0000-0000-0000-000000000000","reasonLists":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"New Test","isDefault":true,"createdBy":"cabd3960-a617-11ec-830a-3290aa52a8b3","updated":"2023-03-03T16:13:59Z","name":"New Test","reasons":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Lunch","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":[]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Away","name":"Away","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":[]}],"created":"2023-03-03T15:56:08Z","externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000","shared":true},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"System Presence Reasons","isDefault":true,"createdBy":"00000000-0000-0000-0000-000000000000","updated":"2020-02-03T06:16:48Z","name":"System Presence Reasons","reasons":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Logged in","name":"Logged in","externalId":null,"active":true,"reasonId":"f118a230-575c-11e6-b3a9-cf548af89e0d","sortOrder":3,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Logged out","name":"Logged out","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":1,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Session Expired","name":"Session Expired","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":2,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Allocated","name":"Allocated","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":4,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Timed Presence Logged in","name":"Timed Presence Logged in","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Session Overwritten","name":"Session Overwritten","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":5,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"LUNCH","externalId":null,"active":false,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":6,"shared":true,"hierarchy":["default"]}],"created":"2016-07-31T20:25:37Z","externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000","shared":true},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"isDefault":true,"createdBy":"00000000-0000-0000-0000-000000000000","updated":"2022-04-06T19:01:41Z","name":"Away Reasons","reasons":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Lunch","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":[]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Meeting","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":1,"shared":false,"hierarchy":[]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Personal","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":2,"shared":false,"hierarchy":["Other"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Break","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":3,"shared":false,"hierarchy":["Other"]}],"created":"2022-04-06T19:01:41Z","externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000","shared":false}],"workStationId":""}';
        return {
          status: 100,
          body: {},
        };
      } else if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002') {
        // get tenants/interactions/id
        body = '{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","kills":[],"customerAbandonTime":null,"monitors":[],"channelSubType":"twilio","ivrResolution":null,"interactionAttributes":[],"eckohs":[],"flagTimestamp":null,"ivrAbandoned":null,"updated":"2022-11-23T08:46:17.000Z","hooks":[],"campaignId":null,"flagged":null,"customerHoldTime":null,"endTimestamp":"2022-11-23T08:41:22.672Z","flowId":"0c074b80-b5dc-11ec-8e8b-422e5509db9b","customAttributes":[],"customerTransfers":null,"leadId":null,"customerConversationTime":3.925,"customerTalkTime":3.925,"interactionTime":35.000,"segments":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","segmentConsultTime":null,"segmentNumber":0,"segmentCancelled":null,"interactionSegmentId":"86f9db80-6b0a-11ed-b30a-7842533cbe1b","agentId":null,"interactionAgentId":null,"transfer":null,"segmentStartType":"interaction","addParticipantTime":null,"addParticipant":null,"segmentToAgentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","endTimestamp":"2022-11-23T08:40:59.152Z","segmentEndType":"success","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","transferTime":null,"segmentExtensionValue":null,"segmentThirdPartyTime":null,"segmentCancelTime":null,"segmentExtensionType":null,"addParticipantHandedOff":null,"startTimestamp":"2022-11-23T08:40:47.672Z","segmentTime":11.480,"segmentThirdParty":null}],"customerHoldTimes":[],"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","contactPoint":"+15067025885","customerResponseTimes":[],"customer":"+15063081558","ivrs":[],"customerSatisfactionScore":null,"resolution":null,"customerHolds":0,"campaignVersion":null,"campaignRunId":null,"details":{"endTimestamp":"2022-11-23T08:41:22.672Z","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","contactPoint":"+15067025885","customer":"+15063081558","csat":null,"startTimestamp":"2022-11-23T08:40:47.672Z","agents":[{"conversationStartTimestamp":null,"conversationEndTimestamp":null,"resourceId":"996d95f6-e35d-11ed-b5ea-0242ac120002","agentName":"Deepak Goyal","dispositionId":null,"dispositionName":null,"noteTitle":null}],"direction":"inbound","contactId":null,"channelType":"voice"},"customerHoldAbandoned":null,"messagingTranscript":null,"notes":[],"startTimestamp":"2022-11-23T08:40:47.672Z","resolutionState":null,"ivrAbandonTime":null,"flagType":null,"ivrTime":0.062,"audioRecording":true,"dispositionName":null,"noEnqueuement":null,"dispositionId":null,"artifactsSummary":"  audio-recording 1","agents":[{"responseTimes":[],"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","platformAgentId":9315,"scriptTimes":[],"agentWorkAccepted":null,"holdTimes":[],"agentName":"Deepak Goyal","agentWorkOfferTime":10.015,"conversationEndTimestamp":null,"agentWrapUpTime":null,"sessionId":"7bf51e20-6b0a-11ed-8d62-549945ac097b","interactionSegmentId":null,"agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","conversationStartTimestamp":null,"interactionAgentId":"87dce880-6b0a-11ed-bf7b-3e9bccea55f5","agentReplyTime":null,"agentWorkRejectedTime":null,"endTimestamp":"2022-11-23T08:40:59.152Z","talkTimes":[],"agentHandleTime":null,"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","agentWorkCancelTime":10.015,"agentInitiatedHoldTime":null,"agentNoReply":null,"agentHolds":null,"agentHoldTime":null,"agentFocusTime":null,"interactionQueueId":"87035160-6b0a-11ed-aa7a-921188cc4173","startTimestamp":"2022-11-23T08:40:49.137Z","dispositionName":null,"wrapUpTimes":[],"tenantAgentId":13338,"agentConversationTime":null,"dispositionId":null,"agentInReplyTime":null,"agentReadTime":null,"agentInitiatedHolds":null,"queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","lastAgentDisconnectedFirst":null,"agentTalkTime":null,"agentWorkAcceptedTime":null,"agentCustomerHoldAbandon":null},{"responseTimes":[],"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","platformAgentId":9315,"scriptTimes":[],"agentWorkAccepted":true,"holdTimes":[],"agentName":"Deepak Goyal","agentWorkOfferTime":2.774,"conversationEndTimestamp":"2022-11-23T08:41:12.556Z","agentWrapUpTime":null,"sessionId":"7bf51e20-6b0a-11ed-8d62-549945ac097b","interactionSegmentId":null,"agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","conversationStartTimestamp":"2022-11-23T08:41:03.202Z","interactionAgentId":"8e98d8a0-6b0a-11ed-becd-cc5b1d958fc3","agentReplyTime":null,"agentWorkRejectedTime":null,"endTimestamp":"2022-11-23T08:41:22.672Z","talkTimes":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","interactionAgentTalkTimeId":"123be386-1185-5200-8bed-f6cfa5c04a34","agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","interactionAgentId":"8e98d8a0-6b0a-11ed-becd-cc5b1d958fc3","endTimestamp":"2022-11-23T08:41:12.556Z","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","startTimestamp":"2022-11-23T08:41:03.202Z","queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","agentTalkTime":9.354}],"agentHandleTime":9.354,"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","agentWorkCancelTime":null,"agentInitiatedHoldTime":null,"agentNoReply":null,"agentHolds":null,"agentHoldTime":null,"agentFocusTime":null,"interactionQueueId":"87035160-6b0a-11ed-aa7a-921188cc4173","startTimestamp":"2022-11-23T08:41:00.428Z","dispositionName":null,"wrapUpTimes":[],"tenantAgentId":13338,"agentConversationTime":9.354,"dispositionId":null,"agentInReplyTime":null,"agentReadTime":null,"agentInitiatedHolds":null,"queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","lastAgentDisconnectedFirst":null,"agentTalkTime":9.354,"agentWorkAcceptedTime":2.774,"agentCustomerHoldAbandon":null}],"flowName":"Inbound (Voice)","queues":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","queueCallbackRequested":null,"slaVersionName":"v1","queueEntryLength":1,"interactionSegmentId":"86f9db80-6b0a-11ed-b30a-7842533cbe1b","slaId":"97454060-49e4-11e9-9e38-9440dab83f25","agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","queueCallbackAnswered":null,"queueAbandonTime":null,"platformQueueId":4584,"queueAbandoned":null,"slaVersionId":"97454061-49e4-11e9-9e38-9440dab83f25","endTimestamp":"2022-11-23T08:41:03.202Z","slaShortAbandoned":null,"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","slaAbandoned":null,"slaAbandonedInSla":null,"queueCallbackUnanswered":null,"queueCancelTime":null,"queueExitType":"success","queueCallbackTime":null,"rootQueue":true,"queueEntryType":"ivr","interactionQueueId":"87035160-6b0a-11ed-aa7a-921188cc4173","queueType":"queue","slaAbandonType":"ignore-abandons","startTimestamp":"2022-11-23T08:40:47.734Z","queueExitLength":0,"slaThreshold":20,"queueName":"Voice","queueTime":15.468,"slaTime":15.468,"queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","slaAbandonThreshold":20,"timeToAnswer":15.468}],"direction":"inbound","contactId":null,"customerTalkTimes":[{"interactionCustomerTalkTimeId":"903dd611-6b0a-11ed-b30a-7842533cbe1b","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","queueId":null,"agentId":null,"startTimestamp":"2022-11-23T08:41:03.217Z","endTimestamp":"2022-11-23T08:41:07.142Z","customerTalkTime":3.925}],"channelType":"voice"}';
        return {
          status: 0,
          body: JSON.parse(body),
        };
      } else if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/integrations') {
        // get tenants/integrations/id
        body = '[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"","properties":{"accountSid":"1231312312qweqweqweqw","authToken":"1231312312qweqweqweqw","forceRegion":false,"region":"wwr","turnEnabled":false,"webRtc":true},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"twilio","type":"twilio","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"endpointPrefix":"","password":"","token":"","username":""},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"rest","type":"rest","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"monetUrl":"","password":"","username":"","usernameAsAgentId":"false"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"monet","type":"monet","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"","properties":{"certificate":"-----BEGIN PP PRIVATE KEY------test-test------END RSA PRIVATE KEY-----","consumerKey":"consumer-key","consumerSecret":"consumer-secret","loginUrl":"https://login-url","password":"password","pushEnabled":false,"securityToken":"security-token","username":"username@gmail.com"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"xms","type":"xms","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"ddd tes","properties":{},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"facebook11","type":"facebook","created":"0000-00-00T00:00:00Z","updatedBy":"0000-00-00T00:00:00Z","active":true,"id":"0000-00-00T00:00:00Z"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"endpointPrefix":"","interactionFieldId":"","password":"","username":"","workItems":false},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"zendesk","type":"zendesk","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"0000-00-00T00:00:00Z"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"authKey":"","protocol":"ftp","ftpPassword":"","teleoptiUrl":"","ftpUrl":"","multipleTenants":false,"ftpUsername":"","sourceId":"","platformTypeId":""},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"teleopti","type":"teleopti","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"imapServer":"","incomingType":"abc","smtpEncryptionType":"xyz","smtpHost":"","smtpPassword":"","smtpPort":"587","smtpUser":""},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"email","type":"email","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"endpointPrefix":"http://localhost:3000","password":"dFWFEFWEE","token":"","username":"pawan"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"Rest_TestPK1","type":"rest","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"New xms integration test","properties":{"organisationId":"abc123","password":"password","callCenterName":"LifesizeVoice","username":"user@host.com","baseUrl":"https://some-example.com","consumerSecret":"consumer-secret","certificate":"-----BEGIN RSA PRIVATE KEY------test-test------END RSA PRIVATE KEY-----","securityToken":"security-token","consumerKey":"consumer-key","baseUrlTelephony":"https://some-example.com"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"xms","type":"xms","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000001"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"New XMS services integration test 2","properties":{"organisationId":"organisationId2","password":"testpass2","callCenterName":"callCenterName2","username":"testuser2","baseUrl":"https://baseUrl2.com","consumerSecret":"testConsumerSecret2","certificate":"-----BEGIN RSA PRIVATE KEY------test-test------END RSA PRIVATE KEY-----","securityToken":"testSecurityToken2","consumerKey":"testConsumerKey2","baseUrlTelephony":"https://baseUrlTelephony2.com"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"xms-2","type":"xms","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000002"}]';
        return {
          status: 0,
          body: JSON.parse(body),
        };
      }
    });

    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        sfUserId: '0055i000000qbsCAAQ',
        interactionId: 'a9831c04-e35d-11ed-b5ea-0242ac120002',
        transfer: 'cold-transfer',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('get interaction fail', (done) => {
    cxRequests.getRequest = jest.fn().mockImplementation((path) => {
      let body = '{}';
      if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002') {
        // get tenants
        body = '{"description":"test tenant","parentIds":["00000000-0000-0000-0000-000000000000"],"timezone":"timezone/timezone","regionId":"00000000-0000-0000-0000-000000000000","createdBy":"00000000-0000-0000-0000-000000000000","parent":{"id":"00000000-0000-0000-0000-000000000000","name":"name"},"defaultIdentityProvider":null,"updated":"0000-00-00T00:00:00Z","name":"tenant","clientLogLevel":null,"adminUserId":"00000000-0000-0000-0000-000000000000","created":"0000-00-00T00:00:00Z","outboundIntegrationId":"00000000-0000-0000-0000-000000000000","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"8509ef60-e35d-11ed-b5ea-0242ac120002","capacityRuleId":null,"defaultSlaId":"00000000-0000-0000-0000-000000000000","cxengageIdentityProvider":"enabled","childIds":["00000000-0000-0000-0000-000000000000"],"parentId":"00000000-0000-0000-0000-000000000000"}';
        return {
          status: 0,
          body: JSON.parse(body),
        };
      } else if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002') {
        // get tenants/users/id
        body = '{"roleName":"Agent","aliasPlatformUserId":"0000","email":"user@platform.com","defaultTenant":null,"activeExtension":{"provider":"twilio","region":"default","sdkVersion":"default","type":"webrtc","value":"ext-value","description":"Default Twilio extension"},"createdBy":"00000000-0000-0000-0000-000000000000","additionalRoleIds":[],"personalTelephone":null,"locale":null,"defaultIdentityProvider":null,"platformStatus":"enabled","authToken":null,"updated":"0000-00-00T00:00:00Z","clientLogLevel":null,"noPassword":null,"supervisorId":null,"resetPasswordExpiryDate":null,"firstName":"Pradeep","created":"0000-00-00T00:00:00Z","transferLists":[],"state":"offline","extension":"00000000-0000-0000-0000-000000000000","skills":[],"externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","status":"accepted","extensions":[{"provider":"twilio","region":"default","sdkVersion":"default","type":"webrtc","value":"00000000-0000-0000-0000-000000000000","description":"Default Twilio extension"},{"description":"PSTN Phone","type":"pstn","value":"+919423270622"},{"description":"ms teams extension","provider":"ms-teams","type":"sip","value":"sip:+12345678901;ext=00000@000.00.00.000"}],"id":"996d95f6-e35d-11ed-b5ea-0242ac120002","lastName":"Patil","capacityRules":[],"effectiveCapacityRule":null,"groups":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","memberId":"00000000-0000-0000-0000-000000000000","groupId":"00000000-0000-0000-0000-000000000000","memberType":"user","added":"2022-04-06T19:10:46Z","name":"everyone","owner":"00000000-0000-0000-0000-000000000000","description":"everyone group"}],"messageTemplates":[],"invitationStatus":"enabled","location":null,"aliasTenantUserId":11457,"roleId":"00000000-0000-0000-0000-000000000000","reasonLists":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"New Test","isDefault":true,"createdBy":"cabd3960-a617-11ec-830a-3290aa52a8b3","updated":"2023-03-03T16:13:59Z","name":"New Test","reasons":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Lunch","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":[]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Away","name":"Away","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":[]}],"created":"2023-03-03T15:56:08Z","externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000","shared":true},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"System Presence Reasons","isDefault":true,"createdBy":"00000000-0000-0000-0000-000000000000","updated":"2020-02-03T06:16:48Z","name":"System Presence Reasons","reasons":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Logged in","name":"Logged in","externalId":null,"active":true,"reasonId":"f118a230-575c-11e6-b3a9-cf548af89e0d","sortOrder":3,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Logged out","name":"Logged out","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":1,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Session Expired","name":"Session Expired","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":2,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Allocated","name":"Allocated","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":4,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Timed Presence Logged in","name":"Timed Presence Logged in","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Session Overwritten","name":"Session Overwritten","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":5,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"LUNCH","externalId":null,"active":false,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":6,"shared":true,"hierarchy":["default"]}],"created":"2016-07-31T20:25:37Z","externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000","shared":true},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"isDefault":true,"createdBy":"00000000-0000-0000-0000-000000000000","updated":"2022-04-06T19:01:41Z","name":"Away Reasons","reasons":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Lunch","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":[]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Meeting","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":1,"shared":false,"hierarchy":[]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Personal","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":2,"shared":false,"hierarchy":["Other"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Break","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":3,"shared":false,"hierarchy":["Other"]}],"created":"2022-04-06T19:01:41Z","externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000","shared":false}],"workStationId":""}';
        return {
          status: 0,
          body: JSON.parse(body),
        };
      } else if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002') {
        // get tenants/interactions/id
        body = '{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","kills":[],"customerAbandonTime":null,"monitors":[],"channelSubType":"twilio","ivrResolution":null,"interactionAttributes":[],"eckohs":[],"flagTimestamp":null,"ivrAbandoned":null,"updated":"2022-11-23T08:46:17.000Z","hooks":[],"campaignId":null,"flagged":null,"customerHoldTime":null,"endTimestamp":"2022-11-23T08:41:22.672Z","flowId":"0c074b80-b5dc-11ec-8e8b-422e5509db9b","customAttributes":[],"customerTransfers":null,"leadId":null,"customerConversationTime":3.925,"customerTalkTime":3.925,"interactionTime":35.000,"segments":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","segmentConsultTime":null,"segmentNumber":0,"segmentCancelled":null,"interactionSegmentId":"86f9db80-6b0a-11ed-b30a-7842533cbe1b","agentId":null,"interactionAgentId":null,"transfer":null,"segmentStartType":"interaction","addParticipantTime":null,"addParticipant":null,"segmentToAgentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","endTimestamp":"2022-11-23T08:40:59.152Z","segmentEndType":"success","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","transferTime":null,"segmentExtensionValue":null,"segmentThirdPartyTime":null,"segmentCancelTime":null,"segmentExtensionType":null,"addParticipantHandedOff":null,"startTimestamp":"2022-11-23T08:40:47.672Z","segmentTime":11.480,"segmentThirdParty":null}],"customerHoldTimes":[],"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","contactPoint":"+15067025885","customerResponseTimes":[],"customer":"+15063081558","ivrs":[],"customerSatisfactionScore":null,"resolution":null,"customerHolds":0,"campaignVersion":null,"campaignRunId":null,"details":{"endTimestamp":"2022-11-23T08:41:22.672Z","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","contactPoint":"+15067025885","customer":"+15063081558","csat":null,"startTimestamp":"2022-11-23T08:40:47.672Z","agents":[{"conversationStartTimestamp":null,"conversationEndTimestamp":null,"resourceId":"996d95f6-e35d-11ed-b5ea-0242ac120002","agentName":"Deepak Goyal","dispositionId":null,"dispositionName":null,"noteTitle":null}],"direction":"inbound","contactId":null,"channelType":"voice"},"customerHoldAbandoned":null,"messagingTranscript":null,"notes":[],"startTimestamp":"2022-11-23T08:40:47.672Z","resolutionState":null,"ivrAbandonTime":null,"flagType":null,"ivrTime":0.062,"audioRecording":true,"dispositionName":null,"noEnqueuement":null,"dispositionId":null,"artifactsSummary":"  audio-recording 1","agents":[{"responseTimes":[],"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","platformAgentId":9315,"scriptTimes":[],"agentWorkAccepted":null,"holdTimes":[],"agentName":"Deepak Goyal","agentWorkOfferTime":10.015,"conversationEndTimestamp":null,"agentWrapUpTime":null,"sessionId":"7bf51e20-6b0a-11ed-8d62-549945ac097b","interactionSegmentId":null,"agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","conversationStartTimestamp":null,"interactionAgentId":"87dce880-6b0a-11ed-bf7b-3e9bccea55f5","agentReplyTime":null,"agentWorkRejectedTime":null,"endTimestamp":"2022-11-23T08:40:59.152Z","talkTimes":[],"agentHandleTime":null,"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","agentWorkCancelTime":10.015,"agentInitiatedHoldTime":null,"agentNoReply":null,"agentHolds":null,"agentHoldTime":null,"agentFocusTime":null,"interactionQueueId":"87035160-6b0a-11ed-aa7a-921188cc4173","startTimestamp":"2022-11-23T08:40:49.137Z","dispositionName":null,"wrapUpTimes":[],"tenantAgentId":13338,"agentConversationTime":null,"dispositionId":null,"agentInReplyTime":null,"agentReadTime":null,"agentInitiatedHolds":null,"queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","lastAgentDisconnectedFirst":null,"agentTalkTime":null,"agentWorkAcceptedTime":null,"agentCustomerHoldAbandon":null},{"responseTimes":[],"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","platformAgentId":9315,"scriptTimes":[],"agentWorkAccepted":true,"holdTimes":[],"agentName":"Deepak Goyal","agentWorkOfferTime":2.774,"conversationEndTimestamp":"2022-11-23T08:41:12.556Z","agentWrapUpTime":null,"sessionId":"7bf51e20-6b0a-11ed-8d62-549945ac097b","interactionSegmentId":null,"agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","conversationStartTimestamp":"2022-11-23T08:41:03.202Z","interactionAgentId":"8e98d8a0-6b0a-11ed-becd-cc5b1d958fc3","agentReplyTime":null,"agentWorkRejectedTime":null,"endTimestamp":"2022-11-23T08:41:22.672Z","talkTimes":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","interactionAgentTalkTimeId":"123be386-1185-5200-8bed-f6cfa5c04a34","agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","interactionAgentId":"8e98d8a0-6b0a-11ed-becd-cc5b1d958fc3","endTimestamp":"2022-11-23T08:41:12.556Z","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","startTimestamp":"2022-11-23T08:41:03.202Z","queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","agentTalkTime":9.354}],"agentHandleTime":9.354,"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","agentWorkCancelTime":null,"agentInitiatedHoldTime":null,"agentNoReply":null,"agentHolds":null,"agentHoldTime":null,"agentFocusTime":null,"interactionQueueId":"87035160-6b0a-11ed-aa7a-921188cc4173","startTimestamp":"2022-11-23T08:41:00.428Z","dispositionName":null,"wrapUpTimes":[],"tenantAgentId":13338,"agentConversationTime":9.354,"dispositionId":null,"agentInReplyTime":null,"agentReadTime":null,"agentInitiatedHolds":null,"queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","lastAgentDisconnectedFirst":null,"agentTalkTime":9.354,"agentWorkAcceptedTime":2.774,"agentCustomerHoldAbandon":null}],"flowName":"Inbound (Voice)","queues":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","queueCallbackRequested":null,"slaVersionName":"v1","queueEntryLength":1,"interactionSegmentId":"86f9db80-6b0a-11ed-b30a-7842533cbe1b","slaId":"97454060-49e4-11e9-9e38-9440dab83f25","agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","queueCallbackAnswered":null,"queueAbandonTime":null,"platformQueueId":4584,"queueAbandoned":null,"slaVersionId":"97454061-49e4-11e9-9e38-9440dab83f25","endTimestamp":"2022-11-23T08:41:03.202Z","slaShortAbandoned":null,"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","slaAbandoned":null,"slaAbandonedInSla":null,"queueCallbackUnanswered":null,"queueCancelTime":null,"queueExitType":"success","queueCallbackTime":null,"rootQueue":true,"queueEntryType":"ivr","interactionQueueId":"87035160-6b0a-11ed-aa7a-921188cc4173","queueType":"queue","slaAbandonType":"ignore-abandons","startTimestamp":"2022-11-23T08:40:47.734Z","queueExitLength":0,"slaThreshold":20,"queueName":"Voice","queueTime":15.468,"slaTime":15.468,"queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","slaAbandonThreshold":20,"timeToAnswer":15.468}],"direction":"inbound","contactId":null,"customerTalkTimes":[{"interactionCustomerTalkTimeId":"903dd611-6b0a-11ed-b30a-7842533cbe1b","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","queueId":null,"agentId":null,"startTimestamp":"2022-11-23T08:41:03.217Z","endTimestamp":"2022-11-23T08:41:07.142Z","customerTalkTime":3.925}],"channelType":"voice"}';
        return {
          status: 100,
          body: JSON.parse(body),
        };
      } else if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/integrations') {
        // get tenants/integrations/id
        body = '[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"","properties":{"accountSid":"1231312312qweqweqweqw","authToken":"1231312312qweqweqweqw","forceRegion":false,"region":"wwr","turnEnabled":false,"webRtc":true},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"twilio","type":"twilio","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"endpointPrefix":"","password":"","token":"","username":""},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"rest","type":"rest","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"monetUrl":"","password":"","username":"","usernameAsAgentId":"false"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"monet","type":"monet","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"","properties":{"certificate":"-----BEGIN PP PRIVATE KEY------test-test------END RSA PRIVATE KEY-----","consumerKey":"consumer-key","consumerSecret":"consumer-secret","loginUrl":"https://login-url","password":"password","pushEnabled":false,"securityToken":"security-token","username":"username@gmail.com"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"xms","type":"xms","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"ddd tes","properties":{},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"facebook11","type":"facebook","created":"0000-00-00T00:00:00Z","updatedBy":"0000-00-00T00:00:00Z","active":true,"id":"0000-00-00T00:00:00Z"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"endpointPrefix":"","interactionFieldId":"","password":"","username":"","workItems":false},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"zendesk","type":"zendesk","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"0000-00-00T00:00:00Z"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"authKey":"","protocol":"ftp","ftpPassword":"","teleoptiUrl":"","ftpUrl":"","multipleTenants":false,"ftpUsername":"","sourceId":"","platformTypeId":""},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"teleopti","type":"teleopti","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"imapServer":"","incomingType":"abc","smtpEncryptionType":"xyz","smtpHost":"","smtpPassword":"","smtpPort":"587","smtpUser":""},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"email","type":"email","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"endpointPrefix":"http://localhost:3000","password":"dFWFEFWEE","token":"","username":"pawan"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"Rest_TestPK1","type":"rest","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"New XMS services integration test","properties":{"organisationId":"abc123","password":"password","callCenterName":"LifesizeVoice","username":"user@host.com","baseUrl":"https://some-example.com","consumerSecret":"consumer-secret","certificate":"-----BEGIN RSA PRIVATE KEY------test-test------END RSA PRIVATE KEY-----","securityToken":"security-token","consumerKey":"consumer-key","baseUrlTelephony":"https://some-example.com"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"xms","type":"xms","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000001"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"New XMS services integration test 2","properties":{"organisationId":"organisationId2","password":"testpass2","callCenterName":"callCenterName2","username":"testuser2","baseUrl":"https://baseUrl2.com","consumerSecret":"testConsumerSecret2","certificate":"-----BEGIN RSA PRIVATE KEY------test-test------END RSA PRIVATE KEY-----","securityToken":"testSecurityToken2","consumerKey":"testConsumerKey2","baseUrlTelephony":"https://baseUrlTelephony2.com"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"xms-2","type":"xms","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000002"}]';
        return {
          status: 0,
          body: JSON.parse(body),
        };
      }
    });

    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        sfUserId: '0055i000000qbsCAAQ',
        interactionId: 'a9831c04-e35d-11ed-b5ea-0242ac120002',
        transfer: 'cold-transfer',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('get integrations fail', (done) => {
    cxRequests.getRequest = jest.fn().mockImplementation((path) => {
      let body = '{}';
      if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002') {
        // get tenants
        body = '{"description":"test tenant","parentIds":["00000000-0000-0000-0000-000000000000"],"timezone":"timezone/timezone","regionId":"00000000-0000-0000-0000-000000000000","createdBy":"00000000-0000-0000-0000-000000000000","parent":{"id":"00000000-0000-0000-0000-000000000000","name":"name"},"defaultIdentityProvider":null,"updated":"0000-00-00T00:00:00Z","name":"tenant","clientLogLevel":null,"adminUserId":"00000000-0000-0000-0000-000000000000","created":"0000-00-00T00:00:00Z","outboundIntegrationId":"00000000-0000-0000-0000-000000000000","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"8509ef60-e35d-11ed-b5ea-0242ac120002","capacityRuleId":null,"defaultSlaId":"00000000-0000-0000-0000-000000000000","cxengageIdentityProvider":"enabled","childIds":["00000000-0000-0000-0000-000000000000"],"parentId":"00000000-0000-0000-0000-000000000000"}';
        return {
          status: 0,
          body: JSON.parse(body),
        };
      } else if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002') {
        // get tenants/users/id
        body = '{"roleName":"Agent","aliasPlatformUserId":"0000","email":"user@platform.com","defaultTenant":null,"activeExtension":{"provider":"twilio","region":"default","sdkVersion":"default","type":"webrtc","value":"ext-value","description":"Default Twilio extension"},"createdBy":"00000000-0000-0000-0000-000000000000","additionalRoleIds":[],"personalTelephone":null,"locale":null,"defaultIdentityProvider":null,"platformStatus":"enabled","authToken":null,"updated":"0000-00-00T00:00:00Z","clientLogLevel":null,"noPassword":null,"supervisorId":null,"resetPasswordExpiryDate":null,"firstName":"Pradeep","created":"0000-00-00T00:00:00Z","transferLists":[],"state":"offline","extension":"00000000-0000-0000-0000-000000000000","skills":[],"externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","status":"accepted","extensions":[{"provider":"twilio","region":"default","sdkVersion":"default","type":"webrtc","value":"00000000-0000-0000-0000-000000000000","description":"Default Twilio extension"},{"description":"PSTN Phone","type":"pstn","value":"+919423270622"},{"description":"ms teams extension","provider":"ms-teams","type":"sip","value":"sip:+12345678901;ext=00000@000.00.00.000"}],"id":"996d95f6-e35d-11ed-b5ea-0242ac120002","lastName":"Patil","capacityRules":[],"effectiveCapacityRule":null,"groups":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","memberId":"00000000-0000-0000-0000-000000000000","groupId":"00000000-0000-0000-0000-000000000000","memberType":"user","added":"2022-04-06T19:10:46Z","name":"everyone","owner":"00000000-0000-0000-0000-000000000000","description":"everyone group"}],"messageTemplates":[],"invitationStatus":"enabled","location":null,"aliasTenantUserId":11457,"roleId":"00000000-0000-0000-0000-000000000000","reasonLists":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"New Test","isDefault":true,"createdBy":"cabd3960-a617-11ec-830a-3290aa52a8b3","updated":"2023-03-03T16:13:59Z","name":"New Test","reasons":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Lunch","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":[]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Away","name":"Away","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":[]}],"created":"2023-03-03T15:56:08Z","externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000","shared":true},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"System Presence Reasons","isDefault":true,"createdBy":"00000000-0000-0000-0000-000000000000","updated":"2020-02-03T06:16:48Z","name":"System Presence Reasons","reasons":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Logged in","name":"Logged in","externalId":null,"active":true,"reasonId":"f118a230-575c-11e6-b3a9-cf548af89e0d","sortOrder":3,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Logged out","name":"Logged out","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":1,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Session Expired","name":"Session Expired","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":2,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Allocated","name":"Allocated","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":4,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Timed Presence Logged in","name":"Timed Presence Logged in","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Session Overwritten","name":"Session Overwritten","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":5,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"LUNCH","externalId":null,"active":false,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":6,"shared":true,"hierarchy":["default"]}],"created":"2016-07-31T20:25:37Z","externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000","shared":true},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"isDefault":true,"createdBy":"00000000-0000-0000-0000-000000000000","updated":"2022-04-06T19:01:41Z","name":"Away Reasons","reasons":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Lunch","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":[]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Meeting","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":1,"shared":false,"hierarchy":[]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Personal","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":2,"shared":false,"hierarchy":["Other"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Break","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":3,"shared":false,"hierarchy":["Other"]}],"created":"2022-04-06T19:01:41Z","externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000","shared":false}],"workStationId":""}';
        return {
          status: 0,
          body: JSON.parse(body),
        };
      } else if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002') {
        // get tenants/interactions/id
        body = '{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","kills":[],"customerAbandonTime":null,"monitors":[],"channelSubType":"twilio","ivrResolution":null,"interactionAttributes":[],"eckohs":[],"flagTimestamp":null,"ivrAbandoned":null,"updated":"2022-11-23T08:46:17.000Z","hooks":[],"campaignId":null,"flagged":null,"customerHoldTime":null,"endTimestamp":"2022-11-23T08:41:22.672Z","flowId":"0c074b80-b5dc-11ec-8e8b-422e5509db9b","customAttributes":[],"customerTransfers":null,"leadId":null,"customerConversationTime":3.925,"customerTalkTime":3.925,"interactionTime":35.000,"segments":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","segmentConsultTime":null,"segmentNumber":0,"segmentCancelled":null,"interactionSegmentId":"86f9db80-6b0a-11ed-b30a-7842533cbe1b","agentId":null,"interactionAgentId":null,"transfer":null,"segmentStartType":"interaction","addParticipantTime":null,"addParticipant":null,"segmentToAgentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","endTimestamp":"2022-11-23T08:40:59.152Z","segmentEndType":"success","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","transferTime":null,"segmentExtensionValue":null,"segmentThirdPartyTime":null,"segmentCancelTime":null,"segmentExtensionType":null,"addParticipantHandedOff":null,"startTimestamp":"2022-11-23T08:40:47.672Z","segmentTime":11.480,"segmentThirdParty":null}],"customerHoldTimes":[],"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","contactPoint":"+15067025885","customerResponseTimes":[],"customer":"+15063081558","ivrs":[],"customerSatisfactionScore":null,"resolution":null,"customerHolds":0,"campaignVersion":null,"campaignRunId":null,"details":{"endTimestamp":"2022-11-23T08:41:22.672Z","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","contactPoint":"+15067025885","customer":"+15063081558","csat":null,"startTimestamp":"2022-11-23T08:40:47.672Z","agents":[{"conversationStartTimestamp":null,"conversationEndTimestamp":null,"resourceId":"996d95f6-e35d-11ed-b5ea-0242ac120002","agentName":"Deepak Goyal","dispositionId":null,"dispositionName":null,"noteTitle":null}],"direction":"inbound","contactId":null,"channelType":"voice"},"customerHoldAbandoned":null,"messagingTranscript":null,"notes":[],"startTimestamp":"2022-11-23T08:40:47.672Z","resolutionState":null,"ivrAbandonTime":null,"flagType":null,"ivrTime":0.062,"audioRecording":true,"dispositionName":null,"noEnqueuement":null,"dispositionId":null,"artifactsSummary":"  audio-recording 1","agents":[{"responseTimes":[],"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","platformAgentId":9315,"scriptTimes":[],"agentWorkAccepted":null,"holdTimes":[],"agentName":"Deepak Goyal","agentWorkOfferTime":10.015,"conversationEndTimestamp":null,"agentWrapUpTime":null,"sessionId":"7bf51e20-6b0a-11ed-8d62-549945ac097b","interactionSegmentId":null,"agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","conversationStartTimestamp":null,"interactionAgentId":"87dce880-6b0a-11ed-bf7b-3e9bccea55f5","agentReplyTime":null,"agentWorkRejectedTime":null,"endTimestamp":"2022-11-23T08:40:59.152Z","talkTimes":[],"agentHandleTime":null,"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","agentWorkCancelTime":10.015,"agentInitiatedHoldTime":null,"agentNoReply":null,"agentHolds":null,"agentHoldTime":null,"agentFocusTime":null,"interactionQueueId":"87035160-6b0a-11ed-aa7a-921188cc4173","startTimestamp":"2022-11-23T08:40:49.137Z","dispositionName":null,"wrapUpTimes":[],"tenantAgentId":13338,"agentConversationTime":null,"dispositionId":null,"agentInReplyTime":null,"agentReadTime":null,"agentInitiatedHolds":null,"queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","lastAgentDisconnectedFirst":null,"agentTalkTime":null,"agentWorkAcceptedTime":null,"agentCustomerHoldAbandon":null},{"responseTimes":[],"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","platformAgentId":9315,"scriptTimes":[],"agentWorkAccepted":true,"holdTimes":[],"agentName":"Deepak Goyal","agentWorkOfferTime":2.774,"conversationEndTimestamp":"2022-11-23T08:41:12.556Z","agentWrapUpTime":null,"sessionId":"7bf51e20-6b0a-11ed-8d62-549945ac097b","interactionSegmentId":null,"agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","conversationStartTimestamp":"2022-11-23T08:41:03.202Z","interactionAgentId":"8e98d8a0-6b0a-11ed-becd-cc5b1d958fc3","agentReplyTime":null,"agentWorkRejectedTime":null,"endTimestamp":"2022-11-23T08:41:22.672Z","talkTimes":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","interactionAgentTalkTimeId":"123be386-1185-5200-8bed-f6cfa5c04a34","agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","interactionAgentId":"8e98d8a0-6b0a-11ed-becd-cc5b1d958fc3","endTimestamp":"2022-11-23T08:41:12.556Z","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","startTimestamp":"2022-11-23T08:41:03.202Z","queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","agentTalkTime":9.354}],"agentHandleTime":9.354,"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","agentWorkCancelTime":null,"agentInitiatedHoldTime":null,"agentNoReply":null,"agentHolds":null,"agentHoldTime":null,"agentFocusTime":null,"interactionQueueId":"87035160-6b0a-11ed-aa7a-921188cc4173","startTimestamp":"2022-11-23T08:41:00.428Z","dispositionName":null,"wrapUpTimes":[],"tenantAgentId":13338,"agentConversationTime":9.354,"dispositionId":null,"agentInReplyTime":null,"agentReadTime":null,"agentInitiatedHolds":null,"queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","lastAgentDisconnectedFirst":null,"agentTalkTime":9.354,"agentWorkAcceptedTime":2.774,"agentCustomerHoldAbandon":null}],"flowName":"Inbound (Voice)","queues":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","queueCallbackRequested":null,"slaVersionName":"v1","queueEntryLength":1,"interactionSegmentId":"86f9db80-6b0a-11ed-b30a-7842533cbe1b","slaId":"97454060-49e4-11e9-9e38-9440dab83f25","agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","queueCallbackAnswered":null,"queueAbandonTime":null,"platformQueueId":4584,"queueAbandoned":null,"slaVersionId":"97454061-49e4-11e9-9e38-9440dab83f25","endTimestamp":"2022-11-23T08:41:03.202Z","slaShortAbandoned":null,"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","slaAbandoned":null,"slaAbandonedInSla":null,"queueCallbackUnanswered":null,"queueCancelTime":null,"queueExitType":"success","queueCallbackTime":null,"rootQueue":true,"queueEntryType":"ivr","interactionQueueId":"87035160-6b0a-11ed-aa7a-921188cc4173","queueType":"queue","slaAbandonType":"ignore-abandons","startTimestamp":"2022-11-23T08:40:47.734Z","queueExitLength":0,"slaThreshold":20,"queueName":"Voice","queueTime":15.468,"slaTime":15.468,"queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","slaAbandonThreshold":20,"timeToAnswer":15.468}],"direction":"inbound","contactId":null,"customerTalkTimes":[{"interactionCustomerTalkTimeId":"903dd611-6b0a-11ed-b30a-7842533cbe1b","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","queueId":null,"agentId":null,"startTimestamp":"2022-11-23T08:41:03.217Z","endTimestamp":"2022-11-23T08:41:07.142Z","customerTalkTime":3.925}],"channelType":"voice"}';
        return {
          status: 0,
          body: JSON.parse(body),
        };
      } else if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/integrations') {
        // get tenants/integrations/id
        body = '[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"","properties":{"accountSid":"1231312312qweqweqweqw","authToken":"1231312312qweqweqweqw","forceRegion":false,"region":"wwr","turnEnabled":false,"webRtc":true},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"twilio","type":"twilio","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"endpointPrefix":"","password":"","token":"","username":""},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"rest","type":"rest","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"monetUrl":"","password":"","username":"","usernameAsAgentId":"false"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"monet","type":"monet","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"","properties":{"certificate":"-----BEGIN PP PRIVATE KEY------test-test------END RSA PRIVATE KEY-----","consumerKey":"consumer-key","consumerSecret":"consumer-secret","loginUrl":"https://login-url","password":"password","pushEnabled":false,"securityToken":"security-token","username":"username@gmail.com"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"xms","type":"xms","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"ddd tes","properties":{},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"facebook11","type":"facebook","created":"0000-00-00T00:00:00Z","updatedBy":"0000-00-00T00:00:00Z","active":true,"id":"0000-00-00T00:00:00Z"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"endpointPrefix":"","interactionFieldId":"","password":"","username":"","workItems":false},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"zendesk","type":"zendesk","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"0000-00-00T00:00:00Z"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"authKey":"","protocol":"ftp","ftpPassword":"","teleoptiUrl":"","ftpUrl":"","multipleTenants":false,"ftpUsername":"","sourceId":"","platformTypeId":""},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"teleopti","type":"teleopti","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"imapServer":"","incomingType":"abc","smtpEncryptionType":"xyz","smtpHost":"","smtpPassword":"","smtpPort":"587","smtpUser":""},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"email","type":"email","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"endpointPrefix":"http://localhost:3000","password":"dFWFEFWEE","token":"","username":"pawan"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"Rest_TestPK1","type":"rest","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"New XMS services integration test","properties":{"organisationId":"abc123","password":"password","callCenterName":"LifesizeVoice","username":"user@host.com","baseUrl":"https://some-example.com","consumerSecret":"consumer-secret","certificate":"-----BEGIN RSA PRIVATE KEY------test-test------END RSA PRIVATE KEY-----","securityToken":"security-token","consumerKey":"consumer-key","baseUrlTelephony":"https://some-example.com"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"xms","type":"xms","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000001"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"New XMS services integration test 2","properties":{"organisationId":"organisationId2","password":"testpass2","callCenterName":"callCenterName2","username":"testuser2","baseUrl":"https://baseUrl2.com","consumerSecret":"testConsumerSecret2","certificate":"-----BEGIN RSA PRIVATE KEY------test-test------END RSA PRIVATE KEY-----","securityToken":"testSecurityToken2","consumerKey":"testConsumerKey2","baseUrlTelephony":"https://baseUrlTelephony2.com"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"xms-2","type":"xms","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000002"}]';
        return {
          status: 100,
          body: JSON.parse(body),
        };
      }
    });

    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        sfUserId: '0055i000000qbsCAAQ',
        interactionId: 'a9831c04-e35d-11ed-b5ea-0242ac120002',
        transfer: 'cold-transfer',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('cx user is in-active', (done) => {
    cxRequests.getRequest = jest.fn().mockImplementation((path) => {
      let body = '{}';
      if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002') {
        // get tenants
        body = '{"description":"test tenant","parentIds":["00000000-0000-0000-0000-000000000000"],"timezone":"timezone/timezone","regionId":"00000000-0000-0000-0000-000000000000","createdBy":"00000000-0000-0000-0000-000000000000","parent":{"id":"00000000-0000-0000-0000-000000000000","name":"name"},"defaultIdentityProvider":null,"updated":"0000-00-00T00:00:00Z","name":"tenant","clientLogLevel":null,"adminUserId":"00000000-0000-0000-0000-000000000000","created":"0000-00-00T00:00:00Z","outboundIntegrationId":"00000000-0000-0000-0000-000000000000","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"8509ef60-e35d-11ed-b5ea-0242ac120002","capacityRuleId":null,"defaultSlaId":"00000000-0000-0000-0000-000000000000","cxengageIdentityProvider":"enabled","childIds":["00000000-0000-0000-0000-000000000000"],"parentId":"00000000-0000-0000-0000-000000000000"}';
        return {
          status: 0,
          body: JSON.parse(body),
        };
      } else if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002') {
        // get tenants/users/id
        body = '{"roleName":"Agent","aliasPlatformUserId":"0000","email":"user@platform.com","defaultTenant":null,"activeExtension":{"provider":"twilio","region":"default","sdkVersion":"default","type":"webrtc","value":"ext-value","description":"Default Twilio extension"},"createdBy":"00000000-0000-0000-0000-000000000000","additionalRoleIds":[],"personalTelephone":null,"locale":null,"defaultIdentityProvider":null,"platformStatus":"disabled","authToken":null,"updated":"0000-00-00T00:00:00Z","clientLogLevel":null,"noPassword":null,"supervisorId":null,"resetPasswordExpiryDate":null,"firstName":"Pradeep","created":"0000-00-00T00:00:00Z","transferLists":[],"state":"offline","extension":"00000000-0000-0000-0000-000000000000","skills":[],"externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","status":"accepted","extensions":[{"provider":"twilio","region":"default","sdkVersion":"default","type":"webrtc","value":"00000000-0000-0000-0000-000000000000","description":"Default Twilio extension"},{"description":"PSTN Phone","type":"pstn","value":"+919423270622"},{"description":"ms teams extension","provider":"ms-teams","type":"sip","value":"sip:+12345678901;ext=00000@000.00.00.000"}],"id":"996d95f6-e35d-11ed-b5ea-0242ac120002","lastName":"Patil","capacityRules":[],"effectiveCapacityRule":null,"groups":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","memberId":"00000000-0000-0000-0000-000000000000","groupId":"00000000-0000-0000-0000-000000000000","memberType":"user","added":"2022-04-06T19:10:46Z","name":"everyone","owner":"00000000-0000-0000-0000-000000000000","description":"everyone group"}],"messageTemplates":[],"invitationStatus":"enabled","location":null,"aliasTenantUserId":11457,"roleId":"00000000-0000-0000-0000-000000000000","reasonLists":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"New Test","isDefault":true,"createdBy":"cabd3960-a617-11ec-830a-3290aa52a8b3","updated":"2023-03-03T16:13:59Z","name":"New Test","reasons":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Lunch","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":[]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Away","name":"Away","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":[]}],"created":"2023-03-03T15:56:08Z","externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000","shared":true},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"System Presence Reasons","isDefault":true,"createdBy":"00000000-0000-0000-0000-000000000000","updated":"2020-02-03T06:16:48Z","name":"System Presence Reasons","reasons":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Logged in","name":"Logged in","externalId":null,"active":true,"reasonId":"f118a230-575c-11e6-b3a9-cf548af89e0d","sortOrder":3,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Logged out","name":"Logged out","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":1,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Session Expired","name":"Session Expired","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":2,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Allocated","name":"Allocated","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":4,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Timed Presence Logged in","name":"Timed Presence Logged in","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"Session Overwritten","name":"Session Overwritten","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":5,"shared":true,"hierarchy":["default"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"LUNCH","externalId":null,"active":false,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":6,"shared":true,"hierarchy":["default"]}],"created":"2016-07-31T20:25:37Z","externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000","shared":true},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"isDefault":true,"createdBy":"00000000-0000-0000-0000-000000000000","updated":"2022-04-06T19:01:41Z","name":"Away Reasons","reasons":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Lunch","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":0,"shared":true,"hierarchy":[]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Meeting","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":1,"shared":false,"hierarchy":[]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Personal","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":2,"shared":false,"hierarchy":["Other"]},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"name":"Break","externalId":null,"active":true,"reasonId":"00000000-0000-0000-0000-000000000000","sortOrder":3,"shared":false,"hierarchy":["Other"]}],"created":"2022-04-06T19:01:41Z","externalId":null,"updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000","shared":false}],"workStationId":""}';
        return {
          status: 0,
          body: JSON.parse(body),
        };
      } else if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002') {
        // get tenants/interactions/id
        body = '{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","kills":[],"customerAbandonTime":null,"monitors":[],"channelSubType":"twilio","ivrResolution":null,"interactionAttributes":[],"eckohs":[],"flagTimestamp":null,"ivrAbandoned":null,"updated":"2022-11-23T08:46:17.000Z","hooks":[],"campaignId":null,"flagged":null,"customerHoldTime":null,"endTimestamp":"2022-11-23T08:41:22.672Z","flowId":"0c074b80-b5dc-11ec-8e8b-422e5509db9b","customAttributes":[],"customerTransfers":null,"leadId":null,"customerConversationTime":3.925,"customerTalkTime":3.925,"interactionTime":35.000,"segments":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","segmentConsultTime":null,"segmentNumber":0,"segmentCancelled":null,"interactionSegmentId":"86f9db80-6b0a-11ed-b30a-7842533cbe1b","agentId":null,"interactionAgentId":null,"transfer":null,"segmentStartType":"interaction","addParticipantTime":null,"addParticipant":null,"segmentToAgentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","endTimestamp":"2022-11-23T08:40:59.152Z","segmentEndType":"success","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","transferTime":null,"segmentExtensionValue":null,"segmentThirdPartyTime":null,"segmentCancelTime":null,"segmentExtensionType":null,"addParticipantHandedOff":null,"startTimestamp":"2022-11-23T08:40:47.672Z","segmentTime":11.480,"segmentThirdParty":null}],"customerHoldTimes":[],"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","contactPoint":"+15067025885","customerResponseTimes":[],"customer":"+15063081558","ivrs":[],"customerSatisfactionScore":null,"resolution":null,"customerHolds":0,"campaignVersion":null,"campaignRunId":null,"details":{"endTimestamp":"2022-11-23T08:41:22.672Z","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","contactPoint":"+15067025885","customer":"+15063081558","csat":null,"startTimestamp":"2022-11-23T08:40:47.672Z","agents":[{"conversationStartTimestamp":null,"conversationEndTimestamp":null,"resourceId":"996d95f6-e35d-11ed-b5ea-0242ac120002","agentName":"Deepak Goyal","dispositionId":null,"dispositionName":null,"noteTitle":null}],"direction":"inbound","contactId":null,"channelType":"voice"},"customerHoldAbandoned":null,"messagingTranscript":null,"notes":[],"startTimestamp":"2022-11-23T08:40:47.672Z","resolutionState":null,"ivrAbandonTime":null,"flagType":null,"ivrTime":0.062,"audioRecording":true,"dispositionName":null,"noEnqueuement":null,"dispositionId":null,"artifactsSummary":"  audio-recording 1","agents":[{"responseTimes":[],"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","platformAgentId":9315,"scriptTimes":[],"agentWorkAccepted":null,"holdTimes":[],"agentName":"Deepak Goyal","agentWorkOfferTime":10.015,"conversationEndTimestamp":null,"agentWrapUpTime":null,"sessionId":"7bf51e20-6b0a-11ed-8d62-549945ac097b","interactionSegmentId":null,"agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","conversationStartTimestamp":null,"interactionAgentId":"87dce880-6b0a-11ed-bf7b-3e9bccea55f5","agentReplyTime":null,"agentWorkRejectedTime":null,"endTimestamp":"2022-11-23T08:40:59.152Z","talkTimes":[],"agentHandleTime":null,"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","agentWorkCancelTime":10.015,"agentInitiatedHoldTime":null,"agentNoReply":null,"agentHolds":null,"agentHoldTime":null,"agentFocusTime":null,"interactionQueueId":"87035160-6b0a-11ed-aa7a-921188cc4173","startTimestamp":"2022-11-23T08:40:49.137Z","dispositionName":null,"wrapUpTimes":[],"tenantAgentId":13338,"agentConversationTime":null,"dispositionId":null,"agentInReplyTime":null,"agentReadTime":null,"agentInitiatedHolds":null,"queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","lastAgentDisconnectedFirst":null,"agentTalkTime":null,"agentWorkAcceptedTime":null,"agentCustomerHoldAbandon":null},{"responseTimes":[],"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","platformAgentId":9315,"scriptTimes":[],"agentWorkAccepted":true,"holdTimes":[],"agentName":"Deepak Goyal","agentWorkOfferTime":2.774,"conversationEndTimestamp":"2022-11-23T08:41:12.556Z","agentWrapUpTime":null,"sessionId":"7bf51e20-6b0a-11ed-8d62-549945ac097b","interactionSegmentId":null,"agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","conversationStartTimestamp":"2022-11-23T08:41:03.202Z","interactionAgentId":"8e98d8a0-6b0a-11ed-becd-cc5b1d958fc3","agentReplyTime":null,"agentWorkRejectedTime":null,"endTimestamp":"2022-11-23T08:41:22.672Z","talkTimes":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","interactionAgentTalkTimeId":"123be386-1185-5200-8bed-f6cfa5c04a34","agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","interactionAgentId":"8e98d8a0-6b0a-11ed-becd-cc5b1d958fc3","endTimestamp":"2022-11-23T08:41:12.556Z","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","startTimestamp":"2022-11-23T08:41:03.202Z","queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","agentTalkTime":9.354}],"agentHandleTime":9.354,"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","agentWorkCancelTime":null,"agentInitiatedHoldTime":null,"agentNoReply":null,"agentHolds":null,"agentHoldTime":null,"agentFocusTime":null,"interactionQueueId":"87035160-6b0a-11ed-aa7a-921188cc4173","startTimestamp":"2022-11-23T08:41:00.428Z","dispositionName":null,"wrapUpTimes":[],"tenantAgentId":13338,"agentConversationTime":9.354,"dispositionId":null,"agentInReplyTime":null,"agentReadTime":null,"agentInitiatedHolds":null,"queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","lastAgentDisconnectedFirst":null,"agentTalkTime":9.354,"agentWorkAcceptedTime":2.774,"agentCustomerHoldAbandon":null}],"flowName":"Inbound (Voice)","queues":[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","queueCallbackRequested":null,"slaVersionName":"v1","queueEntryLength":1,"interactionSegmentId":"86f9db80-6b0a-11ed-b30a-7842533cbe1b","slaId":"97454060-49e4-11e9-9e38-9440dab83f25","agentId":"996d95f6-e35d-11ed-b5ea-0242ac120002","queueCallbackAnswered":null,"queueAbandonTime":null,"platformQueueId":4584,"queueAbandoned":null,"slaVersionId":"97454061-49e4-11e9-9e38-9440dab83f25","endTimestamp":"2022-11-23T08:41:03.202Z","slaShortAbandoned":null,"interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","slaAbandoned":null,"slaAbandonedInSla":null,"queueCallbackUnanswered":null,"queueCancelTime":null,"queueExitType":"success","queueCallbackTime":null,"rootQueue":true,"queueEntryType":"ivr","interactionQueueId":"87035160-6b0a-11ed-aa7a-921188cc4173","queueType":"queue","slaAbandonType":"ignore-abandons","startTimestamp":"2022-11-23T08:40:47.734Z","queueExitLength":0,"slaThreshold":20,"queueName":"Voice","queueTime":15.468,"slaTime":15.468,"queueId":"feec7f60-b5db-11ec-a234-f34c9f8c9bab","slaAbandonThreshold":20,"timeToAnswer":15.468}],"direction":"inbound","contactId":null,"customerTalkTimes":[{"interactionCustomerTalkTimeId":"903dd611-6b0a-11ed-b30a-7842533cbe1b","interactionId":"a9831c04-e35d-11ed-b5ea-0242ac120002","tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","queueId":null,"agentId":null,"startTimestamp":"2022-11-23T08:41:03.217Z","endTimestamp":"2022-11-23T08:41:07.142Z","customerTalkTime":3.925}],"channelType":"voice"}';
        return {
          status: 0,
          body: JSON.parse(body),
        };
      } else if (path.toLowerCase() === 'tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/integrations') {
        // get tenants/integrations/id
        body = '[{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"","properties":{"accountSid":"1231312312qweqweqweqw","authToken":"1231312312qweqweqweqw","forceRegion":false,"region":"wwr","turnEnabled":false,"webRtc":true},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"twilio","type":"twilio","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"endpointPrefix":"","password":"","token":"","username":""},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"rest","type":"rest","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"monetUrl":"","password":"","username":"","usernameAsAgentId":"false"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"monet","type":"monet","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"","properties":{"certificate":"-----BEGIN PP PRIVATE KEY------test-test------END RSA PRIVATE KEY-----","consumerKey":"consumer-key","consumerSecret":"consumer-secret","loginUrl":"https://login-url","password":"password","pushEnabled":false,"securityToken":"security-token","username":"username@gmail.com"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"xms","type":"xms","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"ddd tes","properties":{},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"facebook11","type":"facebook","created":"0000-00-00T00:00:00Z","updatedBy":"0000-00-00T00:00:00Z","active":true,"id":"0000-00-00T00:00:00Z"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"endpointPrefix":"","interactionFieldId":"","password":"","username":"","workItems":false},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"zendesk","type":"zendesk","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"0000-00-00T00:00:00Z"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"authKey":"","protocol":"ftp","ftpPassword":"","teleoptiUrl":"","ftpUrl":"","multipleTenants":false,"ftpUsername":"","sourceId":"","platformTypeId":""},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"teleopti","type":"teleopti","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"imapServer":"","incomingType":"abc","smtpEncryptionType":"xyz","smtpHost":"","smtpPassword":"","smtpPort":"587","smtpUser":""},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"email","type":"email","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":null,"properties":{"endpointPrefix":"http://localhost:3000","password":"dFWFEFWEE","token":"","username":"pawan"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"Rest_TestPK1","type":"rest","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000000"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"New XMS services integration test","properties":{"organisationId":"abc123","password":"password","callCenterName":"LifesizeVoice","username":"user@host.com","baseUrl":"https://some-example.com","consumerSecret":"consumer-secret","certificate":"-----BEGIN RSA PRIVATE KEY------test-test------END RSA PRIVATE KEY-----","securityToken":"security-token","consumerKey":"consumer-key","baseUrlTelephony":"https://some-example.com"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"xms","type":"xms","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":true,"id":"00000000-0000-0000-0000-000000000001"},{"tenantId":"8509ef60-e35d-11ed-b5ea-0242ac120002","description":"New XMS services integration test 2","properties":{"organisationId":"organisationId2","password":"testpass2","callCenterName":"callCenterName2","username":"testuser2","baseUrl":"https://baseUrl2.com","consumerSecret":"testConsumerSecret2","certificate":"-----BEGIN RSA PRIVATE KEY------test-test------END RSA PRIVATE KEY-----","securityToken":"testSecurityToken2","consumerKey":"testConsumerKey2","baseUrlTelephony":"https://baseUrlTelephony2.com"},"createdBy":"00000000-0000-0000-0000-000000000000","updated":"0000-00-00T00:00:00Z","name":"xms-2","type":"xms","created":"0000-00-00T00:00:00Z","updatedBy":"00000000-0000-0000-0000-000000000000","active":false,"id":"00000000-0000-0000-0000-000000000002"}]';
        return {
          status: 0,
          body: JSON.parse(body),
        };
      }
    });

    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        sfUserId: '0055i000000qbsCAAQ',
        interactionId: 'a9831c04-e35d-11ed-b5ea-0242ac120002',
        transfer: 'cold-transfer',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('failed to get sf integration', (done) => {
    common.getIntegration = jest.fn().mockImplementationOnce((type, integrations) => null);

    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/init-psr-flow')
      .send({
        extensionType: 'softphone',
        sfUserId: '0055i000000qbsCAAQ',
        interactionId: 'a9831c04-e35d-11ed-b5ea-0242ac120002',
        transfer: 'cold-transfer',
        outboundTransfer: false,
        sfOrganizationId: '2357KOP0000PSP',
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});
