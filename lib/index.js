'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Saga = exports.SagaProvider = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.connectSaga = connectSaga;

var _react = require('react');

var _reduxSaga = require('redux-saga');

var _effects = require('redux-saga/effects');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SagaProvider = exports.SagaProvider = function (_Component) {
  (0, _inherits3.default)(SagaProvider, _Component);

  function SagaProvider() {
    (0, _classCallCheck3.default)(this, SagaProvider);
    return (0, _possibleConstructorReturn3.default)(this, (SagaProvider.__proto__ || Object.getPrototypeOf(SagaProvider)).apply(this, arguments));
  }

  (0, _createClass3.default)(SagaProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        sagas: this.props.middleware
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react.Children.only(this.props.children);
    }
  }]);
  return SagaProvider;
}(_react.Component);

SagaProvider.propTypes = {
  // as returned from redux-saga:createSagaMiddleware
  middleware: _propTypes2.default.func.isRequired
};
SagaProvider.childContextTypes = {
  sagas: _propTypes2.default.func.isRequired
};

var Saga = exports.Saga = function (_Component2) {
  (0, _inherits3.default)(Saga, _Component2);

  function Saga(props) {
    (0, _classCallCheck3.default)(this, Saga);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (Saga.__proto__ || Object.getPrototypeOf(Saga)).call(this, props));

    _this2._propsChannel = (0, _reduxSaga.channel)(_reduxSaga.buffers.none());
    return _this2;
  }

  (0, _createClass3.default)(Saga, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.runSaga();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.putProps();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.cancelRunningSaga();
    }
  }, {
    key: 'rootSaga',
    value: /*#__PURE__*/_regenerator2.default.mark(function rootSaga() {
      var props;
      return _regenerator2.default.wrap(function rootSaga$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              props = this.props;
              _context.next = 3;
              return (0, _effects.fork)(props.saga, this._propsChannel);

            case 3:
              _context.next = 5;
              return (0, _effects.put)(this._propsChannel, props);

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, rootSaga, this);
    })
  }, {
    key: 'putProps',
    value: function putProps() {
      var props = this.props;
      var saga = props.saga,
          rest = (0, _objectWithoutProperties3.default)(props, ['saga']);

      this._propsChannel.put(rest);
    }
  }, {
    key: 'runSaga',
    value: function runSaga() {
      var context = this.context;


      if (!context.sagas) {
        throw new Error('Could not find sagas in React context. Did you forget to render <SagaProvider />?');
      }

      this._runningSaga = context.sagas.run(this.rootSaga.bind(this));
      this.putProps();
    }
  }, {
    key: 'cancelRunningSaga',
    value: function cancelRunningSaga() {
      if (this._runningSaga) {
        this._runningSaga.cancel();
        this._runningSaga = null;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;


      return !props.children ? null : _react.Children.only(props.children);
    }
  }]);
  return Saga;
}(_react.Component);

Saga.propTypes = {
  saga: _propTypes2.default.func.isRequired
};
Saga.contextTypes = {
  sagas: _propTypes2.default.func.isRequired
};
function connectSaga(saga) {
  return function (Target) {
    var _class, _temp;

    return _temp = _class = function (_Component3) {
      (0, _inherits3.default)(SagaContainer, _Component3);

      function SagaContainer() {
        (0, _classCallCheck3.default)(this, SagaContainer);
        return (0, _possibleConstructorReturn3.default)(this, (SagaContainer.__proto__ || Object.getPrototypeOf(SagaContainer)).apply(this, arguments));
      }

      (0, _createClass3.default)(SagaContainer, [{
        key: 'render',
        value: function render() {
          var props = this.props;


          return React.createElement(
            Saga,
            (0, _extends3.default)({
              saga: saga
            }, props),
            React.createElement(Target, props)
          );
        }
      }]);
      return SagaContainer;
    }(_react.Component), _class.displayName = 'SagaContainer(' + (Target.displayName || Target.name) + ')', _temp;
  };
}