const React = require('react');
const { ViewPropTypes } = ReactNative = require('react-native');
const PropTypes = require('prop-types');
const createReactClass = require('create-react-class');
const {
  StyleSheet,
  Text,
  View,
  Animated,
} = ReactNative;
const Button = require('./Button');

import { scaleSize } from '../../utils';

const DefaultTabBar = createReactClass({
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
    const { activeTextColor, inactiveTextColor, textStyle, backgroundTabActive, isNotPress } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'normal';
    const backgroundColorActive = isTabActive ? { backgroundColor: backgroundTabActive } : {};
    return <Button
      style={{ flex: 1, }}
      key={name}
      accessible={true}
      accessibilityLabel={name}
      accessibilityTraits='button'
      activeOpacity={isNotPress ? 1 : 0.5}
      onPress={() => {
        if (!isNotPress) {
          return onPressHandler(page);
        }

      }}
    >
      <View style={[styles.tab, this.props.tabStyle, backgroundColorActive]}>
        <Text style={[{ color: textColor, fontWeight, }, textStyle,]}>
          {name}
        </Text>
      </View>
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

module.exports = DefaultTabBar;
