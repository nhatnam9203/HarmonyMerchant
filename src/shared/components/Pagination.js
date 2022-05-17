import IMAGE from "@resources";
import { colors, fonts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { DropdownMenu } from "./DropdownMenu";

const ITEMS_COUNTER = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 30, label: "30" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

const DEFAULT_ITEMS_PER_PAGE = 20;

export const Pagination = ({
  onChangePage,
  onChangeItemsPerPage,
  visibleItemsPerPage = false,
  defaultPage = 1,
  defaultItemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  pages = 0,
  count = 0,
  length = 0,
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = React.useState(defaultPage);
  const [itemsPerPage, setItemsPerPage] = React.useState(defaultItemsPerPage);

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
    setItemsPerPage(item.value);
    if (onChangeItemsPerPage && typeof onChangeItemsPerPage === "function") {
      onChangeItemsPerPage(item.value);
    }
  };

  React.useEffect(() => {
    if (defaultItemsPerPage) {
      // !! tim index của value ròi set defaultIndex
    }
  }, [defaultItemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
    if (onChangePage && typeof onChangePage === "function") {
      onChangePage(1);
    }
  }, [pages, count]);

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
      <Text style={styles.textItemStyle}>{`${t("Item")} ${
        (currentPage - 1) * itemsPerPage + 1
      } - ${(currentPage - 1) * itemsPerPage + length} of ${count}`}</Text>
      <View style={styles.marginHorizontal} />
      {visibleItemsPerPage && (
        <>
          <Text style={styles.textItemStyle}>{`| Items per page`}</Text>
          <View style={styles.marginHorizontal} />
          <DropdownMenu
            items={ITEMS_COUNTER}
            defaultIndex={1}
            onChangeValue={onHandleChangeItemPerPage}
            width={scaleWidth(80)}
            height={scaleHeight(32)}
          />
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
