import useAxios from 'axios-hooks';
import { RETAILER_ORDER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useCreateAppointmentTemp = () => {
  const dispatch = useDispatch();

  const [{ data: appointmentTempCreate, loading, error, response }, execute] =
    useAxios(
      { method: 'POST', url: `${RETAILER_ORDER.url}/temp` },
      {
        manual: true,
      },
    );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideLoading());
    }
  }, [appointmentTempCreate?.data, dispatch, loading, response]);

  const createAppointmentTemp = (params) => {
    execute({
      data: params,
    });
  };

  return [appointmentTempCreate, createAppointmentTemp];
};
