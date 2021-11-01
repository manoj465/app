import { logger } from '../../../../@logger';
import { serverURL } from '../../../baseAxios';
import { axiosBaseErrors_e, baseError } from '../../../baseErrors';
import { defaultRequest } from '../../../baseRequest';

enum resetPassApiErrors_e {
  RESET_PASS_API_UNHANDLED = 'RST_PASS_UNHANDLED',
  RESET_PASS_API_UNKNOWN_ID = 'RST_PASS_UNKN_ID',
}

interface resetPassApiErrors_i {
  testError?: any;
}

interface resetPassApiRes_i {
  Mac: string;
  Hostname: string;
  state: string;
}

interface resetPassApiReturnType {
  RES?: resetPassApiRes_i;
  ERR?: baseError<resetPassApiErrors_i, resetPassApiErrors_e | axiosBaseErrors_e>;
}

/**
 * @description
 */
interface authApiProps_i {
  log?: logger;
}
type fun_t = (props: authApiProps_i) => Promise<resetPassApiReturnType>;

export const v1: fun_t = async ({ log, ...props }: authApiProps_i) => {
  var queryResponse = await defaultRequest<resetPassApiRes_i, resetPassApiErrors_i, resetPassApiReturnType>({
    method: 'post',
    address: serverURL,
    path: '/user/reset_password',
    body: { email: 'testmail@huelite.in' },
    resolveData: ({ RES, ERR }) => {
      log?.print('---- resolve Data' + JSON.stringify(RES));
      log?.print('---- resolve Data' + JSON.stringify(ERR));
      if (ERR) {
        log?.print('resetPass api ERR - resolve Data' + JSON.stringify(ERR, null, 2));
        return { ERR };
      } else {
        log?.print('resetPass api RES - resolve Data ' + JSON.stringify(RES, null, 2));
        return { RES };
      }
    },
    log: log ? new logger('resetPass -- ', log) : undefined,
  })
    .then((res) => res)
    .catch((err) => err);
  return queryResponse;
};
