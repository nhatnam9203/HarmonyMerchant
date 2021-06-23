import useAxios from 'axios-hooks';
import { RETAILER_ORDER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useCancelAppointment = () => {
  const dispatch = useDispatch();

  const [{ data: appointmentCancel, loading, error, response }, execute] =
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

  const cancelAppointment = (id) => {
    execute({
      url: `${RETAILER_ORDER.url}/cancel/${id}`,
    });
  };

  return [appointmentCancel, cancelAppointment];
};
