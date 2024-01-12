/**
{
   state: <http-error-code>
   body: {
      error: "in-case-of-error-error-object"
      message: ""
   }
}
*/
let appState = {
  state: 200,
  body: {
    message: 'ok',
  },
};

function setAppState(state) {
  appState = state;
}

function setAppStateError(msg, err = null) {
  appState = {
    state: 500,
    body: {
      error: err,
      message: msg,
    },
  };
}

function setAppStateOk(msg) {
  appState = {
    state: 200,
    body: {
      message: msg,
    },
  };
}

function getAppState() {
  return appState;
}

module.exports = {
  getAppState,
  setAppStateError,
  setAppState,
  setAppStateOk,
};
