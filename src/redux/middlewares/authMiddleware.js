const authMiddleware = store => next => action => {
    if (action.token) {
        const profile = store.getState().dataLocal.profile
        const temptAction = { ...action, token: profile.accesstoken, email: profile.email };
        next(temptAction);
    } else {
        next(action);
    }

}

export default authMiddleware;