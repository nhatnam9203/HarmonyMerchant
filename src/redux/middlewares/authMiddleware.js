const authMiddleware = store => next => action => {
    if (action.token) {
        const appState = store.getState();
        return next({ ...action, token: appState.dataLocal.profileStaffLogin.token });

    }

    // console.log('middleware : ',action);
    if (action.type && action.type.includes("_SUCCESS")) {
        return next({ ...action, typeNetwork: 'IS_CONNECTED_INTERNET' });
    }

    if (action.type && action.type.includes("NET_WORK_REQUEST_FAIL")) {
        return next({ ...action, typeNetwork: 'NET_WORK_REQUEST_FAIL' });
    }


    return next(action);

}

export default authMiddleware;