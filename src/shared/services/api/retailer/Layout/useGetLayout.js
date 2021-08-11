import useAxios from 'axios-hooks';
import { RETAILER_LAYOUT } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useGetLayout = () => {
  const dispatch = useDispatch();

  const [{ data: data, loading, error, response }, execute] = useAxios(
    { method: 'GET' },
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
  }, [data?.data, dispatch, loading, response]);

  const getLayout = () => {
    execute({
      url: `${RETAILER_LAYOUT.url}`,
    });
  };

  return [layout, getLayout];
};
