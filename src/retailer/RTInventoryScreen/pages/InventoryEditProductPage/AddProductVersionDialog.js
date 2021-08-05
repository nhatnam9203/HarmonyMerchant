import { ButtonGradient, FormSelect } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { useGetAttributesList } from "@shared/services/api/retailer";
import { colors, fonts, layouts } from "@shared/themes";
import { statusSuccess } from "@shared/utils/app";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { filter } from "rxjs/operators";
import { createProductVersion } from "./ProductState";

const log = (obj, message = "") => {
  Logger.log(`[AddProductVersionDialog] ${message}`, obj);
};

const ItemOptionValues = ({ item, onSelectOptionValue }) => {
  const formSelectRef = React.useRef(null);

  const onChangeValue = (val) => {
    const temp = item?.values?.find((v) => v.id === val);
    onSelectOptionValue(temp);
  };

  // let defaultValue = item?.values?.length > 0 ? item?.values[0].value : null;

  React.useEffect(() => {
    if (item) {
      formSelectRef.current?.setFilterItems(
        item?.values
          ?.filter((x) => x.checked)
          .map((x, index) => ({
            id: x.id,
            label: x.label,
            value: x.id,
            position: index,
          }))
      );
    }
  }, [item?.values]);

  return (
    <View style={styles.item} key={item?.id + ""}>
      <FormSelect
        filterRef={formSelectRef}
        required={false}
        label={item?.label}
        filterItems={item?.values}
        defaultValue={null}
        onChangeValue={onChangeValue}
      />
    </View>
  );
};

export const AddProductVersionDialog = ({
  renderButton,
  dispatchProduct,
  options,
}) => {
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);
  const [selectedItems, setSelectedItems] = React.useState([]);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  // const [attributesList, getAttributesList] = useGetAttributesList();

  // // chỗ này parent sẽ gọi
  // React.useEffect(() => {
  //   const { codeStatus, data } = attributesList || {};
  //   if (statusSuccess(codeStatus)) {
  //     setOptions(
  //       attributesList?.data
  //         ?.filter(
  //           (v) =>
  //             defaultOptionsId?.findIndex((x) => x.attributeId === v.id) < 0
  //         )
  //         .map((x) => Object.assign({}, x, { attributeId: x.id, id: 0 })) // cái này lấy từ attribute list về
  //     );
  //   }
  // }, [attributesList]);

  const onShowDialog = () => {
    setSelectedItems([]);

    dialogRef.current?.show();
  };

  const onHandleApplyButtonPress = () => {
    dialogRef.current?.hide();
    dispatchProduct(createProductVersion(selectedItems));
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

  const selectOptionValue = (val) => {
    // !! neu tao moi product  thi cho nay ko dung id dc
    const selectOption = options?.find((v) => v.id === val.optionId);
    const existIndx = selectedItems?.findIndex((x) => x.id === val.id);

    if (existIndx >= 0) {
      let clones = [...selectedItems];
      clones[existIndx] = val;
      setSelectedItems(clones);
    } else {
      let clones = [...selectedItems];
      clones.push(val);
      setSelectedItems(clones.sort((a, b) => a.position - b.position));
    }
  };

  const onRenderItem = ({ item, index }) => {
    const onSelectOptionValue = (optValue) => {
      selectOptionValue(
        Object.assign({}, optValue, { position: index, optionId: item.id })
      );
    };

    return (
      <ItemOptionValues
        item={item}
        key={item.id + ""}
        onSelectOptionValue={onSelectOptionValue}
      />
    );
  };

  const onRenderFooterComponent = () => {
    return <View style={styles.itemSeparator} />;
  };

  return (
    <View>
      {renderButton && renderButton(onShowDialog)}
      <DialogLayout
        title={t("Manual Generate")}
        ref={dialogRef}
        bottomChildren={() => (
          <View style={styles.bottomStyle}>
            <ButtonGradient
              label={t("Generate")}
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
            {t("Select options attribute and value")}
          </Text>

          <FlatList
            style={styles.list}
            data={options}
            bounces={false}
            renderItem={onRenderItem}
            keyExtractor={(item) => item?.id + ""}
            ListHeaderComponent={() => <View style={styles.itemSeparator} />}
            ListFooterComponent={onRenderFooterComponent}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            ListEmptyComponent={() => <View></View>}
            // refreshControl={
            //   <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            // }
            // onEndReachedThreshold={0.1}
            // onEndReached={onHandleLoadMore}
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
    // height: scaleHeight(48),
    backgroundColor: colors.WHITE,
    paddingHorizontal: scaleWidth(30),
  },

  itemSeparator: {
    // backgroundColor: "#dddddd",
    height: scaleHeight(8),
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
