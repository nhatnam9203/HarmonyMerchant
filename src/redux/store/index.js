import { applyMiddleware, createStore } from 'redux';
import { persistStore } from 'redux-persist';
import {
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import sagaRoot from "../saga";
import reducers from '../reducers';
import { authMiddleware } from '../middlewares';

const sagaMiddleware = createSagaMiddleware();
// const middleware = createReactNavigationReduxMiddleware("root", state => state.nav);
const createAppStore = composeWithDevTools(applyMiddleware(
    authMiddleware,
    // middleware,
    sagaMiddleware,
))(createStore);

export default function configureStore() {
    const store = (createAppStore)(reducers);
    const persistor = persistStore(store);
    sagaMiddleware.run(sagaRoot);
    return { persistor, store };
}
