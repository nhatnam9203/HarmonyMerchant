import useAxios from 'axios-hooks';
import { RETAILER_ATTRIBUTES } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useGetAttributes = () => {
  const dispatch = useDispatch();

  const [{ data: attributes, loading, error, response }, execute] = useAxios(
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
  }, [attributes?.data, dispatch, loading, response]);

  const getAttributes = (attributesId) => {
    execute({
      url: `${RETAILER_ATTRIBUTES.url}/${attributesId}`,
    });
  };

  return [attributes, getAttributes];
};
