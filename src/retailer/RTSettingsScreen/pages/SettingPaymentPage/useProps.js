import React from 'react';
export const useProps = (props) => {
  const refDialog = React.createRef(null);
  const payments = ['HarmonyPay', 'Cash', 'Credit Card', 'Check'];

  const openAddNewPayment = () => refDialog.current?.show();
  return { payments, refDialog, openAddNewPayment };
};
