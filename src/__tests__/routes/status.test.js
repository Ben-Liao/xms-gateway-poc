const request = require('supertest');
const publicApp = require('../../public-app');
const state = require('../../state');

jest.unmock('../../state');

describe('status API', () => {
  beforeEach(() => {
    state.getAppState = jest.fn().mockImplementation(() => ({
      state: 200,
      body: {
        message: 'ok',
      },
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('API success for status', (done) => {
    request(publicApp)
      .get('/status')
      .set('Content-Type', 'application/json')
      .expect(200)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.body.message).toEqual('ok');
        return done();
      });
  });

  it('should return invalid for incorrect status', (done) => {
    state.getAppState = jest.fn().mockImplementation(() => false);
    request(publicApp)
      .get('/status')
      .set('Content-Type', 'application/json')
      .expect(500)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.body.message).toEqual('status - invalid app state');
        return done();
      });
  });

  it('API success for healthcheck', (done) => {
    request(publicApp)
      .get('/healthcheck')
      .set('Content-Type', 'application/json')
      .expect(200)
      .end((err, data) => {
        if (err) {
          return done(err);
        }
        expect(data.body.body.message).toEqual('ok');
        return done();
      });
  });
});
