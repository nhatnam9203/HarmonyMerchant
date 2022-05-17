import useAxios from "axios-hooks";
import { appMerchant } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useGetInvoiceDetail = () => {
  const dispatch = useDispatch();

  const [{ data: invoiceDetailData, loading, response }, execute] = useAxios(
    { method: "GET" },
    {
      manual: true,
    }
  );


  const getInvoiceDetail = (checkoutId) => {
    execute({
      url: `checkout/${checkoutId}`,
    });
  };

  return [invoiceDetailData, getInvoiceDetail];
};
