import { axios } from "@shared/services/api/axiosClientReport";
import { appMerchant as app } from "@src/redux/slices";
import React from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";

export const useAxiosMutationReport = ({
  params,
  onSuccess,
  onLoginError,
  isLoadingDefault = true,
  isStopLoading = false,
  isReturnError = true,
}) => {
  const dispatch = useDispatch();

  const postRequest = async (body = null) => {
    const response = body ? await axios(body) : await axios(params);
    return response?.data;
  };

  const { mutate, isLoading, isError, data } = useMutation(
    async (body) => await postRequest(body),
    {
      onSuccess: (response) => {
        dispatch(app.hideLoading());

        onSuccess(response?.data, response);
      },
      onError: (err) => {
        console.log("/** Mutate Error Message */");
        console.log(err);
        console.log("/** ----------*---------- */");

        dispatch(app.hideLoading());
      },
    } // disable fetch auto
  );

  React.useEffect(() => {
    if (!isLoadingDefault) {
      return;
    }

    if (isLoading) {
      // show app loading hereF

      dispatch(app.showLoading());
    }

    if (!isLoading && !isStopLoading) {
      // hide app loading here
      dispatch(app.hideLoading());
    }
  }, [data, dispatch, isLoading, isLoadingDefault, isError]);

  return [{ isLoading, data }, mutate];
};
