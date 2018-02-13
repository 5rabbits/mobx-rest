'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _desc, _value, _class, _descriptor;

var _mobx = require('mobx');

var _apiClient = require('./apiClient');

var _apiClient2 = _interopRequireDefault(_apiClient);

var _Request = require('./Request');

var _Request2 = _interopRequireDefault(_Request);

var _ErrorObject = require('./ErrorObject');

var _ErrorObject2 = _interopRequireDefault(_ErrorObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  (0, _defineProperty2.default)(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var Base = (_dec = _mobx.observable.shallow, (_class = function () {
  function Base() {
    (0, _classCallCheck3.default)(this, Base);

    _initDefineProp(this, 'requests', _descriptor, this);
  }

  (0, _createClass3.default)(Base, [{
    key: 'url',


    /**
     * Returns the resource's url.
     *
     * @abstract
     */
    value: function url() {
      throw new Error('You must implement this method');
    }
  }, {
    key: 'withRequest',
    value: function withRequest(labels, promise, abort) {
      var _this = this;

      if (typeof labels === 'string') {
        labels = [labels];
      }

      var handledPromise = promise.then(function (response) {
        _this.requests.remove(request);
        return response;
      }).catch(function (error) {
        _this.requests.remove(request);
        throw new _ErrorObject2.default(error);
      });

      var request = new _Request2.default(handledPromise, {
        labels: labels,
        abort: abort
      });

      this.requests.push(request);

      return request;
    }
  }, {
    key: 'getRequest',
    value: function getRequest(label) {
      return this.requests.find(function (request) {
        return request.labels.indexOf(label) !== -1;
      });
    }
  }, {
    key: 'getAllRequests',
    value: function getAllRequests(label) {
      return this.requests.filter(function (request) {
        return request.labels.indexOf(label) !== -1;
      });
    }

    /**
     * Questions whether the request exists
     * and matches a certain label
     */

  }, {
    key: 'isRequest',
    value: function isRequest(label) {
      return !!this.getRequest(label);
    }

    /**
     * Call an RPC action for all those
     * non-REST endpoints that you may have in
     * your API.
     */

  }, {
    key: 'rpc',
    value: function rpc(label, endpoint, options) {
      var _apiClient$post = (0, _apiClient2.default)().post(this.url() + '/' + endpoint, options),
          promise = _apiClient$post.promise,
          abort = _apiClient$post.abort;

      return this.withRequest(label, promise, abort);
    }
  }]);
  return Base;
}(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'requests', [_dec], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class.prototype, 'rpc', [_mobx.action], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'rpc'), _class.prototype)), _class));
exports.default = Base;