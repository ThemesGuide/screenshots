'use strict';

require('babel-polyfill');

var _phantom = require('../phantom');

var _phantom2 = _interopRequireDefault(_phantom);

var _out_object = require('../out_object');

var _out_object2 = _interopRequireDefault(_out_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Command', () => {
  let phantom;

  beforeEach(() => {
    phantom = new _phantom2.default();
  });
  afterEach(() => phantom.exit());

  it('target to be set', () => {
    expect(phantom.createOutObject().target).toBeDefined();
  });

  it('#createOutObject() is a valid OutObject', () => {
    const outObj = phantom.createOutObject();
    expect(outObj).toBeInstanceOf(_out_object2.default);
  });
});