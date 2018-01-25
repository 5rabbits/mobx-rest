'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _mobx = require('mobx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Request = function (_Promise) {
  (0, _inherits3.default)(Request, _Promise);

  function Request(promise) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        labels = _ref.labels,
        abort = _ref.abort,
        _ref$progress = _ref.progress,
        progress = _ref$progress === undefined ? 0 : _ref$progress;

    (0, _classCallCheck3.default)(this, Request);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Request.__proto__ || (0, _getPrototypeOf2.default)(Request)).call(this, function (resolve, reject) {
      return promise.then(resolve).catch(reject);
    }));

    _this.state = 'pending';
    _this.labels = labels;
    _this.abort = abort;
    _this.progress = progress;

    promise.then(function () {
      _this.state = 'fulfilled';
    }).catch(function () {
      _this.state = 'rejected';
    });
    return _this;
  }

  return Request;
}(_promise2.default);

exports.default = Request;