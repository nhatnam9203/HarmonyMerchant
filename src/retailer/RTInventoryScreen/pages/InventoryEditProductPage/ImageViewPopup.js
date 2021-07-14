import IMAGE from "@resources";
import { ButtonGradient } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";

export const ImageViewPopup = React.forwardRef(({ onSetDefaultImage }, ref) => {
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);

  const [image, setImage] = React.useState(null);

  React.useImperativeHandle(ref, () => ({
    showImageItem: (item) => {
      setImage(item);
      dialogRef.current?.show();
    },
  }));

  const onHandleSubmit = () => {
    dialogRef.current?.hide();
    if (onSetDefaultImage && typeof onSetDefaultImage === "function") {
      onSetDefaultImage(image);
    }
  };

  return (
    <View>
      <DialogLayout
        title={t("Image View")}
        ref={dialogRef}
        bottomChildren={() => (
          <View style={styles.bottomStyle}>
            <ButtonGradient
              disable={image?.isDefault}
              label={t("Set Default")}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              onPress={onHandleSubmit}
            />
          </View>
        )}
        style={styles.dialog}
      >
        <View style={styles.container}>
          <FastImage
            source={
              image?.imageUrl
                ? {
                    uri: image?.imageUrl,
                    priority: FastImage.priority.normal,
                  }
                : IMAGE.upload_file_icon
            }
            style={image?.imageUrl ? styles.image : styles.thumb}
            resizeMode="contain"
          />
        </View>
      </DialogLayout>
    </View>
  );
});

const styles = StyleSheet.create({
  dialog: {
    flex: 0,
    width: scaleWidth(520),
  },

  container: {
    justifyContent: "center",
    alignItems: "center",
  },

  marginVertical: {
    height: scaleHeight(16),
  },

  thumb: { width: scaleWidth(48), height: scaleHeight(48) },

  image: { height: scaleHeight(480), width: scaleWidth(480) },
});
