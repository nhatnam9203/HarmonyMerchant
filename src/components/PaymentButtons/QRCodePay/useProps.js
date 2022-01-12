import React from "react";
import {
  checkGiftCardSerialNumber,
  checkConsumerPayToken,
  selectPaymentMethod,
  checkoutSubmit,
  submitConsumerPayment,
  useAxiosQuery,
  useAxiosMutation,
} from "@apis";
import { useDispatch } from "react-redux";
import actions from "@actions";
import { formatNumberFromCurrency } from "@utils";

export const CardType = {
  GIFT_CARD: "GiftCard",
  CUSTOMER_CARD: "HarmonyPay",
};

export const useProps = ({ code, paymentInfo, onSubmit }) => {
  const dispatch = useDispatch();

  const [cardDetail, setCardDetail] = React.useState(null);
  const [cardType, setCardType] = React.useState(null);
  const [scanCode, setScanCode] = React.useState(null);
  const [checkOutSubmitId, setCheckOutSubmitId] = React.useState(null);

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
          giftCardId: data.giftCardId,
        });

        setCardType(CardType.GIFT_CARD);
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
          userCardId: data.userCardId,
        });

        setCardType(CardType.CUSTOMER_CARD);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const getSubmitFunction = () => {
    console.log(cardType);
    console.log(code);

    if (cardType === CardType.CUSTOMER_CARD)
      return submitConsumerPayment(checkOutSubmitId, scanCode);
    return checkoutSubmit(checkOutSubmitId);
  };

  const [, paymentSubmit] = useAxiosMutation({
    ...getSubmitFunction(),
    onSuccess: (data, response) => {
      console.log(data);
      // TODO: ??? need recode
      if (data?.checkoutPaymentResponse) {
        let { dueAmount = 0 } = data?.checkoutPaymentResponse;

        dueAmount = formatNumberFromCurrency(dueAmount);
        dispatch(
          actions.appointment.updatePaymentInfoByHarmonyPayment(
            data?.checkoutPaymentResponse
          )
        );
        resetAll();
        if (dueAmount == 0) {
          // ----- Transaction Completed --------
          dispatch(actions.appointment.completeTransaction());
        } else if (dueAmount < 0) {
          dispatch(actions.appointment.showPopupChangeMoney(dueAmount));
        } else {
          dispatch(actions.appointment.showPopupPaymentDetails());
        }
      }
    },
  });

  const [, selectPayment] = useAxiosMutation({
    ...selectPaymentMethod(paymentInfo?.checkoutGroupId, paymentInfo),
    onSuccess: (data, response) => {
      console.log(data);
      if (response?.codeNumber === 400) {
        alert(response?.message);
        //TODO: !!! hide dialog, close payment
        return;
      }

      if (data) {
        setCheckOutSubmitId(data);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const resetAll = () => {
    setCardDetail(null);
    setScanCode(null);
  };

  React.useEffect(() => {
    if (code) {
      checkSerialNumber();
      checkPayToken();
      setScanCode(code);
    } else {
      setCardDetail(null);
    }
  }, [code]);

  React.useEffect(() => {
    if (paymentInfo) {
      selectPayment();
    } else {
    }
  }, [paymentInfo]);

  React.useEffect(() => {
    if (checkOutSubmitId) {
      paymentSubmit();
    }
  }, [checkOutSubmitId]);

  return {
    loading: checkSerialNumberLoading || checkConsumerPayTokenLoading,
    cardDetail,
    checkSerialNumber,
  };
};
