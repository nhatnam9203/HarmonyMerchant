const React = require("react");
const { ViewPropTypes } = (ReactNative = require("react-native"));
const PropTypes = require("prop-types");
const createReactClass = require("create-react-class");
const { StyleSheet, Text, View, Animated, Dimensions } = ReactNative;
const Button = require("./Button");
const { width } = Dimensions.get("window");

import { scaleSize } from "../../utils";

const DefaultTabBar = createReactClass({
  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    // textStyle,
    tabStyle: ViewPropTypes.style,
    renderTab: PropTypes.func,
    underlineStyle: ViewPropTypes.style,
  },

  getDefaultProps() {
    return {
      activeTextColor: "navy",
      inactiveTextColor: "black",
      backgroundColor: null,
    };
  },

  renderTabOption(name, page) {},

  renderTab(name, page, isTabActive, onPressHandler) {
    const {
      activeTextColor,
      inactiveTextColor,
      textStyle,
      backgroundTabActive,
    } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? "bold" : "normal";
    const backgroundColorActive = isTabActive
      ? { backgroundColor: backgroundTabActive }
      : {};

    const numberOfTabs = this.props.tabs.length;
    const temptborder =
      page != parseInt(numberOfTabs - 1)
        ? { borderRightWidth: 2, borderRightColor: "#0764B0" }
        : {};
    const temptRadiusTabFirst =
      page == 0
        ? {
            borderTopLeftRadius: scaleSize(8.5),
            borderBottomLeftRadius: scaleSize(8.5),
          }
        : {};
    const temptRadiusTabLast =
      page == parseInt(numberOfTabs - 1)
        ? {
            borderTopRightRadius: scaleSize(8.5),
            borderBottomRightRadius: scaleSize(8.5),
          }
        : {};
    return (
      <Button
        style={{ flex: 1 }}
        key={name}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={() => onPressHandler(page)}
      >
        <View
          style={[
            styles.tab,
            this.props.tabStyle,
            backgroundColorActive,
            temptRadiusTabFirst,
            temptRadiusTabLast,
            temptborder,
          ]}
        >
          <Text style={[{ color: textColor, fontWeight }, textStyle]}>
            {name}
          </Text>
        </View>
      </Button>
    );
  },

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: "absolute",
      width: containerWidth / numberOfTabs,
      height: 4,
      backgroundColor: "navy",
      bottom: 0,
    };

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, containerWidth / numberOfTabs],
    });
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.tabs,
            { backgroundColor: "#F1F1F1" },
            this.props.style,
          ]}
        >
          {this.props.tabs.map((name, page) => {
            const isTabActive = this.props.activeTab === page;
            const renderTab = this.props.renderTab || this.renderTab;
            return renderTab(name, page, isTabActive, this.props.goToPage);
          })}
        </View>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    height: scaleSize(34),
    width: width,
    paddingHorizontal: scaleSize(15),
    borderRadius: scaleSize(10),
  },
  tabs: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 2,
    borderColor: "#0764B0",
    borderRadius: scaleSize(10),
  },
});

module.exports = DefaultTabBar;
