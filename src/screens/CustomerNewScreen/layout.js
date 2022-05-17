import React from 'react';
import {
  View,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import {
  Text,
  StatusBarHeader,
  ScrollableTabView,
  Button,
  ParentContainer,
  ButtonCustom,
  PopupCheckStaffPermission,
  Dropdown,
} from '@components';
import { scaleSize, localize } from '@utils';
import styles from './style';
import {
  HeaderTableCustomer,
  RowTableCustomer,
  RowEmptyTableCustomer,
  CustomerDetailTab,
  EditOrCreateCustomerTab,
  PopupFilterCustomer,
} from './widget';
import configs from '@configs';
import ICON from '@resources';

import { Block, Pagination } from './components';

export default class Layout extends React.Component {
  renderHeader() {
    const { language } = this.props;
    return (
      <View
        style={{
          height: scaleSize(35),
          borderBottomColor: '#0764B0',
          borderWidth: 3,
          paddingLeft: scaleSize(50),
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: scaleSize(16),
            color: '#0764B0',
            fontWeight: '600',
          }}
        >
          {localize('Customer', language)}
        </Text>
      </View>
    );
  }

  renderSearch() {
    const { language } = this.props;
    const { keySearch } = this.state;
    return (
      <Block
        height={scaleSize(40)}
        style={{ paddingHorizontal: scaleSize(12) }}
      >
        <Block flex row space="space-between">
          <Block row width={scaleSize(416)} space="space-between">
            <Block
              row
              border
              middle
              width={scaleSize(280)}
              height={scaleSize(40)}
              style={{ paddingHorizontal: scaleSize(8) }}
            >
              {/* ----------- Search Input ------------ */}
              <Block flex style={styles.padRight}>
                <TextInput
                  style={styles.inputSearch}
                  placeholder={localize('Search', language)}
                  value={keySearch}
                  onChangeText={this.onChangeKeySearch}
                />
              </Block>

              {/* ----------- Search Icon ------------ */}
              <Image source={ICON.search} style={styles.iconSearch} />
            </Block>
            {/* ----------- Search Button ------------ */}
            <Block width={scaleSize(120)}>
              <ButtonCustom
                width={'95%'}
                height={40}
                backgroundColor="#F1F1F1"
                title={localize('Search', language)}
                textColor="#6A6A6A"
                onPress={() => this.searchCustomer(1, true, false)}
                style={styles.btnBorderStyle}
                styleText={styles.btnTextStyle}
              />
            </Block>
          </Block>

          {/* ----------- Add New Button ------------ */}
          <Block width={scaleSize(140)} right>
            <ButtonCustom
              width={'95%'}
              height={40}
              backgroundColor="#0764B0"
              title={localize('New Customer', language)}
              textColor="#fff"
              onPress={this.addNewCustomer}
              style={styles.btnBorderStyle}
              styleText={styles.btnTextStyle}
            />
          </Block>
        </Block>
      </Block>
    );
  }

  renderFilter() {
    const { language } = this.props;

    const txtStyle = {
      color: '#6A6A6A',
      fontSize: scaleSize(17),
    };
    const iconStyle = {
      width: scaleSize(24),
      height: scaleSize(24),
      resizeMode: 'contain',
    };

    return (
      <Button
        style={{
          paddingHorizontal: scaleSize(12),
          marginTop: scaleSize(20),
          width: scaleSize(100),
          height: scaleSize(40),
        }}
        onPress={this.onToggleFilterCustomer}
      >
        <Block
          flex
          row
          middle
          border={styles.btnBorderStyle}
          space="space-evenly"
          width={scaleSize(100)}
        >
          <Text style={txtStyle}>{localize('Filters', language)}</Text>
          <Image source={ICON.filter} style={iconStyle} />
        </Block>
      </Button>
    );
  }

  renderPagination() {
    const { language } = this.props;
    const { keySearch } = this.state;

    const txtStyle = {
      color: '#0764B0',
      fontSize: scaleSize(15),
    };
    const iconStyle = {
      width: scaleSize(15),
      height: scaleSize(15),
      resizeMode: 'contain',
      tintColor: '#0764B0',
    };
    const txtPageStyle = {
      fontSize: scaleSize(15),
      color: '#404040',
      fontWeight: '500',
    };
    return (
      <Block
        height={scaleSize(40)}
        style={{ paddingHorizontal: scaleSize(12), marginTop: scaleSize(20) }}
      >
        <Block flex row space="space-between" middle>
          {/* ----------- Export DropDown Button ------------ */}

          <Block right>
            <Dropdown
              data={[{ value: 'PDF' }, { value: 'Excel' }]}
              fontSize={scaleSize(15)}
              renderBase={() => (
                <Button onPress={this.openDrawer}>
                  <Block
                    middle
                    border={styles.btnBorderStyle}
                    row
                    height={scaleSize(32)}
                    width={scaleSize(100)}
                    space="space-evenly"
                  >
                    <Text style={txtStyle}>{localize('Export', language)}</Text>
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

  renderTable() {
    const {
      listCustomersByMerchant,
      refreshListCustomer,
      language,
      isLoadMoreCustomerList,
    } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <HeaderTableCustomer language={language} />
        <FlatList
          data={this.state.customerList}
          renderItem={({ item, index }) => (
            <RowTableCustomer
              key={index}
              customer={item}
              unSelectAll={this.unSelectAll}
              showModalDetail={this.gotoCustomerDetailTab}
            />
          )}
          keyExtractor={(item, index) => `${item.customerId}`}
          ListEmptyComponent={<RowEmptyTableCustomer />}
          refreshing={refreshListCustomer}
          onRefresh={this.onRefreshCustomer}
          onEndReached={this.loadMoreCustomerList}
          onEndReachedThreshold={0.1}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          removeClippedSubviews={true}
          initialNumToRender={20}
          maxToRenderPerBatch={5}
          ListFooterComponent={() => (
            <View
              style={{
                height: scaleSize(30),
                alignItems: 'center',
                justifyContent: 'center',
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

  render() {
    const { language, stateCity, navigation, customerTabPermission } =
      this.props;
    const { visibleAdd, visibleDetail, visibleEdit, isFocus, currentTab } =
      this.state;
    return (
      <ParentContainer
        handleLockScreen={this.handleLockScreen}
        activeScreen={isFocus}
        navigation={navigation}
        clearIntervalById={this.clearIntervalById}
      >
        <View style={styles.container}>
          <StatusBarHeader />
          {this.renderHeader()}

          <ScrollableTabView
            ref={this.scrollTabRef}
            style={{ flex: 1 }}
            initialPage={0}
            locked={true}
            renderTabBar={() => <View />}
            onChangeTab={this.onChangeTab}
          >
            {/* --------- List Customer Tab -------- */}
            <View style={{ flex: 1 }}>
              <View style={{ height: scaleSize(25) }} />
              {this.renderSearch()}
              {this.renderFilter()}
              {this.renderPagination()}
              <View style={{ height: scaleSize(25) }} />
              {this.renderTable()}
              <PopupFilterCustomer
                visible={this.state.slideViewVisible}
                onClose={this.onToggleFilterCustomer}
              />
            </View>

            {/* --------- Edit or Create Customer -------- */}
            <EditOrCreateCustomerTab
              ref={(refs) => console.log(refs)}
              submitEditCustomer={this.submitEditCustomer}
              cancelEditCustomerInfo={this.cancelEditCustomerInfo}
              cancelAddCustomerInfo={this.cancelAddCustomerInfo}
              addCustomer={this.addCustomer}
            />
          </ScrollableTabView>
          <Button onPress={this.openDrawer} style={configs.btn_left_position}>
            <Image
              source={ICON.openDrawer}
              style={{ width: scaleSize(34), height: scaleSize(34) }}
            />
          </Button>

          {currentTab === 1 ? (
            <Button
              onPress={this.backCustomerListTab}
              style={[
                configs.btn_right_position,
                {
                  width: scaleSize(34),
                  height: scaleSize(34),
                  backgroundColor: '#0764B0',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <Image
                source={ICON.arrowRight}
                style={{ width: scaleSize(22), height: scaleSize(17) }}
              />
            </Button>
          ) : (
            <View />
          )}
        </View>
        <PopupCheckStaffPermission
          ref={this.checkPermissionRef}
          visiblePopupCheckStaffPermission={customerTabPermission}
          title={localize('Input PIN Number', language)}
          tabName="Customer"
          onRequestClose={this.closePopupCheckCustomerTabPermission}
        />
      </ParentContainer>
    );
  }
}
