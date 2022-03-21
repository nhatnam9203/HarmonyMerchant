import { getInfoFromModelNameOfPrinter } from "@utils";
import React from "react";
import Share from "react-native-share";
import { StarPRNT } from "react-native-star-prnt";
import { releaseCapture } from "react-native-view-shot";
import { useSelector } from "react-redux";

export const usePrinter = ({
  viewShotRef,
  printTemp,
  doPrintClover,
  isSignature,
  setIsSignature,
  onCancelPrint,
}) => {
  const { paymentMachineType } = useSelector((state) => state.hardware) ?? {};
  const { profile, printerList, printerSelect } =
    useSelector((state) => state.dataLocal) ?? {};

  const [loading, setLoading] = React.useState(false);
  const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
    printerList,
    printerSelect
  );

  const onCancel = (temp) => {
    if (onCancelPrint && typeof onCancelPrint === "function") {
      onCancelPrint(temp ?? printTemp);
    }
  };

  const createCommands = (imageUrl) => {
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

    return commands;
  };

  const doPrintAgain = async () => {
    if (paymentMachineType === "Dejavoo") {
      setTimeout(() => {
        setIsSignature(false);
      }, 2000);
    } else {
      setTimeout(() => {
        setIsSignature(false);
      }, 500);
    }
  };

  const printProcess = async () => {
    try {
      if (!viewShotRef) return; // Không có gì để print

      await setLoading(false);
      const imageUrl = await captureImageUrl({
        paymentMachineType,
        printerSelect,
      });

      if (imageUrl) {
        if (portName) {
          const commands = createCommands(imageUrl);
          await PrintManager.getInstance().print(emulation, commands, portName);
        }
        // Other devices
        else {
          if (paymentMachineType == "Clover") {
            if (doPrintClover && typeof doPrintClover === "function") {
              doPrintClover(imageUri);
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
        releaseCapture(imageUri);
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
                text: "Cancel",
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
      alert(`Printer error with ${error}`);
      onCancel();
    }
  };

  const onShareProcess = async () => {
    try {
      await setLoading(true);
      const imageUrl = await captureImageUrl({
        paymentMachineType,
        printerSelect,
      });
      await setLoading(false);

      if (Platform.OS === "ios") {
        setTimeout(() => {
          RNFetchBlob.ios.previewDocument(imageUrl);
        }, 500);
      } else {
        await Share.open({
          url: `file://${imageUri}`,
        });
      }
    } catch (error) {
      console.log(error);
      await setVisible(false);
    }
  };

  return {
    processLoading: loading,
    printProcess,
    onShareProcess,
    onShareProcess,
  };
};
