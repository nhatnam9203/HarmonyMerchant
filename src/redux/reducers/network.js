import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";

const initialState = {
    isOfflineMode: false
}

function networkReducer(state = initialState, action) {
    switch (action.typeNetwork) {
        case 'IS_CONNECTED_INTERNET':
            return {
                ...state,
                isOfflineMode: false
            }
        case 'TURN_ON_OFFLINE_MODE':
            return {
                ...state,
                isOfflineMode: action.payload,
            }
        case 'NET_WORK_REQUEST_FAIL':
            return {
                ...state,
                isOfflineMode: true
            }
        case 'LOGOUT_APP':
            return {
                ...initialState,
            }
        default:
            return state
    }
}

module.exports = persistReducer({
    key: "network",
    storage: AsyncStorage,
    whitelist: []
}, networkReducer);

