const {
  sendHTTPError,
  sendHTTPSuccess,
  validateUUID,
  extractParam,
  getIntegration,
  execShellCommand,
} = require('../../utils/common');

describe('sendHTTPError', () => {
  it('should send HTTP error response with default error code 400', () => {
    const res = {
      statusCode: 0,
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    };
    const body = { message: 'Error message' };
    sendHTTPError(res, body);
    expect(res.statusCode).toBe(400);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Length', JSON.stringify({ result: body }).length);
    expect(res.write).toHaveBeenCalledWith(JSON.stringify({ result: body }));
    expect(res.end).toHaveBeenCalled();
  });

  it('should send HTTP error response with custom error code', () => {
    const res = {
      statusCode: 0,
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    };
    const body = { message: 'Error message' };
    const errorCode = 401;
    sendHTTPError(res, body, errorCode);
    expect(res.statusCode).toBe(errorCode);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Length', JSON.stringify({ result: body }).length);
    expect(res.write).toHaveBeenCalledWith(JSON.stringify({ result: body }));
    expect(res.end).toHaveBeenCalled();
  });
});

describe('sendHTTPSuccess', () => {
  it('should send HTTP success response with default status 200', () => {
    const res = {
      statusCode: 0,
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    };
    const body = { message: 'Success message' };
    sendHTTPSuccess(res, body);
    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Length', JSON.stringify({ result: body }).length);
    expect(res.write).toHaveBeenCalledWith(JSON.stringify({ result: body }));
    expect(res.end).toHaveBeenCalled();
  });

  it('should send HTTP success response with custom status', () => {
    const res = {
      statusCode: 0,
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    };
    const body = { message: 'Success message' };
    const status = 201;
    sendHTTPSuccess(res, body, status);
    expect(res.statusCode).toBe(status);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Length', JSON.stringify({ result: body }).length);
    expect(res.write).toHaveBeenCalledWith(JSON.stringify({ result: body }));
    expect(res.end).toHaveBeenCalled();
  });
});

describe('validateUUID', () => {
  it('should return true for valid UUID', () => {
    const uuid = 'de305d54-75b4-431b-adb2-eb6b9e546014';
    expect(validateUUID(uuid)).toBe(true);
  });
  it('should return false for invalid UUID', () => {
    const uuid = '';
    expect(validateUUID(uuid)).toBe(false);
  });
});

describe('extractParam', () => {
  it('should return true for valid UUID', () => {
    const path = null;
    const param = null;
    expect(extractParam(path, param)).toBeNull();
  });
  it('should return false for invalid UUID', () => {
    const path = 'path';
    const param = 'param';
    expect(extractParam(path, param)).toBe('');
  });
  it('should return false for invalid UUID', () => {
    const path = 'path';
    const param = null;
    expect(extractParam(path, param)).toBeNull();
  });
});

describe('getIntegration', () => {
  const integrations = [
    {
      type: 'payment',
      name: 'Stripe',
      properties: {},
      active: true,
    },
    {
      type: 'analytics',
      name: 'Google Analytics',
      properties: {
        organisationId: '2357KOP0000PSP',
      },
      active: true,
    },
    {
      type: 'marketing',
      name: 'Mailchimp',
      properties: {},
      active: true,
    },
  ];
  test('returns the integration when the type matches', () => {
    const integration = getIntegration('analytics', integrations, '2357KOP0000PSP');
    expect(integration).toEqual(integrations[1]);
  });

  test('returns null when the type does not match', () => {
    const integration = getIntegration('crm', integrations, '2357KOP0000PSP');
    expect(integration).toBeNull();
  });
  test('returns null when the integrations array is empty', () => {
    const integration = getIntegration('payment', [], '2357KOP0000PSP');
    expect(integration).toBeNull();
  });
});

describe('execShellCommand function', () => {
  test('should execute shell command and return output', async () => {
    const result = await execShellCommand('ls', ['-la']);
    expect(result.status).toBe(0);
    expect(result.body.message).toBe('success');
  });
});
