'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _mobx = require('mobx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Request = function () {
  function Request(promise) {
    var _this = this;

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        labels = _ref.labels,
        abort = _ref.abort,
        _ref$progress = _ref.progress,
        progress = _ref$progress === undefined ? 0 : _ref$progress;

    (0, _classCallCheck3.default)(this, Request);

    this.state = 'pending';
    this.labels = labels;
    this.abort = abort;
    this.progress = progress;
    this.promise = promise;

    promise.then(function () {
      _this.state = 'fulfilled';
    }).catch(function () {
      _this.state = 'rejected';
    });
  }

  // This allows to use async/await on the request object


  (0, _createClass3.default)(Request, [{
    key: 'then',
    value: function then(onFulfilled, onRejected) {
      return this.promise.then(onFulfilled, onRejected);
    }
  }]);
  return Request;
}();

exports.default = Request;