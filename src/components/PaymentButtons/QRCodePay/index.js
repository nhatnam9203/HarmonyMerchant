import React from "react";
import { QRCodePayButton } from "./Layout";
import { useProps } from "./useProps";
import { PopupScanCode, PopupCardDetail } from "../widget";
import { PAYMENT_METHOD, getPaymentString } from "../utils";

export const QRCodePay = ({ appointment, onPaidAppointment }) => {
  const popupScanRef = React.useRef(null);
  const popupCardDetailRef = React.useRef(null);

  const [code, setCode] = React.useState(null);
  const [paymentInfo, setPaymentInfo] = React.useState(null);

  const { cardDetail } = useProps({ code, paymentInfo, onPaidAppointment });

  const onShowQRCodeScan = () => {
    popupScanRef.current?.show();
  };

  const onResultScanCode = (data) => {
    // setCode("1012012720125122");
    setCode(data);
    // show loading
  };

  const onPopupCardDetailCancel = () => {
    setCode(null);
  };

  const onPayAppointment = (payModel) => {
    if (appointment?.checkoutGroupId) {
      setPaymentInfo({
        checkoutGroupId: appointment?.checkoutGroupId,
        // amount: amount,
        method: getPaymentString(cardDetail?.cardType),
        giftCardId: cardDetail?.giftCardId ?? 0,
        ...payModel,
      });
    }
  };

  React.useEffect(() => {
    if (cardDetail) {
      setTimeout(() => {
        popupCardDetailRef.current?.show();
      }, 600);
    }
  }, [cardDetail]);

  // React.useEffect(() => {
  //   // console.log(appointment);
  // }, [appointment]);

  return (
    <>
      <QRCodePayButton onPress={onShowQRCodeScan} />
      <PopupScanCode ref={popupScanRef} onSuccess={onResultScanCode} />
      <PopupCardDetail
        ref={popupCardDetailRef}
        onSubmit={onPayAppointment}
        onCancel={onPopupCardDetailCancel}
        cardDetail={cardDetail}
        appointment={appointment}
      />
    </>
  );
};
