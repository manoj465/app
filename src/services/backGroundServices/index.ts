
import reduxStore from "../../redux";
import { logger } from "../../@logger";
import { bgServiceSagaAction } from "../../redux/helperSideEffect/saga/bgServiceSaga"

export default class {
    iteration = 0
    interval = 3000
    id = Math.floor(Math.random() * 10001);
    log;
    timerFun: any/* NodeJS.Timeout | undefined */

    runner = () => {
        //this.log?.print("--")
        this._dispatchBgSagaAction()
    }

    clearInterval = () => {
        if (this.timerFun != undefined) {
            this.log?.print("clearing BGService Interval")
            clearInterval(this.timerFun)
            this.timerFun = undefined
        }
    }

    _dispatchBgSagaAction = () => {
        reduxStore.store.dispatch(bgServiceSagaAction({ iteration: this.iteration, log: this.log ? new logger("bg service saga", this.log) : undefined }))
        this.iteration = this.iteration < 2000 ? this.iteration + 1 : 1000
    }

    startInterval = () => {
        if (this.timerFun === undefined) {
            this._dispatchBgSagaAction()
            this.log?.print("starting BGService Interval")
            this.timerFun = setInterval(this.runner, this.interval)
        }
    }

    constructor({ interval, log }: constructor_props) {
        this.log = log
        if (interval)
            this.interval = interval
    }
}

interface constructor_props {
    interval?: number
    log?: logger
}