import useAxios from 'axios-hooks';
import { RETAILER_ORDER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useShippingAppointment = () => {
  const dispatch = useDispatch();

  const [{ data: appointmentShipping, loading, error, response }, execute] =
    useAxios(
      { method: 'PUT' },
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
  }, [dispatch, loading, response]);

  const shippingAppointment = (id) => {
    execute({
      url: `${RETAILER_ORDER.url}/shipping/${id}`,
    });
  };

  return [appointmentShipping, shippingAppointment];
};
