const authMiddleware = store => next => action => {
    if (action.token) {
        const appState = store.getState();
        return next({ ...action, token: appState.dataLocal.token });

    } else {
        next(action);
    }

}

export default authMiddleware;