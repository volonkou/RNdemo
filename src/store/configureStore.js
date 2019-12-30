
import { createStore, applyMiddleware,compose } from 'redux'
import ReduxThunk from 'redux-thunk'
import rootReducer from '../reducers/rootReducer';

function configureStore() {

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(rootReducer, {}, composeEnhancers(
        applyMiddleware(ReduxThunk)
    ));
    return store;
}

export const store = configureStore();

