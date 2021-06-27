import useAxios from 'axios-hooks';
import { RETAILER_REPORT_PRODUCT } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useExportSaleByProduct = () => {
  const dispatch = useDispatch();

  const [{ data: saleByProductExport, loading, error, response }, execute] =
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
  }, [saleByProductExport?.data, dispatch, loading, response]);

  const ExportSaleByProduct = (params) => {
    execute({
      params: params,
      url: `${RETAILER_REPORT_PRODUCT.url}/saleByProduct/export`,
    });
  };

  return [saleByProductExport, ExportSaleByProduct];
};
