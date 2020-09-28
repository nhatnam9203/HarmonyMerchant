import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";

const initialState = {
    isUpload: false,
    dataUpload: {}
}

function uploadReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPLOAD_AVATAR_SUCCESS':
            return {
                ...state,
                isUpload: true,
                dataUpload: action.payload
            }
        case 'UPLOAD_AVATAR_FAIL':
            return {
                ...state,
                isUpload: false,
                dataUpload: false
            }
        case 'RESET_STATE_UPLOAD':
            return {
                ...state,
                isUpload: false,
                dataUpload: {}
            }

        default:
            return state
    }
}

// module.exports = appReducer;

module.exports = persistReducer({
    key: "upload",
    storage: AsyncStorage,
    whitelist:[]
  }, uploadReducer);
