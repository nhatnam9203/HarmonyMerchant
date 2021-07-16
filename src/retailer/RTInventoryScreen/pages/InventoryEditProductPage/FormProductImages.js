import IMAGE from "@resources";
import { FormUploadImage } from "@shared/components";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { ImageViewPopup } from "./ImageViewPopup";

export const FormProductImages = ({
  images,
  label,
  onChangeValue,
  defaultImage,
  style,
  required = false,
}) => {
  const [imgArray, setImgArray] = React.useState([]);
  const dialogRef = React.useRef(null);

  React.useEffect(() => {
    setImgArray(images?.sort((a, b) => a.position - b.position));
  }, [images]);

  React.useEffect(() => {
    if (onChangeValue && typeof onChangeValue === "function") {
      onChangeValue(imgArray);
    }
  }, [imgArray]);

  const onHandleSetDefaultImage = (img) => {
    if (img)
      setImgArray(
        imgArray?.map((x) =>
          Object.assign({}, x, { isDefault: x?.fileId === img.fileId })
        )
      );

  };

  const onRenderItem = ({ item }) => {
    const onRemovePhoto = () => {
      if (item?.isDefault) {
        setImgArray(
          imgArray
            ?.filter((v) => v.fileId !== item.fileId)
            .map((x, idx) => Object.assign({}, x, { isDefault: idx === 0 }))
        );
      } else {
        setImgArray(imgArray?.filter((x) => x.fileId !== item.fileId));
      }
    };

    const onHandleShowImage = () => {
      dialogRef.current?.showImageItem(item);
    };

    return (
      <View style={styles.imageContent} key={item?.fileId + ""}>
        <TouchableOpacity
          style={[layouts.fill, layouts.center]}
          onPress={onHandleShowImage}
        >
          <FastImage
            source={
              item?.imageUrl
                ? {
                    uri: item?.imageUrl,
                    priority: FastImage.priority.normal,
                  }
                : IMAGE.upload_file_icon
            }
            style={item?.imageUrl ? styles.image : styles.thumb}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.deleteButton} onPress={onRemovePhoto}>
            <Image source={IMAGE.DeleteOutline} style={styles.deleteIcon} />
          </TouchableOpacity>

          {item?.isDefault && (
            <Image
              source={IMAGE.ImageDefault}
              style={styles.imageDefault}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderButtonUploadImage = () => (
    <FormUploadImage
      onSetFileId={(fileId, photoUrl) => {
        if (imgArray?.length > 0)
          setImgArray([
            ...imgArray,
            {
              id: 0,
              fileId: fileId,
              isDefault: imgArray?.length <= 0,
              position: imgArray?.length ?? 0,
              imageUrl: photoUrl,
            },
          ]);
        else
          setImgArray([
            {
              id: 0,
              fileId: fileId,
              isDefault: imgArray?.length <= 0,
              position: imgArray?.length ?? 0,
              imageUrl: photoUrl,
            },
          ]);
      }}
      defaultImage={defaultImage}
      resetWhenDone={true}
      multiSelect={true}
    />
  );

  return (
    <View style={[styles.container, style]}>
      {!!label && (
        <Text style={styles.textStyle}>
          {label}
          {required && <Text style={styles.requiredStyle}> *</Text>}
        </Text>
      )}
      <View style={styles.content}>
        {imgArray?.length > 0 && (
          <FlatList
            style={styles.flatList}
            data={imgArray}
            renderItem={onRenderItem}
            keyExtractor={(item, index) => item?.fileId + ""}
            horizontal
            ItemSeparatorComponent={() => (
              <View style={layouts.marginHorizontal} />
            )}
          />
        )}
        {renderButtonUploadImage()}
      </View>

      <ImageViewPopup
        ref={dialogRef}
        onSetDefaultImage={onHandleSetDefaultImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleHeight(8),
  },

  content: {
    justifyContent: "space-between",
    paddingVertical: scaleHeight(10),
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
    right: -scaleWidth(10),
    top: -scaleHeight(10),
    width: scaleWidth(32),
    height: scaleHeight(32),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scaleWidth(16),
    backgroundColor: colors.WHITE_FA,
  },

  deleteIcon: {
    width: scaleWidth(22),
    height: scaleHeight(22),
    tintColor: colors.GREYISH_BROWN,
  },

  loadingIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  flatList: {
    height: scaleHeight(140),
    width: "100%",
    paddingVertical: scaleHeight(10),
  },

  imageDefault: {
    width: scaleWidth(26),
    height: scaleHeight(26),
    // tintColor: colors.OCEAN_BLUE,
    position: "absolute",
    bottom: scaleHeight(1),
    left: scaleWidth(1),
  },
});
