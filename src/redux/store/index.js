import { applyMiddleware, createStore } from 'redux';
import { persistStore } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import sagaRoot from "../saga";
import reducers from '../reducers';
import { authMiddleware } from '../middlewares';

const sagaMiddleware = createSagaMiddleware();
const createAppStore = composeWithDevTools(applyMiddleware(
    authMiddleware,
    sagaMiddleware,
))(createStore);

const store = (createAppStore)(reducers);
const persistor = persistStore(store);

sagaMiddleware.run(sagaRoot);

module.exports = {
    persistor,
    store
}


// export default function configureStore() {
//     console.log("------ configureStore -------");
//     const store = (createAppStore)(reducers);
//     const persistor = persistStore(store);
//     sagaMiddleware.run(sagaRoot);
//     return { persistor, store };
// }
