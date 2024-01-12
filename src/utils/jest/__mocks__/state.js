const state = require('../../../state');

jest.mock('../../../state');

let appState = {
  state: 200,
  body: {
    message: 'ok',
  },
};

state.getAppState = jest.fn(() => (appState));

state.setAppStateError = jest.fn((msg, err = null) => {
  appState.state = 500;
  appState.body = {
    error: err,
    message: msg,
  };
});

state.setAppState = jest.fn((stateObj) => {
  appState = stateObj;
});

state.setAppStateOk = jest.fn(() => {
  appState.state = 500;
  appState.body = {
    message: 'ok',
  };
});
