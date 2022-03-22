import { useAxiosReport } from "@shared/services/api/useAxiosReport";
import { RETAILER_CUSTOMER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useExportCustomer = () => {
  const dispatch = useDispatch();

  const [{ data: customerExport, loading, error, response }, execute] =
  useAxiosReport(
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
      url: `${RETAILER_CUSTOMER.url}/export`,
    });
  };

  return [customerExport, ExportCustomer];
};
