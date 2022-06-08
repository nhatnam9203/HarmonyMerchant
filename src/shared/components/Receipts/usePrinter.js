import {
  getInfoFromModelNameOfPrinter,
  PaymentTerminalType,
  requestPrintDejavoo,
  checkNotSelectedPrinter
} from "@utils";
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
  viewShotCustomerRef,
  printTemp,
  doPrintClover,
  isSignature,
  setIsSignature,
  onCancelPrint,
  onCancelShare,
  fromAppointmentTab,
  getContentXmlReceipt,
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

  const doPrintAgain = async (imageUrl) => {
    if (paymentMachineType === "Dejavoo" && !printerSelect) {
      setTimeout(() => {
        setIsSignature(false);
        printImageUrl(imageUrl);
      }, 2000);
    } else {
        setIsSignature(false);
        printImageUrl(imageUrl);
    }
    onCancel();
  };

  React.useEffect(() => {
    if (!isSignature && !printTemp && !fromAppointmentTab) {
      printProcess();
    }
  }, [printTemp, profile?.isPrintReceipt]);

  const printImageUrl = async (imageUrl) => {
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
        const content = getContentXmlReceipt();
        const params = {
          content,
        };
        requestPrintDejavoo(params);
      }
    }
    releaseCapture(imageUrl);

  }

  const printProcess = async () => {
    console.log("printProcess")
    try {
      if (!viewShotRef) {
        alert("Error render");
        return;
      } // nothing to print

      if (checkNotSelectedPrinter()) {
        alert("Please connect to your printer! ");
        return;
      }

      await setLoading(true);

      const imageUrl = await viewShotRef.current?.captureImageUrl({
        paymentMachineType,
        printerSelect,
      });

      const imageCustomerUrl = await viewShotCustomerRef.current?.captureImageUrl({
        paymentMachineType,
        printerSelect,
      });

      if (imageUrl) {
        printImageUrl(imageUrl);
      }

      // Print customer receipt
      if (!printTemp && isSignature) {
        if (profile?.isPrintReceipt) {
          doPrintAgain(imageCustomerUrl);
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
                onPress: () => doPrintAgain(imageCustomerUrl),
              },
            ],
            { cancelable: false }
          );
        }
      } else {
        onCancel();
      }
    } catch (error) {
      setLoading(false);
      onCancel();
    }
  };

  const shareProcess = async () => {
    try {
      await setLoading(true);
      // var startTime = performance.now();

      const imageUrl = await viewShotRef.current?.captureImageUrl({
        paymentMachineType,
        printerSelect,
        quality: 0.1,
      });

      onCancelShare();

      setTimeout(async () => {
        await setLoading(false);

        if (Platform.OS === "ios") {
          RNFetchBlob.ios.previewDocument(imageUrl);
        } else {
          await Share.open({
            url: `file://${imageUri}`,
          });
        }
      }, 500);
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
