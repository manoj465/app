import { logger } from '../../../@logger';
import { axiosBaseErrors_e, baseError } from '../../baseErrors';
import { defaultRequest } from '../../baseRequest';

export enum authApiErrors_e {
  AUTH_API_UNHANDLED = 'AUTH_API_UNHANDLED',
}

export interface authApiErrors_i {
  testError?: any;
}

interface authApiRes_i {
  Mac: string;
  Hostname: string;
  state: string;
}

export interface authApiReturnType {
  RES?: authApiRes_i;
  ERR?: baseError<authApiErrors_i, authApiErrors_e | axiosBaseErrors_e>;
}

/**
 * @description
 */
interface authApiProps_i {
  IP: string;
  log?: logger;
}
type fun_t = (props: authApiProps_i) => Promise<authApiReturnType>;

export const v1: fun_t = async ({ IP, log, ...props }: authApiProps_i) => {
  var queryResponse = await defaultRequest<authApiRes_i, authApiErrors_i, authApiReturnType>({
    method: 'get',
    address: 'http://' + IP,
    path: '/auth',
    resolveData: ({ RES, ERR }) => {
      log?.print('---- resolve Data' + JSON.stringify(RES));
      log?.print('---- resolve Data' + JSON.stringify(ERR));
      if (ERR) {
        log?.print('auth api ERR - resolve Data' + JSON.stringify(ERR, null, 2));
        return { ERR };
      } else {
        log?.print('auth api RES - resolve Data ' + IP + ' ' + JSON.stringify(RES, null, 2));
        return { RES: { Mac: RES?.Mac ? RES.Mac : '', Hostname: RES?.Hostname ? RES.Hostname : '', state: '' } };
      }
    },
    log: log ? new logger('base request', log) : undefined,
  })
    .then((res) => res)
    .catch((err) => err);
  return queryResponse;
};
