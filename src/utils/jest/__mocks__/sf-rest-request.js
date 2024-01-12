const sfRequests = require('../../sf-rest-requests');
const errors = require('../../errors');

jest.mock('../../sf-rest-requests');

sfRequests.postVoiceCall = jest.fn(() => ({
  status: errors.STATUS_NO_ERROR,
  body: {
    voiceCallId: '0LQRM0000006CSz',
    errors: [],
  },
}));

sfRequests.getPSRRequest = jest.fn(() => ({
  status: errors.STATUS_NO_ERROR,
  body: {
    totalSize: 1,
    done: true,
    records: [
      {
        attributes: {
          type: 'PendingServiceRouting',
          url: '/services/data/v56.0/sobjects/PendingServiceRouting/0JR5i000001OXSgGAO',
        },
        Id: '0JR5i000001OXSgGAO',
        OwnerId: '0055i000001MDJ7AAO',
        IsDeleted: false,
        Name: '00000075',
        CreatedDate: '2022-11-30T11:29:34.000+0000',
        CreatedById: '0055i000001MDJ7AAO',
        LastModifiedDate: '2022-11-30T11:29:34.000+0000',
        LastModifiedById: '0055i000001MDJ7AAO',
        SystemModstamp: '2022-11-30T11:29:34.000+0000',
        WorkItemId: '0LQ5i000000PBw9GAG',
        QueueId: '00G5i000000h9CkEAI',
        IsPushAttempted: false,
        ServiceChannelId: '0N95i000000TPwICAW',
        IsPushed: false,
        Serial: 1,
        LastDeclinedAgentSession: null,
        IsTransfer: false,
        RoutingModel: 'ExternalRouting',
        CustomRequestedDateTime: null,
        RoutingPriority: null,
        RoutingType: 'QueueBased',
        IsReadyForRouting: true,
        CapacityWeight: null,
        CapacityPercentage: null,
        PushTimeout: null,
        PreferredUserId: null,
        DropAdditionalSkillsTimeout: null,
        GroupId: '00G5i000000h9CkEAI',
        SecondaryRoutingPriority: null,
        IsPreferredUserRequired: false,
      },
    ],
  },
}));

sfRequests.getOauthToken = jest.fn(() => ({
  status: errors.STATUS_NO_ERROR,
  body: {
    access_token: '00D5i000000KyJb!AQ0AQBhkPpz7ykYG.jw.UjQ4Nm1lCU0i0E6k2rAUfPRpRSJ3YSVE36ILHWu3AzStOxZjnNcnUeI0FO7mFQoMxdNzoZ9kgOdd',
    instance_url: 'https://abc-xyz.my.xms.com',
    id: 'https://abc.xyz.com/id/00D5i000000KyJbEAK/0055i000000qbsCXYZ',
    token_type: 'Bearer',
    issued_at: '12345678900987',
    signature: '1234567890=',
  },
}));

sfRequests.createAgentWork = jest.fn(() => ({
  status: errors.STATUS_NO_ERROR,
  body: {
    id: '0Bz5i0000011r27CAA',
    success: true,
    errors: [],
  },
}));

sfRequests.updateVoiceCallRecord = jest.fn(() => ({
  status: errors.STATUS_NO_ERROR,
  body: {
    status: 'Pending',
  },
}));
