'use strict';

var _command = require('../command');

var _command2 = _interopRequireDefault(_command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Command', () => {
  it('id to be randomly generated', () => {
    expect(new _command2.default('test').id).toEqual(new _command2.default().id - 1);
  });

  it('.target to be set correctly', () => {
    expect(new _command2.default('abc').target).toEqual('abc');
  });
});