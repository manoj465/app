import { initialState, _actionReturnTypes as ___actionReturnTypes, _actions as _reducerActions, _reducer } from './reducer';
import _saga, { _actions as _sagaActions } from './saga';

export { _reducer, _saga as saga, initialState };
export const _actions = { deviceList: { ..._sagaActions, ..._reducerActions } };
