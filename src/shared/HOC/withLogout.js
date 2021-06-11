import React, { Component } from "react";
import actions from "@redux/actions";
import { useDispatch } from "react-redux";

export const WithLogout = (WrappedComponent) => {
  return function WithLogoutComponent(props) {
    const dispatch = useDispatch();

    const singOutSubmit = () => {
      dispatch(actions?.auth?.requestLogout());
    };

    return <WrappedComponent {...props} confimYes={singOutSubmit} />;
  };
};
