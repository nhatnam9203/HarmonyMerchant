import { ButtonGradient, CustomCheckBox } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { useGetAttributesList } from "@shared/services/api/retailer";
import { colors, fonts, layouts } from "@shared/themes";
import { statusSuccess } from "@shared/utils/app";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { addOption } from "./ProductState";

const log = (obj, message = "") => {
  Logger.log(`[AddProductOptionDialog] ${message}`, obj);
};

export const AddProductOptionDialog = ({
  renderButton,
  defaultOptionsId = [],
  dispatchProduct,
}) => {
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);
  const [items, setItems] = React.useState(null);
  const [options, setOptions] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [pagination, setPagination] = React.useState({
    pages: 0,
    count: 0,
  });
  const [isLoadMore, setIsLoadMore] = React.useState(false);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [attributesList, getAttributesList] = useGetAttributesList();
  const callGetAttributesList = React.useCallback(() => {
    getAttributesList({
      page: page,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  React.useEffect(() => {
    callGetAttributesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // chỗ này parent sẽ gọi
  React.useEffect(() => {
    setIsLoadMore(false);

    const { codeStatus, data, pages = 0, count = 0 } = attributesList || {};
    if (statusSuccess(codeStatus)) {
      setPagination({
        pages,
        count,
      });

      if (page > 1 && page <= pages && options) {
        setOptions(
          options.concat(
            data
              ?.filter(
                (v) =>
                  defaultOptionsId?.findIndex((x) => x.attributeId === v.id) < 0
              )
              .map((x) => Object.assign({}, x, { attributeId: x.id, id: 0 }))
          )
        );
      } else {
        setOptions(
          data
            ?.filter(
              (v) =>
                defaultOptionsId?.findIndex((x) => x.attributeId === v.id) < 0
            )
            .map((x) => Object.assign({}, x, { attributeId: x.id, id: 0 }))
        );
      }
    }
  }, [attributesList]);

  const onShowDialog = () => {
    setItems(null);

    // getAttributesList();
    setPage(1);
    dialogRef.current?.show();
  };

  const onHandleApplyButtonPress = () => {
    dialogRef.current?.hide();
    dispatchProduct(addOption(items));
  };

  const onSelectAttributed = (item, selected) => {
    const cloneList =
      items?.filter((v) => v.attributeId !== item.attributeId) || [];
    if (selected) {
      setItems([...cloneList, item]);
    } else {
      setItems(cloneList);
    }
  };

  const onRenderItem = ({ item }) => {
    const setToggleCheckBox = (val) => {
      onSelectAttributed(item, val);
    };
    return (
      <View style={[layouts.horizontal, styles.item]} key={item?.attributeId}>
        <Text style={styles.itemText}>{item?.label}</Text>
        <CustomCheckBox
          value={item?.checked}
          onValueChange={setToggleCheckBox}
        />
      </View>
    );
  };

  const onRenderFooterComponent = () => {
    return <View style={styles.itemSeparator} />;
  };

  const onHandleLoadMore = () => {
    if (page < pagination?.pages) {
      setIsLoadMore(true);
      setPage((prev) => prev + 1);
    }
  };

  return (
    <View>
      {renderButton && renderButton(onShowDialog)}
      <DialogLayout
        title={t("Add attribute")}
        ref={dialogRef}
        bottomChildren={() => (
          <View style={styles.bottomStyle}>
            <ButtonGradient
              label={t("Add selected")}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              onPress={onHandleApplyButtonPress}
            />
          </View>
        )}
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            {t("Select customize options attribute")}
          </Text>

          <FlatList
            style={styles.list}
            data={options}
            renderItem={onRenderItem}
            keyExtractor={(item) => item?.attributeId}
            ListHeaderComponent={() => <View style={styles.itemSeparator} />}
            ListFooterComponent={onRenderFooterComponent}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            ListEmptyComponent={() => <View></View>}
            onEndReachedThreshold={0.1}
            onEndReached={onHandleLoadMore}
          />
        </View>
      </DialogLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
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

  title: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  list: {
    // height: scaleHeight(400),
    maxHeight: scaleHeight(400),
    minHeight: scaleHeight(100),
    width: "100%",
    marginVertical: scaleHeight(20),
  },

  item: {
    width: scaleWidth(440),
    height: scaleHeight(48),
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderRightWidth: scaleWidth(1),
    borderLeftWidth: scaleWidth(1),
    borderColor: "#dddddd",
    alignItems: "center",
    paddingHorizontal: scaleWidth(16),
    justifyContent: "space-between",
  },

  itemSeparator: {
    backgroundColor: "#dddddd",
    height: scaleHeight(1),
  },

  itemText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },
});
