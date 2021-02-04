import React from "react";
import { View, TextInput, Image } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

import { scaleSzie, localize } from "@utils";
import {
  Text,
  Button,
  ButtonCustom,
  Dropdown,
  PopupConfirm,
  ClearTextInputIcon,
  ScrollableTabView,
} from "@components";
import styles from "./style";
import {
  HeaderTableStaff,
  RowTableStaff,
  AddStaff,
  RowTableEmptyStaff,
} from "./widget";

class Layout extends React.Component {
  renderSearch() {
    const { language } = this.props;
    const { searchFilter } = this.state;
    const { keySearch } = searchFilter;
    return (
      <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ width: scaleSzie(70), justifyContent: "center" }}>
              <Text style={{ fontSize: scaleSzie(18), color: "#6A6A6A" }}>
                {localize("Search", language)}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                borderColor: "#C5C5C5",
                borderWidth: 1,
                borderRadius: scaleSzie(4),
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 1, paddingHorizontal: scaleSzie(12) }}>
                <TextInput
                  style={{ flex: 1, fontSize: scaleSzie(18) }}
                  placeholder={localize("Staff Name", language)}
                  value={keySearch}
                  onChangeText={(value) =>
                    this.updateSearchFilterInfo("keySearch", value)
                  }
                  onSubmitEditing={this.searchStaff}
                />
              </View>
              {keySearch.length > 0 ? (
                <Button
                  onPress={this.clearSearchText}
                  style={{
                    width: scaleSzie(35),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ClearTextInputIcon />
                </Button>
              ) : null}
            </View>
          </View>
          <View style={{ width: scaleSzie(170), alignItems: "flex-end" }}>
            <ButtonCustom
              width={"90%"}
              height={40}
              backgroundColor="#F1F1F1"
              title={localize("Search", language)}
              textColor="#6A6A6A"
              onPress={this.searchStaff}
              style={{ borderWidth: 1, borderColor: "#C5C5C5" }}
              styleText={{ fontSize: scaleSzie(15), fontWeight: "500" }}
            />
          </View>
        </View>
      </View>
    );
  }

  renderFilter() {
    const { language } = this.props;
    const { searchFilter } = this.state;
    const { role, status } = searchFilter;
    return (
      <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ width: scaleSzie(70), justifyContent: "center" }}>
              <Text style={{ fontSize: scaleSzie(18), color: "#6A6A6A" }}>
                {localize("Filters", language)}
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ width: scaleSzie(120) }}>
                <Dropdown
                  label={localize("Role", language)}
                  data={[{ value: "" }, { value: "Admin" }, { value: "Staff" }]}
                  value={role}
                  onChangeText={(value) =>
                    this.updateSearchFilterInfo("role", value)
                  }
                  containerStyle={{
                    backgroundColor: "rgb(246,246,246)",
                    borderWidth: 1,
                    borderColor: "#C5C5C5",
                    flex: 1,
                    borderRadius: scaleSzie(4),
                  }}
                />
              </View>
              <View style={{ width: scaleSzie(12) }} />
              <View style={{ width: scaleSzie(120) }}>
                <Dropdown
                  label={localize("Status", language)}
                  data={[
                    { value: "" },
                    { value: "Active" },
                    { value: "Disable" },
                  ]}
                  value={status}
                  onChangeText={(value) =>
                    this.updateSearchFilterInfo("status", value)
                  }
                  containerStyle={{
                    backgroundColor: "#F1F1F1",
                    borderWidth: 1,
                    borderColor: "#C5C5C5",
                    flex: 1,
                    borderRadius: scaleSzie(4),
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{ width: scaleSzie(170), alignItems: "flex-end" }}>
            <ButtonCustom
              width={"90%"}
              height={40}
              backgroundColor="#F1F1F1"
              title={localize("Add New", language)}
              textColor="#6A6A6A"
              onPress={this.addStaff}
              style={{
                borderWidth: 1,
                borderColor: "#C5C5C5",
                backgroundColor: "#0764B0",
              }}
              styleText={{
                fontSize: scaleSzie(15),
                fontWeight: "500",
                color: "#fff",
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  renderTableStaff() {
    const {
      listStaffByMerchant,
      isShowSearchStaff,
      refreshListStaffs,
      language,
      listSearchStaff,
    } = this.props;
    const { visibleArchive, visibleRestore } = this.state;
    const tempData = isShowSearchStaff ? listSearchStaff : listStaffByMerchant;
    const data = tempData.map((item, index) => {
      return {
        ...item,
        key: `item-${index}`,
      };
    });

    return (
      <View style={styles.container}>
        {this.renderSearch()}
        <View style={{ height: scaleSzie(10) }} />
        {this.renderFilter()}
        <View style={{ height: scaleSzie(10) }} />
        <View style={{ flex: 1 }}>
          <HeaderTableStaff />
          <View style={{ height: 1, backgroundColor: "#C5C5C5" }} />
          <DraggableFlatList
            data={data}
            renderItem={({ item, index, move, moveEnd, isActive }) => (
              <RowTableStaff
                index={index}
                staff={item}
                archiveStaff={() => this.archiveStaff(item)}
                editStaff={() => this.editStaff(item)}
                restoreStaff={() => this.restoreStaff(item)}
                move={move}
                moveEnd={moveEnd}
                toggleStaffActive={this.toggleStaffActive}
              />
            )}
            keyExtractor={(item, index) => `${index}`}
            ListEmptyComponent={<RowTableEmptyStaff />}
            onRefresh={this.searchStaff.bind(this, false)}
            refreshing={refreshListStaffs}
            scrollPercent={5}
            onMoveEnd={({ data }) =>
              this.updateStaffsPosition(data, isShowSearchStaff)
            }
          />
        </View>
        <PopupConfirm
          visible={visibleArchive}
          title={localize("Confirmation", language)}
          message={`${localize(
            "Do you want to Archive this Staff",
            language
          )}?`}
          onRequestClose={() => this.togglePopupArchive(false)}
          confimYes={() => this.archirveStaffYess()}
        />
        <PopupConfirm
          visible={visibleRestore}
          title={localize("Confirmation", language)}
          message={`${localize(
            "Do you want to Restore this Staff",
            language
          )}?`}
          onRequestClose={() => this.togglePopupRestore(false)}
          confimYes={() => this.archirveRestoreYess()}
        />
      </View>
    );
  }

  render() {
    const { isAddStaff, language, stateCity, profile } = this.props;
    const { isEditStaff, staffHandle } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {/* {isAddStaff ? (
          <AddStaff
            profile={profile}
            stateCity={stateCity}
            language={language}
            infoStaffHandle={staffHandle}
            isEditStaff={isEditStaff}
            addStaff={this.submitAddStaff}
            editStaff={this.submitEditStaff}
          />
        ) : (
          this.renderTableStaff()
        )} */}
        <ScrollableTabView
          renderTabBar={() => <View style={{ height: 0 }} />}
          ref={this.scrollTabParentRef}
          style={{}}
          initialPage={0}
          locked={true}
        >
          <View style={{ flex: 1 }}>{this.renderTableStaff()}</View>
          <AddStaff
            ref={this.addStaffRef}
            profile={profile}
            stateCity={stateCity}
            language={language}
            infoStaffHandle={staffHandle}
            isEditStaff={isEditStaff}
            addStaff={this.submitAddStaff}
            editStaff={this.submitEditStaff}
          />
        </ScrollableTabView>
      </View>
    );
  }
}

export default Layout;
