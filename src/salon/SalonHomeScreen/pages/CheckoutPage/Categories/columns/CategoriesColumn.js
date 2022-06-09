import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SalonHomeContext } from "../../SalonHomeContext";
import { ColumnContainer, Header } from "../../widgets";
import * as AppUtils from "@utils";

export const CategoriesColumn = () => {
  const { t } = useTranslation();
  const ctx = React.useContext(SalonHomeContext);
  const {
    categorySelected,
    onPressSelectCategory,
    onSelectGiftCard,
    isShowColProduct,
    isGetCategoriesByStaff,
    categoriesByMerchant,
    groupAppointment,
    isOfflineMode,
    isBlockBookingFromCalendar,
    categoryStaff,
  } = ctx || {};

  const _fixDuplicateItems = (arr) => {
    let uniqueArr = [];
    arr.forEach((item) => {
      if (!uniqueArr.find((x) => x.categoryId === item.categoryId)) {
        uniqueArr.push(item);
      }
    });
    return uniqueArr;
  };

  const filterCategories = React.useMemo(() => {
    if (isGetCategoriesByStaff) return null;

    const categoriesFilter = categoriesByMerchant?.filter(
      (category, index) => category.isDisabled === 0
    );

    const appointments = groupAppointment?.appointments || [];
    let tempIdCategoriesList = [];
    for (let appointment of appointments) {
      let categories = appointment?.categories || [];
      for (let category of categories) {
        tempIdCategoriesList.push(category?.categoryId || 0);
      }
    }

    const IdCategoriesList = [...new Set(tempIdCategoriesList)];
    let selectCategories = [];
    let notSelectCategories = [];
    let tempCategories = [];

    if (IdCategoriesList.length > 0) {
      for (let i = 0; i < IdCategoriesList.length; i++) {
        for (let j = 0; j < categoriesFilter.length; j++) {
          if (IdCategoriesList[i] === categoriesFilter[j].categoryId) {
            selectCategories.push({
              ...categoriesFilter[j],
              isSelect: true,
            });
            break;
          }
        }
      }
      if (isOfflineMode || isBlockBookingFromCalendar) {
        notSelectCategories = categoriesFilter.filter((category, index) =>
          AppUtils.checkCategoryIsNotExist(category, IdCategoriesList)
        );
        tempCategories = [...selectCategories, ...notSelectCategories];
      } else {
        let categoriesStaffFilter = [];

        for (let i = 0; i < categoryStaff.length; i++) {
          const findItem = l.find(selectCategories, (item) => {
            return item.categoryId == categoryStaff[i].categoryId;
          });
          if (!findItem) {
            categoriesStaffFilter.push(categoryStaff[i]);
          }
        }
        tempCategories = [...selectCategories, ...categoriesStaffFilter];
      }
    } else {
      if (isOfflineMode || isBlockBookingFromCalendar) {
        tempCategories = [...categoriesFilter];
      } else {
        tempCategories = [...categoryStaff];
      }
    }

    return _fixDuplicateItems(tempCategories); // remove duplicate item in staff categories
  }, [
    isGetCategoriesByStaff,
    categoryStaff,
    categoriesByMerchant,
    isOfflineMode,
    isBlockBookingFromCalendar,
  ]);

  const _getItemKey = (item) => `${item?.categoryType}-${item?.categoryId}`;

  const _renderCategory = ({ item, index }) => {
    const key = _getItemKey(item);
    return (
      <ItemCategory
        key={key}
        category={item}
        onPressSelectCategory={onPressSelectCategory}
        categorySelected={categorySelected}
      />
    );
  };

  const _renderGiftCard = () => {
    return isGetCategoriesByStaff ? (
      <></>
    ) : (
      <>
        <Separator />
        <ItemCategory
          key={"giftCard-1"}
          category={{
            name: "Gift Card",
            categoryId: 1,
          }}
          onPressSelectCategory={onSelectGiftCard}
          // colorText={temptColorHeader}
          categorySelected={categorySelected}
        />
      </>
    );
  };

  const _renderSeparator = () => {
    return <Separator />;
  };

  return (
    <ColumnContainer
      style={{ width: !isShowColProduct ? scaleWidth(260) : scaleWidth(120) }}
      highlight={!isShowColProduct}
      border={!isShowColProduct}
    >
      <Header label={t("Categories")} />
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1 }}
          data={filterCategories}
          extraData={filterCategories}
          renderItem={_renderCategory}
          keyExtractor={_getItemKey}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={() => {}}
          ItemSeparatorComponent={_renderSeparator}
          ListFooterComponent={_renderGiftCard}
        />

        {isGetCategoriesByStaff && (
          <View
            style={[
              layouts.center,
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              },
            ]}
          >
            <ActivityIndicator size="large" color="grey" />
          </View>
        )}
      </View>
    </ColumnContainer>
  );
};

const Separator = () => {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: colors.VERY_LIGHT_PINK_E_5,
      }}
    />
  );
};

const ItemCategory = ({
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
    <TouchableOpacity
      onPress={() => onPressSelectCategory(category)}
      style={{
        minHeight: scaleHeight(80),
        justifyContent: "center",
        backgroundColor: backgroundColor,
        paddingLeft: scaleWidth(8),
      }}
    >
      <Text
        numberOfLines={2}
        style={[
          {
            fontFamily: fonts.REGULAR,
            fontSize: scaleFont(18),
            fontWeight: "normal",
            fontStyle: "normal",
            textAlign: "left",
            color: colors.GREYISH_BROWN,
          },
          colorText,
          textColor,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};
