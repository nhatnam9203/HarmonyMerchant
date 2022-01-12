import React from "react";
import { QRCodePayButton } from "./Layout";
import { useProps } from "./useProps";
import { PopupScanCode, PopupCardDetail } from "../widget";

export const QRCodePay = ({ appointment }) => {
  const popupScanRef = React.useRef(null);
  const popupCardDetailRef = React.useRef(null);

  const [code, setCode] = React.useState(null);

  const { cardDetail } = useProps({ code });

  const onShowQRCodeScan = () => {
    popupScanRef.current?.show();
  };

  const onResultScanCode = (data) => {
    setCode(data);
    // show loading
  };

  const onPopupCardDetailCancel = () => {
    setCode(null);
  };

  React.useEffect(() => {
    if (cardDetail) {
      setTimeout(() => {
        popupCardDetailRef.current?.show();
      }, 600);
    }
  }, [cardDetail]);

  React.useEffect(() => {
    console.log(appointment);
  }, [appointment]);

  return (
    <>
      <QRCodePayButton onPress={onShowQRCodeScan} />
      <PopupScanCode ref={popupScanRef} onSuccess={onResultScanCode} />
      <PopupCardDetail
        ref={popupCardDetailRef}
        onSuccess={onResultScanCode}
        onCancel={onPopupCardDetailCancel}
        cardDetail={cardDetail}
        appointment={appointment}
      />
    </>
  );
};
