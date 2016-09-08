'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Saga = exports.SagaProvider = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.connectSaga = connectSaga;

var _react = require('react');

var _reduxSaga = require('redux-saga');

var _effects = require('redux-saga/effects');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SagaProvider = exports.SagaProvider = function (_Component) {
  _inherits(SagaProvider, _Component);

  function SagaProvider() {
    _classCallCheck(this, SagaProvider);

    return _possibleConstructorReturn(this, (SagaProvider.__proto__ || Object.getPrototypeOf(SagaProvider)).apply(this, arguments));
  }

  _createClass(SagaProvider, [{
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
  middleware: _react.PropTypes.func.isRequired
};
SagaProvider.childContextTypes = {
  sagas: _react.PropTypes.func.isRequired
};

var Saga = exports.Saga = function (_Component2) {
  _inherits(Saga, _Component2);

  function Saga(props) {
    _classCallCheck(this, Saga);

    var _this2 = _possibleConstructorReturn(this, (Saga.__proto__ || Object.getPrototypeOf(Saga)).call(this, props));

    _this2._propsChannel = (0, _reduxSaga.channel)(_reduxSaga.buffers.none());
    return _this2;
  }

  _createClass(Saga, [{
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
    value: regeneratorRuntime.mark(function rootSaga() {
      var props;
      return regeneratorRuntime.wrap(function rootSaga$(_context) {
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
      var saga = props.saga;

      var rest = _objectWithoutProperties(props, ['saga']);

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
  saga: _react.PropTypes.func.isRequired
};
Saga.contextTypes = {
  sagas: _react.PropTypes.func.isRequired
};
function connectSaga(saga) {
  return function (Target) {
    var _class, _temp;

    return _temp = _class = function (_Component3) {
      _inherits(SagaContainer, _Component3);

      function SagaContainer() {
        _classCallCheck(this, SagaContainer);

        return _possibleConstructorReturn(this, (SagaContainer.__proto__ || Object.getPrototypeOf(SagaContainer)).apply(this, arguments));
      }

      _createClass(SagaContainer, [{
        key: 'render',
        value: function render() {
          var props = this.props;


          return React.createElement(
            Saga,
            _extends({
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