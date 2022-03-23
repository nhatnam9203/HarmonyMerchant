import { getInfoFromModelNameOfPrinter, PaymentTerminalType } from "@utils";
import React from "react";
import Share from "react-native-share";
import { StarPRNT } from "react-native-star-prnt";
import { releaseCapture } from "react-native-view-shot";
import { useSelector } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import { Platform } from "react-native";
import PrintManager from "@lib/PrintManager";
import { Alert } from "react-native";

export const usePrinter = ({
  viewShotRef,
  printTemp,
  doPrintClover,
  isSignature,
  setIsSignature,
  onCancelPrint,
  onCancelShare,
  fromAppointmentTab,
}) => {
  const { paymentMachineType } = useSelector((state) => state.hardware) ?? {};
  const { profile, printerList, printerSelect } =
    useSelector((state) => state.dataLocal) ?? {};

  const [loading, setLoading] = React.useState(false);
  const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
    printerList,
    printerSelect
  );

  const onCancel = async (temp) => {
    await setLoading(false);
    if (onCancelPrint && typeof onCancelPrint === "function") {
      onCancelPrint(temp ?? printTemp);
    }
  };

  const doPrintAgain = async () => {
    if (paymentMachineType === "Dejavoo") {
      setTimeout(() => {
        setIsSignature(false);
      }, 2000);
    } else {
      setIsSignature(false);
    }
  };

  React.useEffect(() => {
    if (!isSignature && !printTemp && !fromAppointmentTab) {
      printProcess();
    }
  }, [isSignature, printTemp, profile?.isPrintReceipt]);

  const printProcess = async () => {
    try {
      if (!viewShotRef) {
        alert("Error render");
        return;
      } // Không có gì để print

      if (!portName && paymentMachineType === PaymentTerminalType.Pax) {
        alert("Please connect to your printer! ");
        return;
      }

      await setLoading(true);
      const imageUrl = await viewShotRef.current?.captureImageUrl({
        paymentMachineType,
        printerSelect,
      });

      if (imageUrl) {
        if (portName) {
          let commands = [];
          commands.push({ appendLineFeed: 0 });
          commands.push({
            appendBitmap: imageUrl,
            width: parseFloat(widthPaper),
            bothScale: true,
            diffusion: true,
            alignment: "Center",
          });
          commands.push({
            appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed,
          });

          await PrintManager.getInstance().print(emulation, commands, portName);
        }
        // Other devices
        else {
          if (paymentMachineType == "Clover") {
            if (doPrintClover && typeof doPrintClover === "function") {
              doPrintClover(imageUrl);
            }
          } else if (paymentMachineType == "Dejavoo") {
            // const content = getContentXmlReceipt();
            // const params = {
            //   content,
            // };
            // requestPrintDejavoo(params);
          }
        }

        // clear image
        releaseCapture(imageUrl);
      }

      // Print customer receipt
      if (!printTemp && isSignature) {
        if (profile?.isPrintReceipt) {
          doPrintAgain();
        } else {
          Alert.alert(
            "Would you like to print  customer's receipt?",
            "",
            [
              {
                text: "NO",
                onPress: onCancel,
                style: "cancel",
              },
              {
                text: "OK",
                onPress: doPrintAgain,
              },
            ],
            { cancelable: false }
          );
        }
      } else {
        onCancel();
      }
    } catch (error) {
      console.log(`Printer error with ${error}`);
      setLoading(false);
      onCancel();
    }
  };

  const shareProcess = async () => {
    try {
      await setLoading(true);
      const imageUrl = await viewShotRef.current?.captureImageUrl({
        paymentMachineType,
        printerSelect,
      });
      await setLoading(false);

      setTimeout(async () => {
        if (Platform.OS === "ios") {
          RNFetchBlob.ios.previewDocument(imageUrl);
        } else {
          await Share.open({
            url: `file://${imageUri}`,
          });
        }
      }, 250);

      await onCancelShare();
    } catch (error) {
      setLoading(false);
      onCancelShare();
    }
  };

  return {
    processLoading: loading,
    printProcess,
    shareProcess,
  };
};
