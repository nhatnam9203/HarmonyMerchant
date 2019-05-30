const authMiddleware = store => next => action => {
    console.log('---authMiddleware : ' ,action);
    if (action.token) {
        const appState = store.getState();
        console.log('---token : ', appState);
        return next({ ...action, token: appState.dataLocal.token });
    } else {
        next(action);
    }

}

export default authMiddleware;