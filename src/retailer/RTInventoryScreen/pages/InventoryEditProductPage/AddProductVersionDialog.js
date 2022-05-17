import { ButtonGradient, FormSelect } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { useGetAttributesList } from "@shared/services/api/retailer";
import { colors, fonts, layouts } from "@shared/themes";
import { statusSuccess } from "@shared/utils/app";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { filter } from "rxjs/operators";
import { createProductVersion, checkProductVersion } from "./ProductState";

const log = (obj, message = "") => {
  Logger.log(`[AddProductVersionDialog] ${message}`, obj);
};

const ItemOptionValues = ({ item, onSelectOptionValue }) => {
  const formSelectRef = React.useRef(null);

  const onChangeValue = (val) => {
    const temp = item?.values?.find((v) => v.attributeValueId === val);
    onSelectOptionValue(temp);
  };

  // let defaultValue = item?.values?.length > 0 ? item?.values[0].value : null;

  React.useEffect(() => {
    if (item) {
      // console.log(item);
      formSelectRef.current?.setFilterItems(
        item?.values
          ?.filter((x) => x.checked)
          .map((x, index) => ({
            id: x.id,
            label: x.label,
            value: x.attributeValueId,
            position: index,
          }))
      );
    }
  }, [item?.values]);

  return (
    <View style={styles.item}>
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
  isExistItem,
}) => {
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);
  const [selectedItems, setSelectedItems] = React.useState([]);
  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */

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
    // const selectOption = options?.find((v) => v.id === val.optionId);
    const existIndx = selectedItems?.findIndex(
      (x) => x.attributeId === val.attributeId
    );
    let clones = [...selectedItems];

    if (existIndx >= 0) {
      clones[existIndx] = val;
      setSelectedItems(clones);
    } else {
      clones.push(val);
      setSelectedItems(clones.sort((a, b) => a.position - b.position));
    }

    dispatchProduct(checkProductVersion(clones));
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
        key={item.label}
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
              disable={selectedItems?.length !== options?.length}
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
            keyExtractor={(item) => item?.label}
            ListHeaderComponent={() => <View style={styles.itemSeparator} />}
            ListFooterComponent={onRenderFooterComponent}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            ListEmptyComponent={() => <View></View>}
          />
          {isExistItem && (
            <Text
              style={[
                styles.itemText,
                { color: "orange", textAlign: "center" },
              ]}
            >
              {t(" Item is existed ")}
            </Text>
          )}
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
    maxHeight: scaleHeight(400),
    minHeight: scaleHeight(100),
    width: "100%",
    marginVertical: scaleHeight(20),
  },

  item: {
    width: scaleWidth(440),
    backgroundColor: colors.WHITE,
    paddingHorizontal: scaleWidth(30),
  },

  itemSeparator: {
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
