import useAxios from 'axios-hooks';
import { GET_ADDRESS_STATE } from '../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useGetAddressStates = () => {
  const dispatch = useDispatch();

  const [{ data: addressStates, loading, error, response }, execute] = useAxios(
    GET_ADDRESS_STATE,
    {
      manual: true,
    },
  );

  React.useEffect(() => {
    if (loading) {
      // dispatch(appMerchant.showLoading());
    }
    if (!loading && response) {
      // dispatch(appMerchant.hideLoading());

      dispatch({ type: 'GET_STATE_CITY_SUCCESS', payload: addressStates.data });
    }
  }, [dispatch, loading, response]);

  const getAddressStates = (params) => {
    execute({
      params: params,
    });
  };

  return [addressStates, getAddressStates];
};
