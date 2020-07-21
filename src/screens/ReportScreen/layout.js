import React from "react";
import { View, Image, FlatList } from "react-native";

import {
  Text,
  StatusBarHeader,
  Button,
  ParentContainer,
  PopupCheckStaffPermission,
  PopupCalendar,
} from "@components";
import { scaleSzie, localize } from "@utils";
import styles from "./style";
import IMAGE from "@resources";
import {
  HeaderTableStaffSalary,
  RowTableStaffSalary,
  RowEmptyTableStaffSalary,
  RowFooterStaffSalary,
  PopupStaffInvoicePrint,
} from "./widget";
import { ScrollView } from "react-native-gesture-handler";
import ReportScreen2 from "./ReportScreen2";

export default class Layout extends React.Component {
  renderHeader() {
    const { language } = this.props;
    return (
      <View
        style={{
          height: scaleSzie(35),
          borderBottomColor: "#0764B0",
          borderWidth: 3,
          paddingLeft: scaleSzie(50),
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: scaleSzie(16), color: "#0764B0" }}>
          {localize("Reports", language)}
        </Text>
      </View>
    );
  }

  renderFilter() {
    const { language } = this.props;
    const { titleRangeTime } = this.state;
    const temptColorTextTimeRange = "rgb(38,38,38)";
    return (
      <View
        style={{
          paddingHorizontal: scaleSzie(20),
          marginTop: scaleSzie(20),
          marginBottom: scaleSzie(10),
        }}
      >
        {/* ---------- Row 1 ---------- */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={IMAGE.sale}
            style={{ width: scaleSzie(26), height: scaleSzie(32) }}
          />
          <Text
            style={{
              color: "#6A6A6A",
              fontSize: scaleSzie(22),
              fontWeight: "700",
              marginLeft: scaleSzie(8),
            }}
          >
            {localize("Compare sales of Staffs", language)}
          </Text>
        </View>
        {/* ---------- Row 2 ---------- */}
        <View
          style={{
            flexDirection: "row",
            marginTop: scaleSzie(16),
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: scaleSzie(18),
              color: "#6A6A6A",
              marginRight: scaleSzie(10),
            }}
          >
            {localize("Filters", language)}
          </Text>

          <Button onPress={this.showCalendar} style={{ width: scaleSzie(200) }}>
            <View
              style={[
                { height: scaleSzie(40), width: "90%", flexDirection: "row" },
                styles.borderStyle,
              ]}
            >
              <View style={{ alignItems: "center", flexDirection: "row" }}>
                <Text
                  style={{
                    color: temptColorTextTimeRange,
                    fontSize: scaleSzie(15),
                    marginLeft: scaleSzie(10),
                  }}
                >
                  {titleRangeTime}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-end",
                  paddingRight: scaleSzie(6),
                }}
              >
                <Image
                  source={IMAGE.dropdown}
                  style={{ width: scaleSzie(6), height: scaleSzie(3) }}
                />
              </View>
            </View>
          </Button>
          {/* ----- Btn Search ---- */}
          <View style={{ width: scaleSzie(120), alignItems: "flex-end" }}>
            {/* <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Search', language)}
                            textColor="#6A6A6A"
                            onPress={this.searchStaff}
                            style={{
                                borderWidth: 1, borderColor: '#C5C5C5',
                                backgroundColor: '#0764B0'
                            }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: '500', color: '#fff' }}
                        /> */}
          </View>
        </View>
        {/* ---------- Row 3 ---------- */}
        <View
          style={{
            flexDirection: "row",
            marginTop: scaleSzie(22),
            alignItems: "center",
          }}
        ></View>
      </View>
    );
  }

  renderTable() {
    const {
      listStaffsSalary,
      refreshListStaffsSalary,
      listStaffsCalendar,
      language,
    } = this.props;
    return (
      <ScrollView
        contentContainerStyle={
          listStaffsCalendar.length > 0 ? null : { flex: 1 }
        }
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        horizontal
      >
        <View style={{ flex: 1, width: "100%" }}>
          <HeaderTableStaffSalary
            calendar={listStaffsCalendar}
            setPosition={this.setPosition}
            language={language}
          />
          <FlatList
            data={listStaffsSalary}
            renderItem={({ item, index }) => (
              <RowTableStaffSalary
                staff={item}
                index={index + 1}
                dx={this.props.dx}
                onPress={this.showPopupStaffInvoice.bind(this, item)}
              />
            )}
            keyExtractor={(item, index) => `${item.staffId}_${index}`}
            ListEmptyComponent={
              <RowEmptyTableStaffSalary calendar={listStaffsCalendar} />
            }
            refreshing={refreshListStaffsSalary}
            onRefresh={this.onRefreshStaffReport}
          />
          <RowFooterStaffSalary data={listStaffsSalary} />
        </View>
      </ScrollView>
    );
  }

  renderFooterTable() {
    return (
      <View
        style={{ height: scaleSzie(45), backgroundColor: "#E5E5E5" }}
      ></View>
    );
  }

  render() {
    const { navigation, language, reportTabPermission } = this.props;
    const {
      isFocus,
      visibleCalendar,
      selectedStaff,
      visibleStaffInvoicePrint,
    } = this.state;

    return (
      <ParentContainer
        handleLockScreen={this.handleLockScreen}
        activeScreen={isFocus}
        navigation={navigation}
      >
        <View style={styles.container}>
          <StatusBarHeader />
          {this.renderHeader()}
          {/* {this.renderFilter()} */}
          {/* {this.renderTable()} */}
          <ReportScreen2 />
          <Button
            onPress={this.openDrawer}
            style={{ position: "absolute", top: 20, left: 0 }}
          >
            <Image
              source={IMAGE.openDrawer}
              style={{ width: scaleSzie(34), height: scaleSzie(34) }}
            />
          </Button>
        </View>
        <PopupCalendar
          ref={this.modalCalendarRef}
          type="report"
          visible={visibleCalendar}
          onRequestClose={() => this.setState({ visibleCalendar: false })}
          changeTitleTimeRange={this.changeTitleTimeRange}
        />
        <PopupStaffInvoicePrint
          // ref={this.invoicePrintRef}
          visiblePrintInvoice={visibleStaffInvoicePrint}
          onRequestClose={this.cancelStaffInvoicePrint}
          staff={selectedStaff}
        />
        <PopupCheckStaffPermission
          ref={this.checkPermissionRef}
          visiblePopupCheckStaffPermission={reportTabPermission}
          title={localize("Input PIN Number", language)}
          tabName="Reports"
          onRequestClose={this.closePopupCheckReportTabPermission}
        />
      </ParentContainer>
    );
  }
}
