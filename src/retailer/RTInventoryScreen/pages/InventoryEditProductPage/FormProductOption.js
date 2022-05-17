import IMAGE from "@resources";
import {
  CustomCheckBox,
  DialogColorPicker,
  FormUploadImage,
} from "@shared/components";
import { CustomInput, CustomInputMask } from "@shared/components/CustomInput";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import {
  useCreateAttributes,
  useEditAttributes,
  useGetAttributes,
} from "@shared/services/api/retailer";
import { colors, fonts, layouts } from "@shared/themes";
import { INPUT_TYPE, statusSuccess } from "@shared/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { changeOption, removeOption, updateOption } from "./ProductState";
import { useIsWareHouse } from "@shared/hooks";

const log = (obj, message = "") => {
  Logger.log(`[FormProductOption] ${message}`, obj);
};

export const FormProductOption = React.forwardRef(
  ({ item, dispatchProduct }, ref) => {
    const [t] = useTranslation();
    const { isWareHouse } = useIsWareHouse();
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
        let optionItem = item || {};
        const options = data?.values?.map((v) =>
          Object.assign({}, v, {
            attributeValueId: v.id,
            id: 0,
            checked: true,
          })
        );

        optionItem["inputType"] = data?.inputType;
        optionItem["updateProductImage"] = data?.updateProductImage;
        optionItem["attributeId"] = data?.id;

        if (item?.values?.length > 0) {
          let values = options?.map((v) => {
            const existItem = item?.values?.find(
              (x) => x.attributeValueId === v.attributeValueId
            );

            if (existItem) {
              return Object.assign({}, v, existItem); // lấy thông từ tồn tại item làm thông tin chính
            } else {
              return Object.assign({}, v, { checked: false });
            }
          });
          optionItem["values"] = values;
          dispatchProduct(updateOption(optionItem));
        } else if (item?.values?.length === 0) {
          optionItem["values"] = options?.map((x) =>
            Object.assign({}, x, { checked: false })
          );
          dispatchProduct(updateOption(optionItem));
        } else {
          optionItem["values"] = options?.map((x) =>
            Object.assign({}, x, { checked: true })
          );
          dispatchProduct(updateOption(optionItem));
        }

        // dispatchProduct(updateOption(optionItem));
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attributesGet]);

    React.useEffect(() => {
      if (item?.attributeId) {
        getAttributes(item?.attributeId);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item?.attributeId]);

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
          }
        : {
            active: t("Active"),
            label: t("Value Label"),
          };
    };

    const getTableKeys = () => {
      return item?.inputType === INPUT_TYPE.VISUAL_SWATCH
        ? ["active", "value", "label"]
        : ["active", "label"];
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
              return Object.assign({}, v, { valueAdd: text });
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
            <CustomInputMask
              style={[styles.customInput, { width: scaleWidth(230) }]}
              type={"money"}
              options={{
                precision: 2,
                separator: ".",
                delimiter: ",",
                unit: "",
                suffixUnit: "",
              }}
              textInputProps={{
                placeholder: "Price",
                fontSize: scaleFont(17),
                textAlign: "left",
                defaultValue: cellItem?.valueAdd ?? 0,
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
          {isWareHouse && (
            <TouchableOpacity onPress={onRemoveOptionsPress}>
              <Image
                style={{
                  width: scaleWidth(22),
                  height: scaleHeight(22),
                }}
                source={IMAGE.remove_color_row}
              />
            </TouchableOpacity>
          )}
        </InfoHeading>
        <View style={styles.content}>
          {item?.values?.length > 0 && (
            <Table
              items={item?.values}
              rowHeight={scaleHeight(60)}
              headerKeyLabels={getHeaderKeys()}
              whiteListKeys={getTableKeys()}
              primaryKey="attributeValueId"
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
