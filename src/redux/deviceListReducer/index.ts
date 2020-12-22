import { _reducer_i, _reducer, initialState } from "./reducer"
import _saga, { _actions as _sagaActions } from "./saga"
import { _actionReturnTypes as __actionReturnTypes, _actions as __actions } from "./actions"
import { _actionReturnTypes as ___actionReturnTypes, _actions as _reducerActions } from "./reducer"
import { from } from "@apollo/client"

export { _reducer, _saga, initialState }
export const _actions = { deviceList: { ...__actions, ..._sagaActions, ..._reducerActions  } }
export interface reducer_i extends _reducer_i { }

export type _actionReturnTypes = __actionReturnTypes | ___actionReturnTypes


