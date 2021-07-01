import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { colors, fonts, layouts } from "@shared/themes";
import IMAGE from "@resources";
import { useTranslation } from "react-i18next";
import { DropdownMenu } from "./DropdownMenu";
import { ButtonFilter } from "./ButtonFilter";

const ITEMS_COUNTER = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 30, label: "30" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

export const Pagination = ({
  onChangePage,
  onChangeItemsPerPage,
  visibleItemsPerPage = false,
  defaultPage = 1,
  pages = 0,
  count = 0,
  length = 0,
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = React.useState(defaultPage);

  const onHandleNextPage = () => {
    const next = currentPage + 1;
    setCurrentPage(next);
    if (onChangePage && typeof onChangePage === "function") {
      onChangePage(next);
    }
  };

  const onHandlePreviousPage = () => {
    const previous = currentPage - 1;
    setCurrentPage(previous);
    if (onChangePage && typeof onChangePage === "function") {
      onChangePage(previous);
    }
  };

  const onHandleChangeItemPerPage = (item) => {
    if (onChangeItemsPerPage && typeof onChangeItemsPerPage === "function") {
      onChangeItemsPerPage(item.value);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textItemStyle}>{`${t("Page")}:`}</Text>
      <View style={styles.marginHorizontal} />
      <Pressable
        style={[
          styles.content,
          styles.button,
          currentPage <= 1 && { opacity: 0.5 },
        ]}
        onPress={onHandlePreviousPage}
        disabled={currentPage <= 1}
      >
        <Image
          source={IMAGE.Report_Dropdown_Arrow}
          style={[styles.imageStyle, { transform: [{ rotate: "90deg" }] }]}
        />
      </Pressable>
      <View style={styles.marginHorizontal} />
      <View style={styles.content}>
        <Text style={styles.textStyle}>{`${currentPage}/${pages}`}</Text>
      </View>
      <View style={styles.marginHorizontal} />
      <Pressable
        style={[
          styles.content,
          styles.button,
          currentPage >= pages && { opacity: 0.5 },
        ]}
        onPress={onHandleNextPage}
        disabled={currentPage >= pages}
      >
        <Image
          source={IMAGE.Report_Dropdown_Arrow}
          style={[styles.imageStyle, { transform: [{ rotate: "-90deg" }] }]}
        />
      </Pressable>
      <View style={styles.marginHorizontal} />
      <Text style={styles.textItemStyle}>{`${t(
        "Items"
      )} ${1} - ${length} of ${count}`}</Text>
      <View style={styles.marginHorizontal} />
      {visibleItemsPerPage && (
        <>
          <Text style={styles.textItemStyle}>{`| Items per page`}</Text>
          <View style={styles.marginHorizontal} />
          <DropdownMenu
            items={ITEMS_COUNTER}
            defaultIndex={0}
            onChangeValue={onHandleChangeItemPerPage}
            width={scaleWidth(80)}
            height={scaleHeight(32)}
          />
          {/* <ButtonFilter
        filterItems={ITEMS_COUNTER}
        defaultValue={10}
        onChangeValue={(item) => {}}
        width={scaleWidth(80)}
        height={scaleHeight(32)}
      /> */}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    height: scaleHeight(32),
  },

  content: {
    borderRadius: scaleWidth(1),
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderWidth: scaleWidth(1),
    borderColor: "#ccc",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scaleWidth(8),
  },

  button: {
    width: scaleWidth(32),
    height: scaleHeight(32),
  },

  imageStyle: {
    width: scaleWidth(25),
    height: scaleHeight(15),
    resizeMode: "center",
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.BROWNISH_GREY,
  },

  textItemStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(15),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.BROWNISH_GREY,
  },

  marginHorizontal: {
    width: scaleWidth(10),
  },
});
