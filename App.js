/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AppNavigator} from "./src/navigation"
import { Provider } from 'react-redux';
import {store} from './src/store/configureStore';
// const store = configureStore();

type Props = {};
export default class App extends Component<Props> {
    render() {
        return (
            <Provider store={store}>
                <AppNavigator />
            </Provider>
        );
    }
}

