const initialState = {
    profile: {},
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjA5MjEyNTE3OTgiLCJVc2VySWQiOiIyIiwiIjoiIiwianRpIjoiMDU3NjYwZjUtOWEzMC00ZDJiLWE2NDMtZDQ5ODUzODIxMmQ0IiwidW5pcXVlX25hbWUiOiIyIiwicm9sZSI6Ik1lcmNoYW50IiwibmJmIjoxNTYwMTQxMDUwLCJleHAiOjE1NjAxNDgyNTAsImlhdCI6MTU2MDE0MTA1MCwiaXNzIjoiVGVzdC5jb20iLCJhdWQiOiJUZXN0LmNvbSJ9.BNth8aMPGCxwLaFd_5ajcKbkky79LsdD4SOPJChtoew"
}

function dataLocal(state = initialState, action) {
    switch (action.type) {
        case 'SAVE_PROFILE_LOCAL':
            return {
                ...state,
                profile: action.payload.profile,
                token: action.payload.token,
            }
        default:
            return state
    }
}

module.exports = dataLocal;

