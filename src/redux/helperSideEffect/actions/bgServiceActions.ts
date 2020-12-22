import { logFun_t } from "../../../util/logger";
import { _reduxConstant } from "../../ReduxConstant";

///DB-saga
export interface bgServiceSagaAction_porps { _log?: logFun_t }
export const _bgServiceSagaAction = ({ _log }: bgServiceSagaAction_porps): bgServiceAction_returnTypes => {
    return {
        type: _reduxConstant.BG_SERVICE_SAGA,
        props: { _log },
    };
};



export type bgServiceAction_returnTypes = | {
    type: _reduxConstant.BG_SERVICE_SAGA
    props: bgServiceSagaAction_porps
}