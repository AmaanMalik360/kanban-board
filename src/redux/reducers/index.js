import { combineReducers } from "redux";
import authReducers from "./authReducers";
import ticketsReducers from "./ticketReducer";
import adminReducer from "./adminReducer";

const rootReducer = combineReducers({
    auth: authReducers,
    tickets: ticketsReducers,
    admin: adminReducer
})

export default rootReducer;