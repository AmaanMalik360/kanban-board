const initialState = {
    users: [],
    tickets: [],
    phases: [],
    isLoading: false,
    error: null,
  };
  
export default (state = initialState, action) => 
{
    switch (action.type) {
      // Tickets Cases
      case "TICKETS_REQUEST":
        state = {
          ...state,
          isLoading: true,
        };
        break;

      case "TICKETS_SUCCESS":
        state = {
          ...state,
          tickets: action.payload,
          isLoading: false,
        };
        break;

      case "TICKETS_FAILURE":
        state = {
          ...state,
          isLoading: false,
          error: action.payload.error,
        };
        break;
      case "GET_USERS_REQUEST":
        state = {
          ...state,
          isLoading: true,
        };
        break;

      case "GET_USERS_SUCCESS":
        state = {
          ...state,
          users: action.payload,
          isLoading: false,
        };
        break;

      case "GET_USERS_FAILURE":
        state = {
          ...state,
          isLoading: false,
          error: action.payload.error,
        };
        break;

      case "DELETE_TICKET_REQUEST":
        state = {
          ...state,
          isLoading: true,
        };
        break;

      case "DELETE_TICKET_SUCCESS":
        state = {
          ...state,
          tickets: state.tickets.filter(
            (ticket) => ticket.id !== action.payload
          ),
          isLoading: false,
        };
        break;

      case "DELETE_TICKET_FAILURE":
        state = {
          ...state,
          isLoading: false,
          error: action.payload.error,
        };
        break;

      // Phases Cases
      case "PHASES_REQUEST":
        state = {
          ...state,
          isLoading: true,
        };
        break;

      case "PHASES_SUCCESS":
        state = {
          ...state,
          phases: action.payload,
          isLoading: false,
        };
        break;

      case "PHASES_FAILURE":
        state = {
          ...state,
          isLoading: false,
          error: action.payload.error,
        };
        break;

      case "CLEAR_TICKETS":
        state = {
          ...initialState,
        };
        break;
    }
return state;
};