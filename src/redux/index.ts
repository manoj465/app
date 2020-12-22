import __actions from "./actions"
import { _actions } from './reducers'
import { _configureReduxStore } from "./ReduxStore"
import { _actions as deviceListAction } from "./deviceListReducer"

export { _reduxConstant as reduxConstant } from "./ReduxConstant"



const reduxStore = { actions: { ...__actions, ..._actions, ...deviceListAction }, store: _configureReduxStore() }
export { reduxStore }