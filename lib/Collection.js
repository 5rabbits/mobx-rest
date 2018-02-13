'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _difference2 = require('lodash/difference');

var _difference3 = _interopRequireDefault(_difference2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _isMatch2 = require('lodash/isMatch');

var _isMatch3 = _interopRequireDefault(_isMatch2);

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _desc, _value, _class, _descriptor;

var _mobx = require('mobx');

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _apiClient = require('./apiClient');

var _apiClient2 = _interopRequireDefault(_apiClient);

var _Base2 = require('./Base');

var _Base3 = _interopRequireDefault(_Base2);

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

var Collection = (_class = function (_Base) {
  (0, _inherits3.default)(Collection, _Base);

  function Collection() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    (0, _classCallCheck3.default)(this, Collection);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Collection.__proto__ || (0, _getPrototypeOf2.default)(Collection)).call(this));

    _initDefineProp(_this, 'models', _descriptor, _this);

    _this.build = function () {
      var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var ModelClass = _this.model();

      if (attributes instanceof ModelClass) {
        attributes.collection = _this;
        return attributes;
      }

      if (attributes instanceof _Model2.default) {
        throw new Error('The model must be an instance of ' + ModelClass.name);
      }

      var model = new ModelClass(attributes);
      model.collection = _this;

      return model;
    };

    _this.set(data);
    return _this;
  }

  /**
   * Alias for models.length
   */


  (0, _createClass3.default)(Collection, [{
    key: 'map',


    /**
     * Alias for models.map
     */
    value: function map(callback) {
      return this.models.map(callback);
    }

    /**
     * Alias for models.forEach
     */

  }, {
    key: 'forEach',
    value: function forEach(callback) {
      return this.models.forEach(callback);
    }

    /**
     * Returns the URL where the model's resource would be located on the server.
     *
     * @abstract
     */

  }, {
    key: 'url',
    value: function url() {
      throw new Error('You must implement this method');
    }

    /**
     * Specifies the model class for that collection
     */

  }, {
    key: 'model',
    value: function model() {
      return _Model2.default;
    }

    /**
     * Returns a JSON representation
     * of the collection
     */

  }, {
    key: 'toJS',
    value: function toJS() {
      return this.models.map(function (model) {
        return model.toJS();
      });
    }

    /**
     * Alias of slice
     */

  }, {
    key: 'toArray',
    value: function toArray() {
      return this.slice();
    }

    /**
     * Returns a defensive shallow array representation
     * of the collection
     */

  }, {
    key: 'slice',
    value: function slice() {
      return this.models.slice();
    }

    /**
     * Returns a shallow array representation
     * of the collection
     */

  }, {
    key: 'peek',
    value: function peek() {
      return this.models.peek();
    }

    /**
     * Wether the collection is empty
     */

  }, {
    key: '_ids',


    /**
     * Gets the ids of all the items in the collection
     */
    value: function _ids() {
      return (0, _map3.default)(this.models, function (item) {
        return item.id;
      }).filter(Boolean);
    }

    /**
     * Get a resource at a given position
     */

  }, {
    key: 'at',
    value: function at(index) {
      return this.models[index];
    }

    /**
     * Get a resource with the given id or uuid
     */

  }, {
    key: 'get',
    value: function get(id) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$required = _ref.required,
          required = _ref$required === undefined ? false : _ref$required;

      var model = this.models.find(function (item) {
        return item.id === id;
      });

      if (!model && required) {
        throw Error('Invariant: Model must be found with id: ' + id);
      }

      return model;
    }

    /**
     * Get resources matching criteria
     */

  }, {
    key: 'filter',
    value: function filter(query) {
      return (0, _filter3.default)(this.models, function (model) {
        return typeof query === 'function' ? query(model) : (0, _isMatch3.default)(model.toJS(), query);
      });
    }

    /**
     * Finds an element with the given matcher
     */

  }, {
    key: 'find',
    value: function find(query) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$required = _ref2.required,
          required = _ref2$required === undefined ? false : _ref2$required;

      var model = (0, _find3.default)(this.models, function (model) {
        return typeof query === 'function' ? query(model) : (0, _isMatch3.default)(model.toJS(), query);
      });

      if (!model && required) {
        throw Error('Invariant: Model must be found');
      }

      return model;
    }

    /**
     * Adds a model or collection of models.
     */

  }, {
    key: 'add',
    value: function add(data) {
      var _models;

      if (!Array.isArray(data)) {
        data = [data];
      }

      (_models = this.models).push.apply(_models, (0, _toConsumableArray3.default)(data.map(this.build)));
    }

    /**
     * Resets the collection of models.
     */

  }, {
    key: 'reset',
    value: function reset(data) {
      this.models.replace(data.map(this.build));
    }

    /**
     * Removes the model with the given ids or uuids
     */

  }, {
    key: 'remove',
    value: function remove(ids) {
      var _this2 = this;

      if (!Array.isArray(ids)) {
        ids = [ids];
      }

      ids.forEach(function (id) {
        var model = void 0;

        if (id instanceof _Model2.default && id.collection === _this2) {
          model = id;
        } else if (typeof id === 'number') {
          model = _this2.get(id);
        }

        if (!model) return;

        _this2.models.splice(_this2.models.indexOf(model), 1);
        model.collection = undefined;
      });
    }

    /**
     * Sets the resources into the collection.
     *
     * You can disable adding, changing or removing.
     */

  }, {
    key: 'set',
    value: function set(resources) {
      var _this3 = this;

      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref3$add = _ref3.add,
          add = _ref3$add === undefined ? true : _ref3$add,
          _ref3$change = _ref3.change,
          change = _ref3$change === undefined ? true : _ref3$change,
          _ref3$remove = _ref3.remove,
          remove = _ref3$remove === undefined ? true : _ref3$remove;

      if (remove) {
        var ids = resources.map(function (r) {
          return r.id;
        });
        var toRemove = (0, _difference3.default)(this._ids(), ids);
        if (toRemove.length) this.remove(toRemove);
      }

      resources.forEach(function (resource) {
        var model = _this3.get(resource.id);

        if (model && change) model.set(resource);
        if (!model && add) _this3.add([resource]);
      });
    }

    /**
     * Creates a new model instance with the given attributes
     */

  }, {
    key: 'create',


    /**
     * Creates the model and saves it on the backend
     *
     * The default behaviour is optimistic but this
     * can be tuned.
     */
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(attributesOrModel) {
        var _this4 = this;

        var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref5$optimistic = _ref5.optimistic,
            optimistic = _ref5$optimistic === undefined ? true : _ref5$optimistic;

        var model, promise, request;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                model = this.build(attributesOrModel);
                promise = model.save();


                if (optimistic) {
                  this.add(model);
                }

                request = this.withRequest('creating', promise);


                request.then(function (response) {
                  if (!optimistic) {
                    _this4.add(model);
                  }
                  return response;
                }).catch(function (error) {
                  if (optimistic) {
                    _this4.remove(model);
                  }
                  throw error;
                });

                return _context.abrupt('return', request);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function create(_x6) {
        return _ref4.apply(this, arguments);
      }

      return create;
    }()

    /**
     * Fetches the models from the backend.
     *
     * It uses `set` internally so you can
     * use the options to disable adding, changing
     * or removing.
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      var _this5 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _apiClient$get = (0, _apiClient2.default)().get(this.url(), options),
          abort = _apiClient$get.abort,
          promise = _apiClient$get.promise;

      var request = this.withRequest('fetching', promise, abort);

      request.then(function (data) {
        _this5.set(data, options);
        return data;
      });

      return request;
    }
  }, {
    key: 'length',
    get: function get() {
      return this.models.length;
    }
  }, {
    key: 'isEmpty',
    get: function get() {
      return this.length === 0;
    }
  }]);
  return Collection;
}(_Base3.default), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'models', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class.prototype, 'length', [_mobx.computed], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'length'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'isEmpty', [_mobx.computed], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'isEmpty'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'add', [_mobx.action], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'add'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'reset', [_mobx.action], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'reset'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'remove', [_mobx.action], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'remove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'set', [_mobx.action], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'set'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'create', [_mobx.action], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'create'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fetch', [_mobx.action], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fetch'), _class.prototype)), _class);
exports.default = Collection;