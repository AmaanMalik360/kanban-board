const initialState = {
  users: [],
  permissions: [],
  userPermissions: [],
  isLoading: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "USERS_REQUEST":
      state = {
        ...state,
        isLoading: true,
      };
      break;

    case "USERS_SUCCESS":
      state = {
        ...state,
        users: action.payload,
        isLoading: false,
      };
      break;

    case "USERS_FAILURE":
      state = {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
      break;

    case "PERMISSIONS_REQUEST":
      state = {
        ...state,
        isLoading: true,
      };
      break;

    case "PERMISSIONS_SUCCESS":
      state = {
        ...state,
        permissions: action.payload,
        isLoading: false,
      };
      break;

    case "PERMISSIONS_FAILURE":
      state = {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
      break;

    case "USER_PERMISSIONS_REQUEST":
      state = {
        ...state,
        isLoading: true,
      };
      break;

    case "USER_PERMISSIONS_SUCCESS":
      state = {
        ...state,
        userPermissions: action.payload,
        isLoading: false,
      };
      break;

    case "USER_PERMISSIONS_FAILURE":
      state = {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
      break;
    case "CHANGE_PERMISSIONS_REQUEST":
      state = {
        ...state,
        isLoading: true
      };
      break;
    case "CHANGE_PERMISSIONS_SUCCESS":
      state = {
        ...state,
        userPermissions: action.payload,
        isLoading: false
      };
      break;

    case "CLEAR_ADMIN":
      state = {
        ...initialState,
      };
      break;
  }
  return state;
};
