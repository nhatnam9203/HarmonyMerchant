import IMAGE from "@resources";
import { colors, fonts, layouts } from "@shared/themes";
import { gotoSettingsDevice } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { launchImageLibrary } from "react-native-image-picker";
import { useUploadFile } from "../services/api/app/useUploadFile";
import * as Progress from "react-native-progress";

export const FormUploadImage = ({
  required,
  placeholder,
  label,
  style,
  image,
  onSetFileId,
  defaultValue,
  resetWhenDone = false,
}) => {
  const [t] = useTranslation();
  const [progress, setProgress] = React.useState(0);
  const [{ uploadData, uploadLoading }, uploadFile] = useUploadFile(
    ({ loaded = 0, total = 1 }) => {
      const progress = loaded / total;
      setProgress(progress);
    }
  );
  const [photo, setPhoto] = React.useState(null);

  const onHandleImagePicker = ({
    errorMessage,
    errorCode,
    didCancel,
    uri, // v 3.8.1
    fileName, // v 3.8.1
    type, // v 3.8.1
  }) => {
    if (errorCode) {
      switch (errorCode) {
        case "camera_unavailable":
          break;
        case "permission":
          gotoSettingsDevice();
          break;
        case "others":
          break;
        default:
          break;
      }

      if (errorMessage) {
        alert(errorMessage);
        return;
      }
    }

    if (uri && fileName) {
      // upload image here
      const images = [
        {
          uri,
          fileName: fileName?.replace(/.heic|.HEIC/gi, ".JPG"),
          type,
        },
      ];

      setPhoto({ url: uri });
      uploadFile(images);
    }
  };

  const showImagePicker = () => {
    if (photo) {
      return;
    }
    try {
      launchImageLibrary(
        {
          quality: 0.2,
        },
        onHandleImagePicker
      );
    } catch (error) {
      alert(error);
    }
  };

  const onRemovePhoto = () => {
    setPhoto(null);
  };

  React.useEffect(() => {
    if (uploadData?.data && onSetFileId && typeof onSetFileId === "function") {
      onSetFileId(uploadData?.data?.fileId, uploadData?.data?.url);
      setProgress(0);
    }

    if (resetWhenDone) {
      setPhoto(null);
    } else {
      setPhoto(uploadData?.data);
    }
  }, [uploadData]);

  React.useEffect(() => {
    if (defaultValue) setPhoto({ url: defaultValue });
  }, [defaultValue]);

  return (
    <View style={[styles.container, style]}>
      {!!label && (
        <Text style={styles.textStyle}>
          {label}
          {required && <Text style={styles.requiredStyle}> *</Text>}
        </Text>
      )}
      <View style={layouts.marginVertical} />
      <View style={styles.content}>
        <View style={styles.imageContent}>
          <TouchableOpacity
            style={[layouts.fill, layouts.center]}
            onPress={showImagePicker}
          >
            <FastImage
              source={
                photo?.url
                  ? {
                      uri: photo?.url,
                      priority: FastImage.priority.normal,
                    }
                  : IMAGE.upload_file_icon
              }
              style={photo?.url ? styles.image : styles.thumb}
              resizeMode="contain"
            />

            {!photo?.url && (
              <Text style={styles.label}>{t("Upload image")}</Text>
            )}

            {photo?.url && !uploadLoading && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={onRemovePhoto}
              >
                <Image source={IMAGE.DeleteOutline} style={styles.deleteIcon} />
              </TouchableOpacity>
            )}

            {uploadLoading && (
              <ActivityIndicator
                style={styles.loadingIndicator}
                size="large"
                color="#4CD964"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {uploadLoading && (
        <Progress.Bar
          progress={progress}
          width={scaleWidth(120)}
          height={scaleHeight(6)}
          borderRadius={scaleHeight(3)}
          color="#4CD964"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleHeight(8),
  },

  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: scaleHeight(4),
  },

  textStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  imageContent: {
    height: scaleHeight(120),
    width: scaleWidth(120),
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: scaleWidth(3),
  },

  requiredStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.ORANGEY_RED,
  },

  thumb: { width: scaleWidth(48), height: scaleHeight(48) },

  image: { height: scaleHeight(120), width: scaleWidth(120) },

  label: {
    fontFamily: fonts.LIGHT,
    fontSize: scaleWidth(17),
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.GREYISH_BROWN,
  },

  deleteButton: {
    position: "absolute",
    right: 0,
    top: 0,
    width: scaleWidth(28),
    height: scaleHeight(28),
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: scaleWidth(13),
    backgroundColor: "#fff2",
  },

  deleteIcon: {
    width: scaleWidth(24),
    height: scaleHeight(24),
    tintColor: "#6A6A6A",
  },

  loadingIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
