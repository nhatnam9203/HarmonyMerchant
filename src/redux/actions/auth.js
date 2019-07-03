import apiConfigs from '../../configs/api';

export function login(email, password) {
    return {
        type: 'LOGIN_APP',
        body: {
            email: email,
            password: password
        },
        method: 'POST',
        api: `${apiConfigs.BASE_API}merchant/login`
    }
}

export function logout() {
    return {
        type: 'LOGOUT_APP',
    }
}


