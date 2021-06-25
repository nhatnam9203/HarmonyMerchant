import useAxios from 'axios-hooks';
import { RETAILER_APPOINTMENT_REPORT } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useExportCustomer = () => {
  const dispatch = useDispatch();

  const [{ data: customerExport, loading, error, response }, execute] =
    useAxios(
      { method: 'GET' },
      {
        manual: true,
      }
    );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showExportLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideExportLoading());
    }
  }, [dispatch, loading, response]);

  const ExportCustomer = (params) => {
    execute({
      params: params,
      url: `${RETAILER_APPOINTMENT_REPORT.url}/customerSales/export`,
    });
  };

  return [customerExport, ExportCustomer];
};
