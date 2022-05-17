import IMAGE from "@resources";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import ColorPicker from "react-native-wheel-color-picker";
import { ButtonGradient } from "./Button";

export const DialogColorPicker = React.forwardRef(
  ({ onApplyColor, defaultValue = "#ffffff", disabled }, ref) => {
    const [t] = useTranslation();
    const pickerRef = React.useRef(null);
    const [currentColor, setCurrentColor] = React.useState();

    const [open, setOpen] = React.useState(false);
    const hideModal = () => {
      setOpen(false);
    };

    const showModal = () => {
      if (disabled) return;
      setOpen(true);
    };

    const onHandleApplyButtonPress = () => {
      hideModal();
      if (onApplyColor && typeof onApplyColor === "function") {
        onApplyColor(currentColor);
      }
    };

    const onColorChange = (color) => {
      setCurrentColor(color);
    };

    const onColorChangeComplete = (color) => {
      setCurrentColor(color);
    };

    React.useEffect(() => {
      if (defaultValue) setCurrentColor(defaultValue);
    }, [defaultValue]);

    React.useImperativeHandle(ref, () => ({
      show: () => {
        setOpen(true);
      },
    }));

    return (
      <View>
        <TouchableOpacity style={styles.buttonSelectPicker} onPress={showModal}>
          <View style={[styles.colorView, { backgroundColor: defaultValue }]} />
        </TouchableOpacity>

        <Modal
          style={styles.modal}
          isVisible={open}
          onRequestClose={hideModal}
          backdropTransitionOutTiming={0}
          backdropTransitionInTiming={0}
          animationIn="zoomIn"
          animationOut="zoomOut"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={[layouts.fill, styles.txtTitle]}>
                {t("Color Picker")}
              </Text>
              <TouchableOpacity style={styles.buttonClose} onPress={hideModal}>
                <Image
                  source={IMAGE.closePopup}
                  style={styles.iconButtonClose}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <View style={layouts.marginVertical} />
              <ColorPicker
                ref={pickerRef}
                color={currentColor}
                onColorChange={onColorChange}
                onColorChangeComplete={onColorChangeComplete}
                thumbSize={scaleWidth(40)}
                sliderSize={scaleHeight(20)}
                noSnap={true}
                row={false}
                discrete={true}
              />
              <View style={layouts.marginVertical} />
              <View style={layouts.marginVertical} />

              <View style={styles.swatchesContent}>
                <Text style={styles.swatchText}>
                  {currentColor?.toUpperCase()}
                </Text>
              </View>
              <View style={layouts.marginVertical} />

              <View style={styles.bottomStyle}>
                <ButtonGradient
                  label={t("Apply")}
                  width={scaleWidth(140)}
                  height={scaleHeight(40)}
                  borderRadius={scaleWidth(3)}
                  onPress={onHandleApplyButtonPress}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: scaleWidth(480),
    borderRadius: scaleHeight(20),
    shadowColor: "#004080bf",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
  },

  content: {
    flex: 0,
    width: "100%",
    paddingHorizontal: scaleWidth(20),
    height: scaleHeight(420),
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    backgroundColor: "#40404030",
    margin: 0,
  },

  header: {
    height: scaleWidth(48),
    width: "100%",
    backgroundColor: colors.OCEAN_BLUE,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderTopLeftRadius: scaleHeight(20),
    borderTopRightRadius: scaleHeight(20),
  },

  txtTitle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(23),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.WHITE,
  },

  buttonClose: {
    width: scaleWidth(28),
    height: scaleHeight(28),
    borderRadius: scaleWidth(14),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginRight: scaleWidth(10),
  },

  iconButtonClose: {
    width: scaleWidth(14),
    height: scaleHeight(14),
  },

  titleContent: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.GREYISH_BROWN,
  },

  bottomStyle: {
    width: "100%",
    height: scaleHeight(80),
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  buttonSelectPicker: {
    width: scaleWidth(40),
    height: scaleHeight(40),
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc",
    justifyContent: "center",
    alignItems: "center",
  },

  colorView: {
    width: scaleWidth(32),
    height: scaleHeight(32),
    backgroundColor: "#fff",
  },

  swatchesContent: {
    width: scaleWidth(160),
    height: scaleHeight(46),
    borderRadius: 3,
    backgroundColor: colors.WHITE_FA,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc",
    justifyContent: "center",
    alignItems: "center",
  },

  swatchText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(20),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.GREYISH_BROWN,
  },
});
