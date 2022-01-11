import React from "react";
import { QRCodePayButton } from "./Layout";
import { useProps } from "./useProps";
import { PopupScanCode, PopupCardDetail } from "../widget";

export const QRCodePay = () => {
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

    // // Test
  };

  React.useEffect(() => {
    if (cardDetail) {
      setTimeout(() => {
        popupCardDetailRef.current?.show();
      }, 600);
    }
  }, [cardDetail]);

  return (
    <>
      <QRCodePayButton onPress={onShowQRCodeScan} />
      <PopupScanCode ref={popupScanRef} onSuccess={onResultScanCode} />
      <PopupCardDetail
        ref={popupCardDetailRef}
        onSuccess={onResultScanCode}
        cardDetail={cardDetail}
      />
    </>
  );
};
