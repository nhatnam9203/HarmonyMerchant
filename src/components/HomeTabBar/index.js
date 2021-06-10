const React = require('react');
const { ViewPropTypes } = ReactNative = require('react-native');
const PropTypes = require('prop-types');
const createReactClass = require('create-react-class');
const {
  StyleSheet,
  Text,
  View,
  Animated,
  Image
} = ReactNative;
const Button = require('./Button');

import { scaleSize } from '@utils';
import ICON from "@resources";

const HomeTabBar = createReactClass({
  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: ViewPropTypes.style,
    renderTab: PropTypes.func,
    underlineStyle: ViewPropTypes.style,
    onPressHandlerChangeTab: PropTypes.func,
  },

  getDefaultProps() {
    return {
      activeTextColor: 'navy',
      inactiveTextColor: 'black',
      backgroundColor: null,
    };
  },

  renderTabOption(name, page) {
  },

  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor, textStyle, backgroundTabActive, notificationContUnread } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'normal';
    const backgroundColorActive = isTabActive ? { backgroundColor: backgroundTabActive } : { backgroundColor: '#F1F1F1' };
    return <Button
      style={{ flex: 1, }}
      key={name}
      accessible={true}
      accessibilityLabel={name}
      accessibilityTraits='button'
      onPress={() => this.props.onPressHandlerChangeTab(page)}
    >
      <View style={[styles.tab, this.props.tabStyle, backgroundColorActive]}>
        <Text style={[{ color: textColor, fontWeight, }, textStyle,]}>
          {name}
        </Text>
      </View>

      {
        page === 1 && isTabActive && <Button onPress={() => this.props.displayNotifiPopup()} style={{
          position: "absolute", height: scaleSize(34), with: 80,
          right: scaleSize(10), justifyContent: "center", alignItems: "center"
        }} >
          <Image source={ICON.noti_bell} style={{ height: scaleSize(28), width: scaleSize(28) }} />
          <View style={{
            width: scaleSize(14), height: scaleSize(14), backgroundColor: "#EE2F24",
            position: "absolute", top: scaleSize(2), right: 0, borderRadius: scaleSize(7), justifyContent: "center", alignItems: "center"
          }} >
            <Text style={{ color: "#fff", fontSize: scaleSize(6), fontWeight: "600" }} >
              {`${notificationContUnread}`}
            </Text>
          </View>
        </Button>
      }


    </Button>;
  },

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    };

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, containerWidth / numberOfTabs],
    });
    return (
      <View style={[styles.tabs, { backgroundColor: '#F1F1F1', }, this.props.style,]}>
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}
        {/* <Animated.View
          style={[
            tabUnderlineStyle,
            {
              transform: [
                { translateX },
              ]
            },
            this.props.underlineStyle,
          ]}
        /> */}
      </View>
    );
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: scaleSize(5),
    borderRightWidth: 0.5,
    borderRightColor: '#404040'
  },
  tabs: {
    height: scaleSize(34),
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: scaleSize(1),
    borderBottomColor: '#0764B0'
  },
});

module.exports = HomeTabBar;
