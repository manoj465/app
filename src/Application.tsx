import React from 'react';
import reduxStore from './redux';
import MainRouter from './routers/MainRouter';

interface App_i {}
const Application = ({}: App_i) => {
  /* const initialScreen = reduxStore.store.getState().appCTXReducer.user?.email
    ? reduxStore.store.getState().deviceReducer.deviceList?.length ? "dashboard" : "pairing"
    : "onboarding"; */
  //const initialScreen = reduxStore.store.getState().deviceReducer.deviceList?.length ? "dashboard" : "pairing"
  const initialScreen = reduxStore.store.getState().deviceReducer.deviceList.length
    ? 'dashboard'
    : reduxStore.store.getState().appCTXReducer.user?.email
    ? 'dashboard'
    : 'login_signup';

  return (
    <MainRouter
      //initialScreen={"pairing"}
      initialScreen={initialScreen}
    />
  );
};

export default Application;
