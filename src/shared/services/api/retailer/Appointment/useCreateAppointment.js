import useAxios from 'axios-hooks';
import { RETAILER_ORDER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useCreateAppointment = () => {
  const dispatch = useDispatch();

  const [{ data: appointmentCreate, loading, error, response }, execute] =
    useAxios(
      { method: 'POST' },
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
  }, [appointmentCreate?.data, dispatch, loading, response]);

  const createAppointment = (id) => {
    execute({
      url: `${RETAILER_ORDER.url}/create/${id}`,
    });
  };

  return [appointmentCreate, createAppointment];
};
