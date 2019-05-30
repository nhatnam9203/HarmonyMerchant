import apiConfigs from '../../configs/api';

export function login(email, password) {
    return {
        type: 'LOGIN_APP',
        body: {
            "Email": email,
            "Password": password
        },
        method: 'POST',
        api: `${apiConfigs.BASE_API}Merchant/login`
    }
}