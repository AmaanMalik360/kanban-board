
const initState = {
    token: null,
    user: {},
    authenticated: false,
    loading: false,    
    error: null
};

export default (state = initState,  action) =>
{
    switch(action.type)
    { 
        case 'LOGIN_REQUEST':
            state = {
                ...state,
                loading: true
            }
        break;

        case 'LOGIN_SUCCESS':
            state = {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                authenticated: true,
                loading: false
            }
        break;
        case 'LOGIN_FAILURE':
            state = {
                ...state,
                loading: false,
                error: action.payload.error
            }
        break;    

        case 'LOGOUT_REQUEST':
        state = {
            ...state,
            loading: true
        }
        break;
        
        case 'LOGOUT_SUCCESS':
        state = {
            ...initState
        }
        break;
        case 'LOGOUT_FAILURE':
        state = {
            ...state,
            error: action.payload.error,
            loading: false
        }
        break;

    }

    return state;
}