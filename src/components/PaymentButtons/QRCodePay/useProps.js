import React from "react";
import {
  checkGiftCardSerialNumber,
  checkConsumerPayToken,
  useAxiosQuery,
} from "@apis";

export const useProps = ({ code }) => {
  const [checkSerialNumberLoading, checkSerialNumber] = useAxiosQuery({
    ...checkGiftCardSerialNumber(code),
    enabled: false,
    onSuccess: (data, response) => {
      console.log(data);
    },
  });

  const [checkConsumerPayTokenLoading, checkPayToken] = useAxiosQuery({
    ...checkConsumerPayToken(code),
    enabled: false,
    onSuccess: (data, response) => {
      console.log(data);
    },
  });

  React.useEffect(() => {
    if (code) {
      checkSerialNumber();
      checkPayToken();
    }
  }, [code]);
  return {
    checkSerialNumber,
    loading: checkSerialNumberLoading || checkConsumerPayTokenLoading,
  };
};
