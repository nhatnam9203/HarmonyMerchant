import useAxios from 'axios-hooks';
import { RETAILER_APPOINTMENT_CLEAN } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useCleanOrder = () => {
  const dispatch = useDispatch();

  const [{ data: orderClean, loading, error, response }, execute] = useAxios(
    { method: 'PUT',  },
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
  }, [orderClean?.data, dispatch, loading, response]);

  const cleanOrder = (params) => {
    execute({
      data: params,
      url: `${RETAILER_APPOINTMENT_CLEAN.url}`,
    });
  };

  return [orderClean, cleanOrder];
};
