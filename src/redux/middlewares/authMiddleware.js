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

    if (type === 'persist/REHYDRATE' && key === 'staff' && payload) {
        return next({
            type: 'REHYDRATE_STAFFS',
            payload: action.payload.listStaffByMerchant
        })
    }

    if (type === 'persist/REHYDRATE' && key === 'service' && payload) {
        return next({
            type: 'REHYDRATE_SERVICES',
            payload: action.payload.servicesByMerchant
        })
    }

    if (type === 'persist/REHYDRATE' && key === 'extra' && payload) {
        return next({
            type: 'REHYDRATE_EXTRAS',
            payload: action.payload.extrasByMerchant
        })
    }

    if (type === 'persist/REHYDRATE' && key === 'appointment' && payload) {
        return next({
            type: 'REHYDRATE_APPOINTMENT',
            payload: action.payload.listAppointmentsOfflineMode
        })
    }

    if (type === 'persist/REHYDRATE' && key === 'customer' && payload) {
        return next({
            type: 'REHYDRATE_CUSTOMERS',
            payload: action.payload.listCustomersByMerchant
        })
    }

    if (type === 'persist/REHYDRATE' && key === 'invoice' && payload) {
        return next({
            type: 'REHYDRATE_INVOICES',
            payload: action.payload.listInvoicesByMerchant
        })
    }

    if (type === 'persist/REHYDRATE' && key === 'marketing' && payload) {
        return next({
            type: 'REHYDRATE_MARKETINGS',
            listBanners: action.payload.listBanners,
            promotions: action.payload.promotions
        })
    }

    const appState = store.getState();
    const versionApp = appState.dataLocal.versionApp;
    const action_tempt = { ...action, versionApp };

    // console.log("---- action : ", JSON.stringify(action));

    if (action.token) {

        return next({ ...action_tempt, token: appState.dataLocal.profileStaffLogin.token });

    }

    if (action.type && action.type.includes("_SUCCESS")) {
        return next({ ...action_tempt, typeNetwork: 'IS_CONNECTED_INTERNET' });
    }

    if (action.type && action.type.includes("NET_WORK_REQUEST_FAIL")) {
        return next({ ...action_tempt, typeNetwork: 'NET_WORK_REQUEST_FAIL' });
    }


    return next(action_tempt);

}

export default authMiddleware;