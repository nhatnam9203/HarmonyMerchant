import useAxios from 'axios-hooks';
import { RETAILER_ATTRIBUTES } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useGetAttributesList = () => {
  const dispatch = useDispatch();

  const [{ data: attributesList, loading, error, response }, execute] =
    useAxios(
      { method: 'GET', url: `${RETAILER_ATTRIBUTES.url}/search` },
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
  }, [attributesList?.data, dispatch, loading, response]);

  const getAttributesList = (params) => {
    execute({
      params: params,
    });
  };

  return [attributesList, getAttributesList];
};
