import React from "react";
import { View } from "react-native";

import { StatusBarHeader, ScrollableTabView } from "@components";
import styles from "./style";
import GeneralInfoScreen from "../GeneralInfoScreen";
import BusinessInfo from "../BusinessInfoScreen";
import BankInfo from "../BankInfoScreen";
import PrincipalInfo from "../PrincipalScreen";
import PackageAndPricing from "../PackageAndPricing";
import ApplicationSubmit from "../ApplicationSubmitScreen";
import { Packages } from "./widgets";

export default class Layout extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <StatusBarHeader />
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <ScrollableTabView
              ref={this.scrollTabRef}
              style={{}}
              initialPage={0}
              tabBarPosition="bottom"
              locked={true}
              springTension={1}
              springFriction={1}
              renderTabBar={() => <View />}
            >
              <GeneralInfoScreen
                navigation={navigation}
                goToPage={this.goToPage}
              />
              <BusinessInfo goToPage={this.goToPage} />
              <BankInfo ref={this.bankInfoRef} goToPage={this.goToPage} />
              <PrincipalInfo
                ref={this.principalInfoRef}
                goToPage={this.goToPage}
              />
              {/* <PackageAndPricing goToPage={this.goToPage} /> */}
              <Packages goToPage={this.goToPage} />
              <ApplicationSubmit />
            </ScrollableTabView>
          </View>
        </View>
      </View>
    );
  }
}
