import React from "react";

import { scaleSize } from "@utils";
import { Text, Button } from "@components";
import { colors, fonts } from "@shared/themes";

export const ItemCategory = ({
  category,
  onPressSelectCategory,
  colorText,
  categorySelected,
}) => {
  const backgroundColor =
    category.categoryId === categorySelected.categoryId
      ? colors.OCEAN_BLUE
      : category?.isSelect
      ? colors.AZURE
      : colors.WHITE;

  const textColor =
    category.categoryId === categorySelected.categoryId
      ? { color: "#fff" }
      : {};

  return (
    <Button
      onPress={() => onPressSelectCategory(category)}
      style={{
        minHeight: scaleHeight(80),
        backgroundColor: colors.WHITE_FA,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: colors.VERY_LIGHT_PINK_C_5,
        backgroundColor: backgroundColor,
        paddingLeft: scaleSize(8),
      }}
    >
      <Text
        numberOfLines={2}
        style={[
          {
            fontFamily: fonts.REGULAR,
            fontSize: scaleFont(17),
            fontWeight: "normal",
            fontStyle: "normal",
            letterSpacing: -0.41,
            textAlign: "left",
            color: colors.GREYISH_BROWN,
          },
          colorText,
          textColor,
        ]}
      >
        {category.name}
      </Text>
    </Button>
  );
};
