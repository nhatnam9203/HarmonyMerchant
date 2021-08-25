import useAxios from "axios-hooks";
import { RETAILER_ORDER } from "../../route";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";
import _ from "lodash";

export const useReturnAppointment = () => {
  const dispatch = useDispatch();

  const [{ data: appointmentReturn, loading, error, response }, execute] =
    useAxios(
      { method: "PUT" },
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

      if(_.get(response, 'data.codeNumber') != 200){
        alert(_.get(response, 'data.message'))
      }
    }
  }, [dispatch, loading, response]);

  const returnAppointment = (id, params) => {
    execute({
      url: `${RETAILER_ORDER.url}/return/${id}`,
      data: params,
    });
  };

  return [appointmentReturn, returnAppointment];
};
