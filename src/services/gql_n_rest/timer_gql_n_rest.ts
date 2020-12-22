import { gql, useQuery } from '@apollo/client';
import { myAxios } from './axios';

const gql_createTimerWithDeviceMac = `
mutation(
    $Mac:String!,
    $HR:Int!,
    $MIN:Int!,
    $DT:Int!,
    $ET:Int!,
    $DAYS:Int!,
    $TS:Int!,
    $DST:Int!
    $DBS:Int!,
){
  createTimerWithDeviceMac(
    Mac:$Mac,
    HR:$HR,
    MIN:$MIN,
    DAYS:$DAYS,
    DT:$DT,
    ET:$ET,
    TS:$TS,
    DST:$DST,
    DBS:$DBS
  ){
    createTimer{
      id
      HR
      MIN
      DAYS
      DT
      ET
      ldb{
        id
        TS
        DST
        DBS
      }
    }
    success
  }
}
`;

type createTimerWithDeviceMac_t = (props: {
  data: {
    Mac: string,
    HR: number,
    MIN: number,
    DT: number,
    ET: number,
    DAYS: number,
    TS: number,
    DBS: number,
    DST: number
  },
  timeout?: number
},
  _log: (s: string) => void
) => Promise<undefined>
export const createTimerWithDeviceMac: createTimerWithDeviceMac_t = ({ data: _data, timeout = 5000 }, _log) => {
  const log = (s: string) => { _log && _log("[[ CREATE TIMER MUTATION ]] " + s) }
  log(" data -- " + JSON.stringify(_data))
  return new Promise(async (resolve, reject) => {
    await myAxios
      .post(
        'http://192.168.1.6:4000/backend/admin/api',
        {
          query: gql_createTimerWithDeviceMac,
          variables: _data,
          headers: {
            'Content-Type': 'application/json',
          },
        },
        {
          timeout: timeout,
          withCredentials: true,
        },
      )
      .then(({ data, status }) => {
        if (status == 200) {
          log('create timer mutation response >> ' + JSON.stringify(data));
          if (data?.createTimerWithDeviceMac?.success) {
            log("[[ SUCCESS ]] -> timer created -- " + JSON.stringify(data))
          } else {
            log("[[ FAILED ]] -> timer creation failed -- " + JSON.stringify(data))
          }
        } else {
          log("[[ FAILED ]] -> create timer mutation failed -- " + JSON.stringify(data))
        }
      }).catch((errors) => {
        log('[[ ERR ]] -> create timer mutation error >> ' + JSON.stringify(errors));
      })
  })
}