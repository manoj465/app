import moment from "moment";





const getCurrentTimeStampInSeconds = () => {
  return Math.floor(Date.now() / 1000);
};

type getTimeDiffNow_type = (timeStamp: number | undefined) => number;
const getTimeDiffNow: getTimeDiffNow_type = (timeStamp) => {
  if (timeStamp) return Math.floor((getCurrentTimeStampInSeconds() - timeStamp) / 1000);
  return 0;
};

type getTimeDiffNowInMs_type = (timeStamp: number | undefined) => number;
const getTimeDiffNowInMs: getTimeDiffNowInMs_type = (timeStamp) => {
  if (timeStamp) return Math.round(Date.now() - timeStamp);
  return 0;
};

export {
  getCurrentTimeStampInSeconds,
  getTimeDiffNow,
  getTimeDiffNowInMs,
};
