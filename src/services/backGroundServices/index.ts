
import { reduxStore } from "../../redux";
import { logger } from "../../util/logger";
import { bgServiceSagaAction } from "../../redux/helperSideEffect/saga/bgServiceSaga"

export default class {
    interval = 3000
    id = Math.floor(Math.random() * 10001);
    log;
    timerFun: any/* NodeJS.Timeout | undefined */

    runner = () => {
        //this.log("-")
        reduxStore.store.dispatch(bgServiceSagaAction({/*  _log: this.log  */ }))
    }

    clearInterval = () => {
        if (this.timerFun != undefined) {
            this.log?.print("clearing BGService Interval")
            clearInterval(this.timerFun)
            this.timerFun = undefined
        }
    }

    startInterval = () => {
        if (this.timerFun === undefined) {
            reduxStore.store.dispatch(bgServiceSagaAction({/*  _log: this.log  */ }))
            this.log?.print("starting BGService Interval")
            this.timerFun = setInterval(this.runner, this.interval)
        } else {
            //clearInterval(this.timerFun)
        }
    }

    constructor(interval?: number, log?: logger) {
        this.log = log
        if (interval)
            this.interval = interval
    }


}

