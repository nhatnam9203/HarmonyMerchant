import ICON from "@resources";
import { colors, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View, ActivityIndicator } from "react-native";
import { ColumnContainer, Header } from "../../widgets";
import ItemProductService from "../../widgets/ItemProductService";
import { SalonHomeContext } from "../../SalonHomeContext";

export const ItemsColumn = ({ isShowCustomService }) => {
  const { t } = useTranslation();

  const ctx = React.useContext(SalonHomeContext);
  const {
    isGetServiceByStaff,
    isGetProductByStaff,
    isBlockBookingFromCalendar,
    serviceStaff,
    productStaff,
    isShowColAmount = false,
    productSeleted,
    categoryTypeSelected,
    groupAppointment,
    showCustomServiceAmount,
    showColAmount,
    categorySelected,
    customService,
    isOfflineMode,
    extrasByMerchant,
    servicesByMerchant,
    productsByMerchantId,
  } = ctx || {};

  const temptColorHeader = isShowColAmount ? { color: "#6A6A6A" } : {};
  const tempTitle =
    categoryTypeSelected === "Service" ? "Services" : "Products";

  const _isShowLoading = () => isGetServiceByStaff || isGetProductByStaff;

  const filterItems = React.useMemo(() => {
    if (isGetServiceByStaff || isGetProductByStaff) return null;
    if (categoryTypeSelected === "Extra") {
      const dataExtra = extrasByMerchant?.filter(
        (extra, index) => extra?.isDisabled === 0
      );

      return dataExtra;
    } else {
      const data =
        categoryTypeSelected === "Service"
          ? servicesByMerchant
          : productsByMerchantId;

      if (data?.length > 0) {
        let temptData = data.filter((item) => {
          return (
            item?.categoryId === categorySelected?.categoryId &&
            item?.isDisabled === 0
          );
        });

        if (!isOfflineMode && !isBlockBookingFromCalendar) {
          if (categoryTypeSelected === "Service") {
            temptData = [...serviceStaff];
          } else if (categoryTypeSelected === "Product") {
            temptData = [...productStaff];
          }
        }

        return temptData;
      }

      return [];
    }
  }, [
    categoryTypeSelected,
    categorySelected,
    isBlockBookingFromCalendar,
    productStaff,
    serviceStaff,
    isOfflineMode,
    extrasByMerchant,
    isGetServiceByStaff,
    isGetProductByStaff,
  ]);

  const getItemKey = (item) => `${item?.serviceId ?? item?.productId}`;

  const _renderItem = ({ item, index }) => {
    const key = getItemKey(item);

    return (
      <ItemProductService
        key={key}
        item={item}
        index={index}
        colorText={temptColorHeader}
        itemSelected={productSeleted}
        categoryTypeSelected={categoryTypeSelected}
        isShowColAmount={isShowColAmount}
        groupAppointment={groupAppointment}
        showColAmount={showColAmount}
      />
    );
  };

  const _renderItemSeparator = () => {
    return <Separator />;
  };

  const _renderHeaderComponent = () => {
    return isShowCustomService && !_isShowLoading() ? (
      <>
        <ItemProductService
          key="custom_service"
          index={-1}
          item={Object.assign({}, customService, {
            name: "Custom service",
            category: categorySelected,
          })}
          defaultThumb={ICON.custom_service_thumb}
          colorText={temptColorHeader}
          itemSelected={productSeleted}
          categoryTypeSelected={categoryTypeSelected}
          isShowColAmount={isShowColAmount}
          groupAppointment={groupAppointment}
          showColAmount={showCustomServiceAmount}
        />
        <Separator />
      </>
    ) : (
      <></>
    );
  };

  return (
    <ColumnContainer
      style={{ width: !isShowColAmount ? scaleWidth(260) : scaleWidth(164) }}
      highlight={!isShowColAmount}
      border={false}
    >
      <Header label={t(tempTitle)} />
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1 }}
          data={filterItems}
          renderItem={_renderItem}
          extraData={(item, index) => `${index}`}
          keyExtractor={getItemKey}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={() => {}}
          ItemSeparatorComponent={_renderItemSeparator}
          ListHeaderComponent={_renderHeaderComponent}
        />

        {_isShowLoading() && (
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
