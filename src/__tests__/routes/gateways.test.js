const request = require('supertest');
const publicApp = require('../../public-app');

describe('API gateways test', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('API success', (done) => {
    request(publicApp)
      .post('/v1/tenants/8509ef60-e35d-11ed-b5ea-0242ac120002/interactions/a9831c04-e35d-11ed-b5ea-0242ac120002/actions/verify-credentials')
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(200)
      .end((err) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});
