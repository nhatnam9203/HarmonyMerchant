import IMAGE from "@resources";
import {
  CustomCheckBox,
  DialogColorPicker,
  FormUploadImage
} from "@shared/components";
import { CustomInput } from "@shared/components/CustomInput";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import {
  useCreateAttributes,
  useEditAttributes,
  useGetAttributes
} from "@shared/services/api/retailer";
import { colors, fonts, layouts } from "@shared/themes";
import { INPUT_TYPE, statusSuccess } from "@shared/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { removeOption, updateOption } from "./ProductState";

const log = (obj, message = "") => {
  Logger.log(`[FormProductOption] ${message}`, obj);
};

export const FormProductOption = React.forwardRef(
  ({ item, dispatchProduct }, ref) => {
    const [t] = useTranslation();

    /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
    // new
    const [attributes, createAttributes] = useCreateAttributes();
    // edit
    const [attributeEdit, editAttributes] = useEditAttributes();
    const [attributesGet, getAttributes] = useGetAttributes();

    /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */

    React.useImperativeHandle(ref, () => ({}));

    React.useEffect(() => {
      if (!attributesGet) {
        return;
      }

      const { codeStatus, message, data } = attributesGet || {};
      if (statusSuccess(codeStatus)) {
        let optionItem = item;
        const options = data?.values?.map((v) =>
          Object.assign({}, v, {
            attributeValueId: v.id,
            id: 0,
            checked: false,
          })
        );

        optionItem["inputType"] = data?.inputType;
        optionItem["updateProductImage"] = data?.updateProductImage;
        optionItem["attributeId"] = data?.id;

        if (item) {
          let values = options?.map((v) => {
            const existItem = optionItem?.values?.find(
              (x) => x.attributeValueId === v.attributeValueId
            );

            if (existItem) {
              return Object.assign({}, existItem, {
                ...v,
                checked: true,
              });
            } else {
              return v;
            }
          });

          optionItem["values"] = values;
        } else {
          optionItem["values"] = options;
        }

        dispatchProduct(updateOption(optionItem));
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attributesGet]);

    React.useEffect(() => {
      if (item?.attributeId && !attributesGet?.data) {
        getAttributes(item.attributeId);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const onUpdate = React.useCallback(() => {
    //   if (onUpdateOptionValues && typeof onUpdateOptionValues === "function") {
    //     onUpdateOptionValues(item);
    //   }
    // }, [item]);

    // React.useEffect(() => {
    //   onUpdate();
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [item]);

    const updateAttributes = (attributes) => {
      // update lai thu tu options
    };

    const onRemoveOptionsPress = () => {
      dispatchProduct(removeOption(item));
    };

    const getHeaderKeys = () => {
      return item?.inputType === INPUT_TYPE.VISUAL_SWATCH
        ? {
            active: t("Active"),
            value: t("Swatch"),
            label: t("Value Label"),
            valueAdd: t("Value Add"),
          }
        : {
            active: t("Active"),
            label: t("Value Label"),
            valueAdd: t("Value Add"),
          };
    };

    const getTableKeys = () => {
      return item?.inputType === INPUT_TYPE.VISUAL_SWATCH
        ? ["active", "value", "label", "valueAdd"]
        : ["active", "label", "valueAdd"];
    };

    const onRenderTableCell = ({
      item: cellItem,
      columnKey,
      rowIndex,
      cellWidth,
    }) => {
      if (columnKey === "active") {
        const setToggleCheckBox = (val) => {
          const updatesSelectOptions = item.values?.map((v) => {
            if (v?.attributeValueId === cellItem?.attributeValueId) {
              return Object.assign({}, v, { checked: val });
            } else {
              return v;
            }
          });

          dispatchProduct(
            updateOption(
              Object.assign({}, item, { values: updatesSelectOptions })
            )
          );
        };
        return (
          <View
            style={[{ width: cellWidth }, layouts.center]}
            key={getUniqueId(columnKey, rowIndex, "cell-checkbox")}
          >
            <CustomCheckBox
              defaultValue={cellItem?.checked}
              onValueChange={setToggleCheckBox}
              selectedColor={colors.OCEAN_BLUE}
              onCheckColor="#fff"
            />
          </View>
        );
      }

      if (columnKey === "label") {
        const onHandleChange = (text) => {};
        return (
          <View
            style={{ width: cellWidth }}
            key={getUniqueId(columnKey, rowIndex, "cell-label")}
          >
            <CustomInput
              style={[styles.customInput, { width: scaleWidth(230) }]}
              textInputProps={{
                placeholder: "Label",
                fontSize: scaleFont(17),
                textAlign: "left",
                defaultValue: cellItem?.label,
                onChangeText: onHandleChange,
                editable: false,
              }}
            />
          </View>
        );
      }

      if (columnKey === "value") {
        const onHandleUpdateSwatch = (color) => {};
        return (
          <View
            style={{ width: cellWidth }}
            key={getUniqueId(columnKey, rowIndex, "cell-value")}
          >
            <DialogColorPicker
              onApplyColor={onHandleUpdateSwatch}
              defaultValue={cellItem?.value}
              disabled={true}
            />
          </View>
        );
      }

      if (columnKey === "valueAdd") {
        const onHandleChange = async (text) => {
          const values = item.values?.map((v) => {
            if (v.attributeValueId === cellItem.attributeValueId) {
              return Object.assign({}, v, { valueAdd: parseFloat(text, 2) });
            } else {
              return v;
            }
          });

          dispatchProduct(
            updateOption(Object.assign({}, item, { values: values }))
          );
        };

        return (
          <View
            style={{ width: cellWidth }}
            key={getUniqueId(columnKey, rowIndex, "cell-value-add")}
          >
            <CustomInput
              style={[styles.customInput, { width: scaleWidth(230) }]}
              textInputProps={{
                placeholder: "Label",
                fontSize: scaleFont(17),
                textAlign: "left",
                defaultValue: cellItem?.valueAdd,
                onChangeText: onHandleChange,
              }}
            />
          </View>
        );
      }
      return null;
    };

    const onRenderOptionsImage = ({ item: cellItem }) => {
      const onChangeFile = async (fileId) => {
        if (fileId) {
          let values = item.values?.map((v) => {
            if (v.attributeValueId === cellItem.attributeValueId) {
              return Object.assign({}, v, { fileId: fileId });
            } else {
              return v;
            }
          });

          dispatchProduct(
            updateOption(Object.assign({}, item, { values: values }))
          );
        }
      };
      return (
        <FormUploadImage
          style={styles.optionImage}
          label={cellItem?.label}
          onSetFileId={onChangeFile}
          defaultValue={cellItem?.imageUrl}
        />
      );
    };

    return (
      <View style={styles.container}>
        <InfoHeading label={item?.label}>
          <TouchableOpacity onPress={onRemoveOptionsPress}>
            <Image
              style={{
                width: scaleWidth(22),
                height: scaleHeight(22),
              }}
              source={IMAGE.remove_color_row}
            />
          </TouchableOpacity>
        </InfoHeading>
        <View style={styles.content}>
          {item?.values?.length > 0 && (
            <Table
              items={item?.values}
              headerKeyLabels={getHeaderKeys()}
              whiteListKeys={getTableKeys()}
              primaryKey="attributeValueId"
              // unitKeys={{ totalDuration: "hrs" }}
              widthForKeys={{
                active: scaleWidth(100),
                value: "10%",
                label: "45%",
              }}
              emptyDescription={t("No Values")}
              renderCell={onRenderTableCell}
              onRowPress={() => {}}
              draggable={true}
              setItems={updateAttributes}
            />
          )}
        </View>
        {item?.updateProductImage && (
          <View>
            <InfoHeading label={t("Option Image")} fontSize={scaleWidth(17)} />

            <View style={styles.content}>
              <FlatList
                style={styles.flatList}
                numColumns={10}
                data={item?.values}
                renderItem={onRenderOptionsImage}
                keyExtractor={(v) => v?.id}
                contentContainerStyle={styles.flatListContainer}
                // ListHeaderComponent={() => <View style={styles.itemSeparator} />}
                // ListFooterComponent={() => <View style={styles.itemSeparator} />}
                ItemSeparatorComponent={() => (
                  <View style={styles.itemSeparator} />
                )}
                // ListEmptyComponent={() => (
                //   <EmptyList description={emptyDescription} />
                // )}
                // refreshControl={
                //   <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                // }
              />
            </View>
          </View>
        )}
      </View>
    );
  }
);

let InfoHeading = ({ label, children, fontSize }) => {
  return (
    <View style={styles.infoLineContent}>
      {!!label && (
        <Text style={[styles.infoHeaderText, fontSize && { fontSize }]}>
          {label}
        </Text>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleHeight(8),
  },

  content: {
    flex: 1,
  },

  infoHeaderText: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(20),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
    marginRight: scaleWidth(10),
  },

  infoLineContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: scaleHeight(7),
  },

  flatList: {
    width: "100%",
    height: scaleHeight(200),
  },

  flatListContainer: {
    justifyContent: "flex-start",
    flexDirection: "row",
    // flexWrap: 'wrap',
  },

  itemSeparator: {
    width: scaleWidth(5),
  },

  optionImage: {
    marginHorizontal: scaleWidth(15),
  },
});
