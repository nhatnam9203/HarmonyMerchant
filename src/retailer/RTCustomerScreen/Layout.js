import {
  Button,
  ButtonCustom,
  Dropdown,
  StatusBarHeader,
  Text,
} from "@components";
import { createStackNavigator } from "@react-navigation/stack";
import ICON from "@resources";
import { PermissionChecker } from "@shared/components";
import { ButtonDrawer } from "@shared/components/ButtonDrawer";
import { HeaderToolBar } from "@shared/components/HeaderToolBar";
import { HeaderToolBarTitle } from "@shared/components/HeaderToolBarTitle";
import { colors } from "@shared/themes";
import { menuTabs } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Block } from "./components";
import {
  CustomerDetailPage,
  CustomerListPage,
  EditCustomerAddressPage,
  EditCustomerPage,
} from "./pages";
import {
  HeaderTableCustomer,
  RowEmptyTableCustomer,
  RowTableCustomer,
} from "./widget";

const { Screen, Navigator } = createStackNavigator();

export const Layout = ({
  openDrawer,
  navigation,
  handleLockScreen,
  tabPermission,
  togglePopupPermission,
}) => {
  const { t } = useTranslation();

  function renderSearch() {
    return (
      <Block
        height={scaleWidth(40)}
        style={{ paddingHorizontal: scaleWidth(12) }}
      >
        <Block flex row space="space-between">
          <Block row width={scaleWidth(416)} space="space-between">
            <Block
              row
              border
              middle
              width={scaleWidth(280)}
              height={scaleWidth(40)}
              style={{ paddingHorizontal: scaleWidth(8) }}
            >
              {/* ----------- Search Input ------------ */}
              <Block flex style={styles.padRight}>
                <TextInput
                  style={styles.inputSearch}
                  placeholder={t("Search")}
                  // value={keySearch}
                  // onChangeText={onChangeKeySearch}
                  //onSubmitEditing={() => searchCustomer(1, true, false)}
                />
              </Block>

              {/* ----------- Search Icon ------------ */}
              <Image source={ICON.search} style={styles.iconSearch} />
            </Block>
            {/* ----------- Search Button ------------ */}
            <Block width={scaleWidth(120)}>
              <ButtonCustom
                width={"95%"}
                height={40}
                backgroundColor="#F1F1F1"
                title={t("Search")}
                textColor="#6A6A6A"
                // onPress={() => searchCustomer(1, true, false)}
                style={styles.btnBorderStyle}
                styleText={styles.btnTextStyle}
              />
            </Block>
          </Block>

          {/* ----------- Add New Button ------------ */}
          <Block width={scaleWidth(140)} right>
            <ButtonCustom
              width={"95%"}
              height={40}
              backgroundColor="#0764B0"
              title={t("New Customer")}
              textColor="#fff"
              // onPress={addNewCustomer}
              style={styles.btnBorderStyle}
              styleText={styles.btnTextStyle}
            />
          </Block>
        </Block>
      </Block>
    );
  }

  function renderFilter() {
    const txtStyle = {
      color: "#6A6A6A",
      fontSize: scaleWidth(17),
    };
    const iconStyle = {
      width: scaleWidth(24),
      height: scaleWidth(24),
      resizeMode: "contain",
    };

    return (
      <Button
        style={{
          paddingHorizontal: scaleWidth(12),
          marginTop: scaleWidth(20),
          width: scaleWidth(100),
          height: scaleWidth(40),
        }}
        //onPress={onToggleFilterCustomer}
      >
        <Block
          flex
          row
          middle
          border={styles.btnBorderStyle}
          space="space-evenly"
          width={scaleWidth(100)}
        >
          <Text style={txtStyle}>{t("Filters")}</Text>
          <Image source={ICON.filter} style={iconStyle} />
        </Block>
      </Button>
    );
  }

  function renderPagination() {
    const txtStyle = {
      color: "#0764B0",
      fontSize: scaleWidth(15),
    };
    const iconStyle = {
      width: scaleWidth(15),
      height: scaleWidth(15),
      resizeMode: "contain",
      tintColor: "#0764B0",
    };
    const txtPageStyle = {
      fontSize: scaleWidth(15),
      color: "#404040",
      fontWeight: "500",
    };
    return (
      <Block
        height={scaleWidth(40)}
        style={{ paddingHorizontal: scaleWidth(12), marginTop: scaleWidth(20) }}
      >
        <Block flex row space="space-between" middle>
          {/* <Block row flex center>
            <Text style={txtPageStyle}>Page: </Text>
            <Pagination />

            <Block style={{ paddingLeft: scaleWidth(20) }}>
              <Text style={txtPageStyle}>
                Items 1 - 10 of 543 | Items per page
              </Text>
            </Block>

            <Block
              height={scaleWidth(32)}
              width={scaleWidth(64)}
              style={{ paddingLeft: scaleWidth(10) }}
            >
              <Dropdown
                label={t('10')}
                data={[{ value: '10' }, { value: '20' }, { value: '50' }]}
                containerStyle={[
                  styles.btnBorderStyle,
                  { justifyContent: 'space-evenly' },
                ]}
              />
            </Block>
          </Block> */}

          {/* ----------- Export DropDown Button ------------ */}

          <Block right>
            <Dropdown
              data={[{ value: "PDF" }, { value: "Excel" }]}
              fontSize={scaleWidth(15)}
              renderBase={() => (
                <Button>
                  <Block
                    middle
                    border={styles.btnBorderStyle}
                    row
                    height={scaleWidth(32)}
                    width={scaleWidth(100)}
                    space="space-evenly"
                  >
                    <Text style={txtStyle}>{t("Export")}</Text>
                    <Image source={ICON.Report_Export} style={iconStyle} />
                  </Block>
                </Button>
              )}
            />
          </Block>
        </Block>
      </Block>
    );
  }

  function renderTable() {
    const {
      listCustomersByMerchant,
      refreshListCustomer,
      language,
      isLoadMoreCustomerList,
    } = {};

    return (
      <View style={{ flex: 1 }}>
        <HeaderTableCustomer language={language} />
        <FlatList
          // data={customerList}
          renderItem={({ item, index }) => (
            <RowTableCustomer
              key={index}
              customer={item}
              // unSelectAll={unSelectAll}
              // showModalDetail={gotoCustomerDetailTab}
            />
          )}
          keyExtractor={(item, index) => `${item.customerId}`}
          ListEmptyComponent={<RowEmptyTableCustomer />}
          refreshing={refreshListCustomer}
          // onRefresh={onRefreshCustomer}
          // onEndReached={loadMoreCustomerList}
          onEndReachedThreshold={0.1}
          // onMomentumScrollBegin={() => {
          //   onEndReachedCalledDuringMomentum = false;
          // }}
          removeClippedSubviews={true}
          initialNumToRender={20}
          maxToRenderPerBatch={5}
          ListFooterComponent={() => (
            <View
              style={{
                height: scaleWidth(30),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isLoadMoreCustomerList ? (
                <ActivityIndicator size="large" color="#0764B0" />
              ) : null}
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBarHeader />
      <HeaderToolBar
        leftComponent={() => <ButtonDrawer onPress={openDrawer} />}
      >
        <HeaderToolBarTitle label={t("Customer")} />
      </HeaderToolBar>

      <Navigator
        headerMode="retailer.customer.list"
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
      >
        <Screen {...CustomerListPage} />
        <Screen {...EditCustomerPage} />
        <Screen {...CustomerDetailPage} />
        <Screen {...EditCustomerAddressPage} />
      </Navigator>
      <PermissionChecker
        navigation={navigation}
        tabName={menuTabs.MENU_CUSTOMER}
        tabPermission={tabPermission}
        togglePopupPermission={togglePopupPermission}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE_FA,
  },
  borderStyle: {
    borderWidth: 1,
    borderColor: "#C5C5C5",
    borderRadius: scaleWidth(4),
    backgroundColor: "#F1F1F1",
  },
  iconSearch: {
    width: scaleWidth(22),
    height: scaleWidth(22),
    resizeMode: "contain",
  },
  inputSearch: { flex: 1, fontSize: scaleWidth(17) },
  padRight: {
    paddingRight: scaleWidth(8),
  },
  btnBorderStyle: {
    borderColor: "#C5C5C5",
    borderWidth: 1,
    borderRadius: scaleWidth(4),
  },

  btnTextStyle: { fontSize: scaleWidth(15), fontWeight: "500" },
});
