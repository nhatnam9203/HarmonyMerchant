import { axios } from "@shared/services/api/axiosClient";
import { appMerchant as app } from "@src/redux/slices";
import React from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";

let cancelToken;

export const useHarmonyQuery = ({
  onSuccess,
  onError,
  onLoginError,
  isLoadingDefault = true,
  isStopLoading = false,
  enabled = false,
  isCancelToken = false,
  queryKey,
}) => {
  const dispatch = useDispatch();
  const [queryData, setQueryData] = React.useState(null);

  const requestGetByAxios = async () => {
    const response = await axios(queryData?.params);
    return response?.data;
  };

  const { refetch, status, isError, isFetching, data } = useQuery(
    [queryKey ?? queryData?.queryId],
    requestGetByAxios,
    {
      enabled,
      retry: false,
      onSuccess: (response) => {
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(response);
        }
      },
      onError: (err) => {
        if (onError && typeof onError === "function") {
          onError(err);
        }
      },
    } // disable fetch auto
  );

  const callRequest = (args) => {
    setQueryData(args);
  };

  React.useEffect(() => {
    if (queryData) {
      refetch();
    }
  }, [queryData]);

  return [{ isLoading: isFetching, data }, callRequest];
};
