const request = require('supertest');
const publicApp = require('../../public-app');

describe('API sf-enabled-tenant test', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('API success', (done) => {
    request(publicApp)
      .post('/v1/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/sf-enabled-tenants')
      .send({
        tenants: [{
          tenantId: '8509ef60-e35d-11ed-b5ea-0242ac120002',
          tenantName: 'mockTenantName',
        }],
      })
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

  it('should return 400 status if req.body.tenants is missing', (done) => {
    request(publicApp)
      .post('/v1/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/sf-enabled-tenants')
      .send({})
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('should return 400 status if req.body.tenants list is empty missing', (done) => {
    request(publicApp)
      .post('/v1/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/sf-enabled-tenants')
      .send({
        tenants: [],
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('should return 400 status if parameter tenants is missing in array of tenants', (done) => {
    request(publicApp)
      .post('/v1/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/sf-enabled-tenants')
      .send({
        tenants: [{}],
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('should return 400 status if parameter tenant name is missing in tenants array', (done) => {
    request(publicApp)
      .post('/v1/users/996d95f6-e35d-11ed-b5ea-0242ac120002/xms/sf-enabled-tenants')
      .send({
        tenants: [{
          tenantId: '8509ef60-e35d-11ed-b5ea-0242ac120002',
        }],
      })
      .set('Content-Type', 'application/json')
      .set('x-cx-auth-user-id', '996d95f6-e35d-11ed-b5ea-0242ac120002')
      .expect('Content-Type', 'application/json')
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});
