import useAxios from 'axios-hooks';
import { RETAILER_APPOINTMENT } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useDeleteAppointment = (onCallback) => {
  const dispatch = useDispatch();

  const [{ data: appointmentDelete, loading, error, response }, execute] = useAxios(
    { method: 'DELETE' },
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
      if (onCallback && typeof onCallback === 'function') {
        onCallback();
      }
    }
  }, [ dispatch, loading, response]);

  const deleteAppointment = (appointmentId) => {
    execute({
      url: `${RETAILER_APPOINTMENT.url}/${appointmentId}`,
    });
  };

  return [appointmentDelete, deleteAppointment];
};
