const initialState = {
    appointmentDetail: {},
    isGetAppointmentSucces: false
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_APPOINTMENT_BY_ID_SUCCESS':
            return {
                ...state,
                appointmentDetail: action.payload,
                isGetAppointmentSucces: true
            }
        case 'GET_APPOINTMENT_BY_ID_FAIL':
            return {
                ...state,
                appointmentDetail: {}
            }
        case 'RESET_KEY_GET_APPOINTMENT':
            return {
                ...state,
                isGetAppointmentSucces: false
            }
        case 'RESET_BASKET_EMPTY':
            return {
                ...state,
                appointmentDetail: {}
            }


        default:
            return state
    }
}

module.exports = appReducer;
