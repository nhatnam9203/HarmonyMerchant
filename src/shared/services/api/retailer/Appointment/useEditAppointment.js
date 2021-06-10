import useAxios from 'axios-hooks';
import { RETAILER_APPOINTMENT } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useEditAppointment = () => {
  const dispatch = useDispatch();

  const [{ data: appointmentEdit, loading, error, response }, execute] =
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
  }, [appointmentEdit?.data, dispatch, loading, response]);

  const editAppointment = (params, id) => {
    execute({
      data: params,
      url: `${RETAILER_APPOINTMENT.url}/${id}`,
    });
  };

  return [appointmentEdit, editAppointment];
};
