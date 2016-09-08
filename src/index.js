import { PropTypes, Children, Component } from 'react';
import { buffers, channel } from 'redux-saga'
import { call, fork, put } from 'redux-saga/effects';

export class SagaProvider extends Component {
  static propTypes = {
    // as returned from redux-saga:createSagaMiddleware
    middleware: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    sagas: PropTypes.func.isRequired,
  };

  getChildContext() {
    return {
      sagas: this.props.middleware,
    };
  }

  render() {
    return Children.only(this.props.children);
  }
}

export class Saga extends Component {
  static propTypes = {
    saga: PropTypes.func.isRequired,
  };

  static contextTypes = {
    sagas: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this._propsChannel = channel(buffers.none());
  }

  componentDidMount() {
    this.runSaga();
  }

  componentDidUpdate() {
    this.putProps();
  }

  componentWillUnmount() {
    this.cancelRunningSaga();
  }

  *rootSaga() {
    const { props } = this;
    yield fork(props.saga, this._propsChannel);
    yield put(this._propsChannel, props);
  }

  putProps() {
    const { props } = this;
    const { saga, ...rest } = props;
    this._propsChannel.put(rest);
  }

  runSaga() {
    const { context } = this;

    if (!context.sagas) {
      throw new Error('Could not find sagas in React context. Did you forget to render <SagaProvider />?');
    }

    this._runningSaga = context.sagas.run(this.rootSaga.bind(this));
    this.putProps();
  }

  cancelRunningSaga() {
    if (this._runningSaga) {
      this._runningSaga.cancel();
      this._runningSaga = null;
    }
  }

  render() {
    const { props } = this;

    return !props.children ? null : Children.only(props.children);
  }
}

export function connectSaga(saga) {
  return function (Target) {
    return class SagaContainer extends Component {
      static displayName = `SagaContainer(${Target.displayName || Target.name})`;

      render() {
        const { props } = this;

        return (
          <Saga
            saga={saga}
            {...props}
          >
            <Target
              {...props}
            />
          </Saga>
        );
      }
    };
  };
}
