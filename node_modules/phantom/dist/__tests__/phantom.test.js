'use strict';

var _phantomjsPrebuilt = require('phantomjs-prebuilt');

var _phantomjsPrebuilt2 = _interopRequireDefault(_phantomjsPrebuilt);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _phantom = require('../phantom');

var _phantom2 = _interopRequireDefault(_phantom);

var _page = require('../page');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable global-require */

describe('Phantom', () => {
  let instance;
  beforeEach(() => jest.resetModules());
  beforeEach(() => {
    instance = new _phantom2.default();
  });
  afterEach(async () => instance.exit());

  it('#createPage() returns a Promise', () => {
    const page = instance.createPage();
    expect(page).toBeInstanceOf(Promise);
    return page;
  });

  it('#createPage() resolves to a Page', async () => {
    const page = await instance.createPage();
    expect(page).toBeInstanceOf(_page2.default);
  });

  it('#create([], {}) execute with no parameters', () => {
    jest.mock('child_process');

    const actualSpawn = require.requireActual('child_process').spawn;
    const mockedSpawn = jest.fn((...args) => actualSpawn(...args));
    require('child_process').setMockedSpawn(mockedSpawn);

    const MockedProcess = require('../phantom').default;

    const pp = new MockedProcess();
    pp.exit();

    const pathToShim = _path2.default.normalize(`${__dirname}/../shim/index.js`);
    expect(mockedSpawn).toHaveBeenCalledWith(_phantomjsPrebuilt2.default.path, [pathToShim], { env: process.env });
  });

  it('#create(["--ignore-ssl-errors=yes"]) adds parameter to process', () => {
    jest.mock('child_process');

    const actualSpawn = require.requireActual('child_process').spawn;
    const mockedSpawn = jest.fn((...args) => actualSpawn(...args));
    require('child_process').setMockedSpawn(mockedSpawn);

    const MockedProcess = require('../phantom').default;

    const pp = new MockedProcess(['--ignore-ssl-errors=yes']);
    pp.exit();

    const pathToShim = _path2.default.normalize(`${__dirname}/../shim/index.js`);
    const { env } = process;
    expect(mockedSpawn).toHaveBeenCalledWith(_phantomjsPrebuilt2.default.path, ['--ignore-ssl-errors=yes', pathToShim], { env });
  });

  it("#create([], {phantomPath: 'phantomjs'}) execute phantomjs from custom path with no parameters", () => {
    jest.mock('child_process');

    const actualSpawn = require.requireActual('child_process').spawn;
    const mockedSpawn = jest.fn((...args) => actualSpawn(...args));
    require('child_process').setMockedSpawn(mockedSpawn);

    const MockedProcess = require('../phantom').default;

    const pp = new MockedProcess([], { phantomPath: 'phantomjs' });
    pp.exit();

    const pathToShim = _path2.default.normalize(`${__dirname}/../shim/index.js`);
    expect(mockedSpawn).toHaveBeenCalledWith('phantomjs', [pathToShim], { env: process.env });
    pp.exit();
  });

  it('#create([], {logger: logger}) to log messages', () => {
    const logger = { debug: jest.fn() };

    const pp = new _phantom2.default([], { logger });
    expect(logger.debug).toHaveBeenCalled();
    pp.exit();
  });

  it.skip("#create([], {logLevel: 'debug'}) change logLevel", () => {
    const logLevel = 'error';

    const pp = new _phantom2.default([], { logLevel });
    expect(pp.logger.transports.console.level).toEqual(logLevel);
    pp.exit();
  });

  it.skip("#create([], {logLevel: 'debug'}) should not change other log levels", () => {
    const logLevel = 'error';
    const p1 = new _phantom2.default([], { logLevel });
    p1.exit();

    const p2 = new _phantom2.default();
    expect(p2.logger.transports.console.level).toEqual('info');
    p2.exit();
  });

  it('#create("--ignore-ssl-errors=yes") to throw an exception', () => {
    expect(() => new _phantom2.default('--ignore-ssl-errors=yes')).toThrow();
  });

  it('#create(true) to throw an exception', () => {
    expect(() => new _phantom2.default(true)).toThrow();
  });

  xit('catches errors when stdin closes unexpectedly', async () => {
    instance.process.stdin.end();
    await expect(instance.createPage()).rejects.toEqual({
      error: 'Error reading from stdin: Error: write after end'
    });
  });

  xit('catches errors when stdout closes unexpectedly', async () => {
    instance.process.stdout.end();
    try {
      await expect(instance.createPage()).rejects.toEqual();
    } catch (e) {
      expect(e).toEqual(new Error('Error reading from stdout: Error: shutdown ENOTCONN'));
    }
  });

  it('#cookies() should return an empty cookies array', async () => {
    const cookies = await instance.cookies();
    expect(cookies).toEqual([]);
  });
});