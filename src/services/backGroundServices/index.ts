
import { reduxStore } from "../../redux";
import { logFun, logFun_t } from "../../util/logger";
import { bgServiceSagaAction } from "../../redux/helperSideEffect/actions"

export default class {
    interval = 3000
    id = Math.floor(Math.random() * 10001);
    log = logFun("BG_SR-ID : " + this.id, undefined, true)
    timerFun: NodeJS.Timeout | undefined

    runner = () => {
        //this.log("-")
        reduxStore.store.dispatch(bgServiceSagaAction({/*  _log: this.log  */ }))
    }

    clearInterval = () => {
        if (this.timerFun != undefined) {
            this.log("clearing BGService Interval")
            clearInterval(this.timerFun)
            this.timerFun = undefined
        }
    }

    startInterval = () => {
        if (this.timerFun === undefined) {
            reduxStore.store.dispatch(bgServiceSagaAction({/*  _log: this.log  */ }))
            this.log("starting BGService Interval")
            this.timerFun = setInterval(this.runner, this.interval)
        }
    }

    constructor(interval?: number, _log?: logFun_t,) {
        this.log = logFun("BG_SR-ID : " + this.id, _log)
        if (interval)
            this.interval = interval
        this.startInterval()
    }


}

