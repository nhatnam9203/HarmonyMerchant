import useAxios from "axios-hooks";
import { MERCHANT_LOGIN } from "../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useSignIn = () => {
  const dispatch = useDispatch();
  const [{ data: loginData, loading, error, response }, execute] = useAxios(
    MERCHANT_LOGIN,
    {
      manual: true,
    }
  );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideLoading());
    }
  }, [dispatch, loading, response]);

  const merchantLogin = (params) => {
    execute({
      data: params,
    });
  };

  return [loginData, merchantLogin];
};
