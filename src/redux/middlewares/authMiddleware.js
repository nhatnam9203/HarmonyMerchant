const authMiddleware = store => next => action => {
    if (action.token) {
        const appState = store.getState();
        // console.log('---token : ', appState);
        return next({ ...action, token: appState.dataLocal.token });
        // return next({ ...action, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjA5MjEyNTE3OTgiLCJVc2VySWQiOiIyIiwiIjoiIiwianRpIjoiMDU3NjYwZjUtOWEzMC00ZDJiLWE2NDMtZDQ5ODUzODIxMmQ0IiwidW5pcXVlX25hbWUiOiIyIiwicm9sZSI6Ik1lcmNoYW50IiwibmJmIjoxNTYwMTQxMDUwLCJleHAiOjE1NjAxNDgyNTAsImlhdCI6MTU2MDE0MTA1MCwiaXNzIjoiVGVzdC5jb20iLCJhdWQiOiJUZXN0LmNvbSJ9.BNth8aMPGCxwLaFd_5ajcKbkky79LsdD4SOPJChtoew" });

    } else {
        next(action);
    }

}

export default authMiddleware;