const {
  getAppState, setAppState, setAppStateError, setAppStateOk,
} = require('../state');

jest.unmock('../state');

describe('setAppStateError', () => {
  it('should set app state with status 500 and error message', () => {
    const errorMessage = 'Something went wrong';
    setAppStateError(errorMessage);
    const appState = getAppState();
    expect(appState.state).toBe(500);
    expect(appState.body.message).toBe(errorMessage);
    expect(appState.body.error).toBeNull();
  });

  it('should set app state with status 500 and error message and error object', () => {
    const errorMessage = 'Something went wrong';
    const error = new Error('Error message');
    setAppStateError(errorMessage, error);
    const appState = getAppState();
    expect(appState.state).toBe(500);
    expect(appState.body.message).toBe(errorMessage);
    expect(appState.body.error).toBe(error);
  });
});

describe('setAppStateOk', () => {
  it('should set app state with status 200 and message', () => {
    const message = 'Success';
    setAppStateOk(message);
    const appState = getAppState();
    expect(appState.state).toBe(200);
    expect(appState.body.message).toBe(message);
  });
});

describe('setAppState', () => {
  it('should set app state', () => {
    const state = { state: 400, body: { message: 'Bad request' } };
    setAppState(state);
    const appState = getAppState();
    expect(appState).toEqual(state);
  });
});
