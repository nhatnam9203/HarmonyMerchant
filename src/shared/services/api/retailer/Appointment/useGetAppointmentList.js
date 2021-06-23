import useAxios from 'axios-hooks';
import { RETAILER_APPOINTMENT } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useGetAppointmentList = () => {
  const dispatch = useDispatch();

  const [{ data: appointmentList, loading, error, response }, execute] =
    useAxios(
      { method: 'GET', url: `${RETAILER_APPOINTMENT.url}/search` },
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
  }, [appointmentList?.data, dispatch, loading, response]);

  const getAppointmentList = (params) => {
    execute({
      params: params,
    });
  };

  return [appointmentList, getAppointmentList];
};
