const initialState = {
    appointmentDetail: {
        total: 0
    }
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_APPOINTMENT_BY_ID_SUCCESS':
            return {
                ...state,
                appointmentDetail: action.payload
            }
        default:
            return state
    }
}

module.exports = appReducer;
