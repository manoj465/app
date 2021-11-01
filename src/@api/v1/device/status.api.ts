import { logger } from '../../../@logger';
import { axiosBaseErrors_e, baseError } from '../../baseErrors';
import { defaultRequest } from '../../baseRequest';

export enum statusApiErrors_e {
  STATUS_API_UNHANDLED = 'STATUS_API_UNHANDLED',
}

export interface statusApiErrors_i {}

interface statusApiRes_i {
  Mac: string;
  Hostname: string;
  PAIR_STATUS: string;
  WIFI_STATUS: string;
  firmwareVersion?: number;
}

export interface statusApiReturnType {
  RES?: statusApiRes_i;
  ERR?: baseError<statusApiErrors_i, statusApiErrors_e | axiosBaseErrors_e>;
}

/**
 * @description
 */
interface statusApiProps_i {
  IP: string;
  log?: logger;
}
type fun_t = (props: statusApiProps_i) => Promise<statusApiReturnType>;

export const v1: fun_t = async ({ IP, log, ...props }: statusApiProps_i) => {
  var queryResponse = await defaultRequest<statusApiRes_i, statusApiErrors_i, statusApiReturnType>({
    method: 'get',
    address: 'http://' + IP,
    path: '/status',
    resolveData: ({ RES, ERR }) => {
      log?.print('status api resolve Data' + JSON.stringify(RES, null, 2));
      if (ERR) {
        log?.print('ERR - resolve Data' + JSON.stringify(ERR, null, 2));
      }
      if (RES) {
        log?.print('RES - resolve Data ' + IP + ' ' + JSON.stringify(RES, null, 2));
        return { RES };
      }
      return { ERR: { errCode: statusApiErrors_e.STATUS_API_UNHANDLED } };
    },
    log: log ? new logger('base request', log) : undefined,
  })
    .then((res) => res)
    .catch((err) => err);
  return queryResponse;
};
