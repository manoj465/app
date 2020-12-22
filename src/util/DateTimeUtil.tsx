import moment from "moment";

const addTimeIntoTimeStamp = (timeStamp, addTime, timeUnit, timeFormat) => {
  let dateFormat = "DD/MM/YYYY HH:mm:ss",
    tmUnit = timeUnit ? timeUnit : "seconds",
    addTm = addTime ? addTime : 5;
  let date = cnvrtTmStmpToDtTm(timeStamp, dateFormat);
  let addedDtTm = moment(date, dateFormat)
    .add(addTm, tmUnit)
    .format(dateFormat);
  let resultDtTm = null;
  if (timeFormat) {
    resultDtTm = moment(addedDtTm, dateFormat).format(timeFormat);
  } else {
    resultDtTm = moment(addedDtTm, dateFormat).unix();
  }
  return resultDtTm;
};

const cnvrtTmStmpToDtTm = (timeStamp, dtTmFormat) => {
  let dateFormat = dtTmFormat ? dtTmFormat : "MM/DD/YYYY HH:mm:ss";
  let dateString = null;
  if (timeStamp) {
    let dt = new Date(timeStamp);
    dateString = moment(dt).format(dateFormat);
  } else {
    dateString = moment().format(dateFormat);
  }
  return dateString;
};

const getCurrentTimeStamp = () => {
  let timestamp = new Date().getTime();
  return timestamp;
};
const getTimeDiff = (timeStamp2, timeStamp1) => {
  if (timeStamp2 && timeStamp1)
    return Math.round((timeStamp2 - timeStamp1) / 1000);
  return null;
};

type getTimeDiffNow_type = (timeStamp: number | undefined) => number;
const getTimeDiffNow: getTimeDiffNow_type = (timeStamp) => {
  if (timeStamp) return Math.round((getCurrentTimeStamp() - timeStamp) / 1000);
  return 0;
};

type getTimeDiffNowInMs_type = (timeStamp: number | undefined) => number;
const getTimeDiffNowInMs: getTimeDiffNowInMs_type = (timeStamp) => {
  if (timeStamp) return Math.round(getCurrentTimeStamp() - timeStamp);
  return 0;
};

export {
  cnvrtTmStmpToDtTm,
  addTimeIntoTimeStamp,
  getCurrentTimeStamp,
  getTimeDiff,
  getTimeDiffNow,
  getTimeDiffNowInMs,
};
