'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _union2 = require('lodash/union');

var _union3 = _interopRequireDefault(_union2);

var _uniqueId2 = require('lodash/uniqueId');

var _uniqueId3 = _interopRequireDefault(_uniqueId2);

var _desc, _value, _class, _class2, _temp;

var _mobx = require('mobx');

var _Collection = require('./Collection');

var _Collection2 = _interopRequireDefault(_Collection);

var _apiClient = require('./apiClient');

var _apiClient2 = _interopRequireDefault(_apiClient);

var _Base2 = require('./Base');

var _Base3 = _interopRequireDefault(_Base2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var Model = (_class = (_temp = _class2 = function (_Base) {
  (0, _inherits3.default)(Model, _Base);

  function Model() {
    var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Model);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Model.__proto__ || (0, _getPrototypeOf2.default)(Model)).call(this));

    _this.attributes = _mobx.observable.map();
    _this.committedAttributes = _mobx.observable.map();
    _this.optimisticId = (0, _uniqueId3.default)('i_');
    _this.collection = null;


    var mergedAttributes = (0, _extends3.default)({}, _this.constructor.defaultAttributes, attributes);

    _this.attributes.replace(mergedAttributes);
    _this.commitChanges();
    return _this;
  }

  /**
   * Returns a JSON representation
   * of the model
   */


  (0, _createClass3.default)(Model, [{
    key: 'toJS',
    value: function toJS() {
      return (0, _mobx.toJS)(this.attributes);
    }

    /**
     * Determine what attribute do you use
     * as a primary id
     *
     * @abstract
     */

  }, {
    key: 'urlRoot',


    /**
     * Return the base url used in
     * the `url` method
     *
     * @abstract
     */
    value: function urlRoot() {
      return null;
    }

    /**
     * Return the url for this given REST resource
     */

  }, {
    key: 'url',
    value: function url() {
      var urlRoot = this.urlRoot();

      if (!urlRoot && this.collection) {
        urlRoot = this.collection.url();
      }

      if (!urlRoot) {
        throw new Error('implement `urlRoot` method or `url` on the collection');
      }

      if (this.isNew) {
        return urlRoot;
      } else {
        return urlRoot + '/' + this.get(this.primaryKey);
      }
    }

    /**
     * Wether the resource is new or not
     *
     * We determine this asking if it contains
     * the `primaryKey` attribute (set by the server).
     */

  }, {
    key: 'get',


    /**
     * Get the attribute from the model.
     *
     * Since we want to be sure changes on
     * the schema don't fail silently we
     * throw an error if the field does not
     * exist.
     *
     * If you want to deal with flexible schemas
     * use `has` to check wether the field
     * exists.
     */
    value: function get(attribute) {
      if (this.has(attribute)) {
        return this.attributes.get(attribute);
      }
      throw new Error('Attribute "' + attribute + '" not found');
    }

    /**
     * Returns whether the given field exists
     * for the model.
     */

  }, {
    key: 'has',
    value: function has(attribute) {
      return this.attributes.has(attribute);
    }

    /**
     * Get an id from the model. It will use either
     * the backend assigned one or the client.
     */

  }, {
    key: 'hasChanges',


    /**
     * If an attribute is specified, returns true if it has changes.
     * If no attribute is specified, returns true if any attribute has changes.
     */
    value: function hasChanges(attribute) {
      if (attribute) {
        return this.changedAttributes.indexOf(attribute) !== -1;
      }

      return this.changedAttributes.length > 0;
    }
  }, {
    key: 'commitChanges',
    value: function commitChanges() {
      this.committedAttributes.replace((0, _mobx.toJS)(this.attributes));
    }
  }, {
    key: 'discardChanges',
    value: function discardChanges() {
      this.attributes.replace((0, _mobx.toJS)(this.committedAttributes));
    }

    /**
     * Replace all attributes with new data
     */

  }, {
    key: 'reset',
    value: function reset(data) {
      this.attributes.replace(data ? (0, _extends3.default)({}, this.constructor.defaultAttributes, data) : this.constructor.defaultAttributes);
    }

    /**
     * Merge the given attributes with
     * the current ones
     */

  }, {
    key: 'set',
    value: function set(data) {
      this.attributes.merge(data);
    }

    /**
     * Fetches the model from the backend.
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _apiClient$get = (0, _apiClient2.default)().get(this.url(), options),
          abort = _apiClient$get.abort,
          promise = _apiClient$get.promise;

      return this.withRequest('fetching', promise, abort).then(function (data) {
        _this2.set(data);
        _this2.commitChanges();
        return data;
      });
    }

    /**
     * Saves the resource on the backend.
     *
     * If the item has a `primaryKey` it updates it,
     * otherwise it creates the new resource.
     *
     * It supports optimistic and patch updates.
     *
     * TODO: Add progress
     */

  }, {
    key: 'save',
    value: function save() {
      var _this3 = this;

      var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$optimistic = _ref.optimistic,
          optimistic = _ref$optimistic === undefined ? true : _ref$optimistic,
          _ref$patch = _ref.patch,
          patch = _ref$patch === undefined ? false : _ref$patch,
          _ref$keepChanges = _ref.keepChanges,
          keepChanges = _ref$keepChanges === undefined ? true : _ref$keepChanges;

      var currentAttributes = this.toJS();
      var mergedAttributes = (0, _extends3.default)({}, currentAttributes, attributes);
      var label = this.isNew ? 'creating' : 'updating';
      var data = !this.isNew && patch ? getChangesBetween(this.committedAttributes.toJS(), mergedAttributes) : mergedAttributes;

      var method = void 0;

      if (this.isNew) {
        method = 'post';
      } else if (patch) {
        method = 'patch';
      } else {
        method = 'put';
      }

      if (optimistic) {
        this.set(attributes);
      }

      var _apiClient$method = (0, _apiClient2.default)()[method](this.url(), { data: data }),
          promise = _apiClient$method.promise,
          abort = _apiClient$method.abort;

      return this.withRequest(['saving', label], promise, abort).then(function (data) {
        var changes = getChangesBetween(currentAttributes, _this3.attributes.toJS());

        (0, _mobx.runInAction)('save success', function () {
          _this3.set(data);
          _this3.commitChanges();

          if (keepChanges) {
            _this3.set(changes);
          }
        });

        return data;
      }).catch(function (error) {
        _this3.set(currentAttributes);
        throw error;
      });
    }

    /**
     * Destroys the resurce on the client and
     * requests the backend to delete it there
     * too
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      var _this4 = this;

      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$optimistic = _ref2.optimistic,
          optimistic = _ref2$optimistic === undefined ? true : _ref2$optimistic;

      var collection = this.collection;

      if (this.isNew && collection) {
        collection.remove(this);
        return _promise2.default.resolve();
      }

      if (this.isNew) {
        return _promise2.default.resolve();
      }

      var _apiClient$del = (0, _apiClient2.default)().del(this.url()),
          promise = _apiClient$del.promise,
          abort = _apiClient$del.abort;

      if (optimistic && collection) {
        collection.remove(this);
      }

      return this.withRequest('destroying', promise, abort).then(function (data) {
        if (!optimistic && collection) {
          collection.remove(_this4);
        }
        return data;
      }).catch(function (error) {
        if (optimistic && collection) {
          collection.add(_this4);
        }
        throw error;
      });
    }
  }, {
    key: 'primaryKey',
    get: function get() {
      return 'id';
    }
  }, {
    key: 'isNew',
    get: function get() {
      return !this.has(this.primaryKey);
    }
  }, {
    key: 'id',
    get: function get() {
      return this.has(this.primaryKey) ? this.get(this.primaryKey) : this.optimisticId;
    }

    /**
     * Get an array with the attributes names that have changed.
     */

  }, {
    key: 'changedAttributes',
    get: function get() {
      return getChangedAttributesBetween(this.committedAttributes.toJS(), this.attributes.toJS());
    }

    /**
     * Gets the current changes.
     */

  }, {
    key: 'changes',
    get: function get() {
      return getChangesBetween(this.committedAttributes.toJS(), this.attributes.toJS());
    }
  }]);
  return Model;
}(_Base3.default), _class2.defaultAttributes = {}, _temp), (_applyDecoratedDescriptor(_class.prototype, 'isNew', [_mobx.computed], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'isNew'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'changedAttributes', [_mobx.computed], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'changedAttributes'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'changes', [_mobx.computed], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'changes'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'commitChanges', [_mobx.action], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'commitChanges'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'discardChanges', [_mobx.action], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'discardChanges'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'reset', [_mobx.action], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'reset'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'set', [_mobx.action], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'set'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fetch', [_mobx.action], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fetch'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'save', [_mobx.action], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'save'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'destroy', [_mobx.action], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'destroy'), _class.prototype)), _class);
exports.default = Model;


var getChangedAttributesBetween = function getChangedAttributesBetween(source, target) {
  var keys = (0, _union3.default)((0, _keys2.default)(source), (0, _keys2.default)(target));

  return keys.filter(function (key) {
    return source[key] !== target[key];
  });
};

var getChangesBetween = function getChangesBetween(source, target) {
  var changes = {};

  getChangedAttributesBetween(source, target).forEach(function (key) {
    changes[key] = target[key];
  });

  return changes;
};