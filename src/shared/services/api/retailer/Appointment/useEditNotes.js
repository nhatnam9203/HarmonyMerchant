import useAxios from 'axios-hooks';
import { RETAILER_APPOINTMENT } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useEditNotes = () => {
  const dispatch = useDispatch();

  const [{ data: notesEdit, loading, error, response }, execute] = useAxios(
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

  const editNotes = (params, id) => {
    execute({
      data: params,
      url: `${RETAILER_APPOINTMENT.url}/note/${id}`,
    });
  };

  return [notesEdit, editNotes];
};
