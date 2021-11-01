import reduxStore from '../../redux';
import { logger } from '../../@logger';
import { bgServiceSagaAction } from '../../redux/helperSideEffect/saga/bgServiceSaga';
import { getCurrentTimeStampInSeconds } from '../../util/DateTimeUtil';

interface constructor_props {
  interval?: number;
  log?: logger;
}

export default class {
  iteration = 0;
  interval = 3000;
  id = Math.floor(Math.random() * 10001);
  log: logger | undefined = undefined;
  timerFun: any; /* NodeJS.Timeout | undefined */

  constructor({ interval, log }: constructor_props) {
    if (log) this.log = log;
    if (interval) this.interval = interval;
  }

  runner = () => {
    this.log?.print('runner iteration : ' + this.iteration + ', timestamp : ' + getCurrentTimeStampInSeconds());
    if (this.iteration % 3 === 0) {
      this.log?.print('time to sync backend data');
      reduxStore.store.dispatch(
        reduxStore.actions.HBReducer.backendSyncSagaAction({
          iteration: this.iteration,
          //log: this.log ? new logger('bg service saga', this.log) : undefined,
        })
      );
      // @-#todo_active send saga action for backend data sync
    }
    this.iteration = this.iteration < 2000 ? this.iteration + 1 : 1000;
    this._dispatchBgSagaAction();
  };

  clearInterval = () => {
    if (this.timerFun != undefined) {
      this.log?.print('clearing BGService Interval');
      clearInterval(this.timerFun);
      this.timerFun = undefined;
    }
  };

  _dispatchBgSagaAction = () => {
    reduxStore.store.dispatch(bgServiceSagaAction({ iteration: this.iteration, log: this.log ? new logger('bg service saga', this.log) : undefined }));
  };

  startInterval = () => {
    if (this.timerFun === undefined) {
      this.runner();
      this.log?.print('starting BGService Interval');
      this.timerFun = setInterval(this.runner, this.interval);
    }
  };
}
