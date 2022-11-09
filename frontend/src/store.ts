import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from './redux'
// const composedEnhancer = compose(applyMiddleware(thunkMiddleware))
const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(rootReducer, composedEnhancer)

// store.subscribe(() => {
//   sessionStorage.setItem("data", JSON.stringify(store.getState().tieuchi.list));
// });
export default store

export type RootState = ReturnType<typeof store.getState>
