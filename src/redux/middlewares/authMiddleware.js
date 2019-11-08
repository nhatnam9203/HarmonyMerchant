const authMiddleware = store => next => action => {

    const { type, payload } = action;
    const key = action.key ? action.key : '';
    if (type === 'persist/REHYDRATE' && key === 'category' && payload) {
        return next({
            type: 'REHYDRATE_CATEGORIES',
            payload: action.payload.categoriesByMerchant
        })
    }
    if (type === 'persist/REHYDRATE' && key === 'product' && payload) {
        return next({
            type: 'REHYDRATE_PRODUCTS',
            payload: action.payload.productsByMerchantId
        })
    }


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