import React from 'react';
export const useProps = (props) => {
  const refDialog = React.createRef(null);
  const payments = ['HarmonyPay', 'Cash', 'Credit Card', 'Check'];
  const [isEnabled, setIsEnabled] = React.useState(true);
  const onValueChange = (value) => {
    console.log(value);
    setIsEnabled(value);
  };
  const openAddNewPayment = () => refDialog.current?.show();
  return { payments, refDialog, openAddNewPayment, onValueChange, isEnabled };
};
