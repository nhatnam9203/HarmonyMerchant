import useAxios from 'axios-hooks';
import { RETAILER_ORDER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useConfirmAppointment = () => {
  const dispatch = useDispatch();

  const [{ data: appointmentConfirm, loading, error, response }, execute] =
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

  const confirmAppointment = (params, id) => {
    execute({
      data: params,
      url: `${RETAILER_ORDER.url}/confirm/${id}`,
    });
  };

  return [appointmentConfirm, confirmAppointment];
};
