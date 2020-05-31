import React, {Component} from 'react';
import Container from './core/Navigator';
import AppContainer from './container/drawer-navigator'
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import Store from './store/store';
import ImageUtils from './utils/image.utils';

interface Props {}
export default class App extends Component<Props> {
  constructor(props) {
    super(props);

    YellowBox.ignoreWarnings([
      'Warning: '
    ]);
  }

  render() {
    return (
      <Provider store={Store}>
        <AppContainer />
      </Provider>
    );
  }
}