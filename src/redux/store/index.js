import rootReducer from "../reducers"
import {thunk} from "redux-thunk"
import {applyMiddleware, legacy_createStore as createStore, compose} from "redux"

// Middleware setup
const middleware = applyMiddleware(thunk);

// Redux DevTools extension setup
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


// Create the store with middleware and Redux DevTools extension
const store = createStore(
  rootReducer,
  composeEnhancers(middleware)
);

export default store; 
