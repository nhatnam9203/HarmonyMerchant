const authMiddleware = store => next => action => {
    if (action.token) {
        const appState = store.getState();
        // console.log('---token : ', appState);
        return next({ ...action, token: appState.dataLocal.token });
        // return next({ ...action, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imh1eW5odGhpbmh1eTEyOTdAZ21haWwuY29tIiwiTWVyY2hhbnRJZCI6WyI5IiwiSGFtb255IEJ1c3NpbmVzIl0sImp0aSI6IjFkYWUyYjZlLTI3NjAtNDNiMS04NzYyLWE4MWJkZjU0NWFjMSIsInVuaXF1ZV9uYW1lIjoiOSIsInJvbGUiOiJNZXJjaGFudCIsIm5iZiI6MTU2MDMyNDYxNywiZXhwIjoxNTYwMzMxODE3LCJpYXQiOjE1NjAzMjQ2MTcsImlzcyI6IlRlc3QuY29tIiwiYXVkIjoiVGVzdC5jb20ifQ.UKnBxMm4WYvk2CBrf7RA_qCVDR0tFXhxRltOdRJD3wc" });

    } else {
        next(action);
    }

}

export default authMiddleware;