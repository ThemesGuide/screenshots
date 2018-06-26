'use strict';

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _phantom = require('../phantom');

var _phantom2 = _interopRequireDefault(_phantom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('index.js', () => {
  it('phantom#create().then() returns a new Phantom instance', () => _index2.default.create().then(ph => {
    expect(ph).toBeInstanceOf(_phantom2.default);
    ph.exit();
  }));

  it('phantom#create() returns a new Promise instance', () => {
    const promise = _index2.default.create();
    expect(promise).toBeInstanceOf(Promise);
    return promise.then(ph => ph.exit());
  });

  it('phantom#create([], {}).then() with a custom shim path returns a new Phantom instance', () => _index2.default.create([], { shimPath: `${__dirname}/shim/index.js` }).then(ph => {
    expect(ph).toBeInstanceOf(_phantom2.default);
    ph.exit();
  }));

  it('#create([], {}) errors with undefined phantomjs-prebuilt to throw exception', async () => {
    await expect(_index2.default.create([], { phantomPath: null })).rejects.toEqual(new Error('PhantomJS binary was not found. ' + 'This generally means something went wrong when installing phantomjs-prebuilt. Exiting.'));
  });

  it('#create([], {}) errors with non-string passed in as shimPath', async () => {
    await expect(_index2.default.create([], { shimPath: 12 })).rejects.toEqual(new Error('Path to shim file was not found. ' + 'Are you sure you entered the path correctly? Exiting.'));
  });

  it('#create([], {}) errors with string for logger', async () => {
    await expect(_index2.default.create([], { logger: 'log' })).rejects.toEqual(new Error('logger must be a valid object.'));
  });

  it('#create([], {}) errors with string for logger', async () => {
    await expect(_index2.default.create('str')).rejects.toEqual(new Error('Unexpected type of parameters. Expecting args to be array.'));
  });
});