'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = apiClient;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentAdapter = void 0;

/**
 * Sets or gets the api client instance
 */

function apiClient(adapter) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (adapter) {
    currentAdapter = (0, _assign2.default)({}, adapter, options);
  }

  if (!currentAdapter) {
    throw new Error('You must set an adapter first!');
  }

  return currentAdapter;
}