import React from "react";
import {
  checkGiftCardSerialNumber,
  checkConsumerPayToken,
  useAxiosQuery,
} from "@apis";

export const CardType = {
  GIFT_CARD: "GiftCard",
  CUSTOMER_CARD: "HarmonyPay",
};

export const useProps = ({ code }) => {
  const [cardDetail, setCardDetail] = React.useState(null);

  const [checkSerialNumberLoading, checkSerialNumber] = useAxiosQuery({
    ...checkGiftCardSerialNumber(code),
    enabled: false,
    onSuccess: (data, response) => {
      console.log(data);
      if (data) {
        setCardDetail({
          cardType: CardType.GIFT_CARD,
          amount: data.amount,
          name: `#${data.serialNumber}`,
          id: data.giftCardId,
        });
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const [checkConsumerPayTokenLoading, checkPayToken] = useAxiosQuery({
    ...checkConsumerPayToken(code),
    enabled: false,
    onSuccess: (data, response) => {
      console.log(data);
      if (data) {
        setCardDetail({
          cardType: CardType.CUSTOMER_CARD,
          amount: data.amount,
          name: data.userName,
          id: data.userCardId,
        });
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  React.useEffect(() => {
    if (code) {
      checkSerialNumber();
      checkPayToken();
    }
  }, [code]);
  return {
    loading: checkSerialNumberLoading || checkConsumerPayTokenLoading,
    cardDetail,
    checkSerialNumber,
  };
};
