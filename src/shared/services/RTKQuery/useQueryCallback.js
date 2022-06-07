import React from "react";
import * as Utils from "@shared/utils";

const statusCallback = ["pending", "fulfilled"];
export const useQueryCallback = (
  fn,
  onSuccess = () => {},
  onFailed = () => {}
) => {
  if (!fn || typeof fn !== "function") return () => {};
  const [trigger, result] = fn();

  React.useEffect(() => {
    if (!result) return;
    const { data, currentData, isSuccess, error, isError, status } = result;

    if (!statusCallback.includes(status)) return;

    if (isSuccess) {
      const response = data ?? currentData;
      const { codeNumber, codeStatus } = response || {};
      if (Utils.statusSuccess(codeStatus)) {
        // if codeNumber != 200, can alert message or process for case request error
        onSuccess(response);
      } else {
        onFailed(response);
      }
    }

    if (isError) {
      onFailed(error);
    }
  }, [result]);

  return [trigger, result?.isLoading ?? false];
};
