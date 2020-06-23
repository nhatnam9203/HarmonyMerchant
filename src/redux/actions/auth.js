import apiConfigs from '../../configs/api';

export function login(email, password,isRememberMID = false) {
    return {
        type: 'LOGIN_APP',
        body: {
            email: email,
            password: password,
        },
        method: 'POST',
        api: `${apiConfigs.BASE_API}merchant/login`,
        isRememberMID
    }
}

export function logout() {
    return {
        type: 'LOGOUT_APP',
    }
}


export function forgotPassword(email) {
    return {
        type: 'FORGOT_PASSWORD',
        method: 'GET',
        api: `${apiConfigs.BASE_API}merchant/forgotpassword/?email=${email}`,
        email
    }
}
