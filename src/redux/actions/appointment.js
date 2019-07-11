import apiConfigs from '../../configs/api';

export function getAppointmentById(id) {
    return {
        type: 'GET_APPOINTMENT_BY_ID',
        method: 'GET',
        api: `${apiConfigs.BASE_API}appointment/${id}`,
        token: true
    }
}

export function addItemIntoAppointment(body, id) {
    return {
        type: 'ADD_ITEM_INTO_APPOINTMENT',
        body: body,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/additem/${id}`,
        appointmentId: id
    }
}


export function removeItemIntoAppointment(body, id) {
    return {
        type: 'REMOVE_ITEM_INTO_APPOINTMENT',
        body: body,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/removeitem/${id}`,
        appointmentId: id
    }
}

export function resetBasketEmpty() {
    return {
        type: 'RESET_BASKET_EMPTY'
    }
}

export function resetKeyUpdateAppointment() {
    return {
        type: 'RESET_KEY_GET_APPOINTMENT'
    }
}


export function checkoutAppointment(id) {
    return {
        type: 'CHECK_OUT_APPOINTMENT',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/checkout/${id}`,
    }
}

export function paymentAppointment(appointmentId, method) {
    return {
        type: 'PAY_APPOINTMENT',
        body: {
            method
        },
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/pay/${appointmentId}`,
    }
}
