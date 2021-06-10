import React from 'react';
import { ViewPropTypes, StyleSheet, Text, View, Image } from 'react-native';

const PropTypes = require('prop-types');
const createReactClass = require('create-react-class');
const Button = require('./Button');
import LinearGradient from 'react-native-linear-gradient';

import ICON from '@resources';

const BAR_HEIGHT = scaleHeight(48);
const CONTENT_HEIGHT = scaleHeight(47);

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

  renderTab(name, page, isTabActive, onPressHandler) {
    const {
      activeTextColor,
      inactiveTextColor,
      textStyle,
      notificationContUnread,
    } = this.props;

    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'normal';

    return (
      <Button
        style={[
          styles.compressible,
          page > 0 && page < this.props.tabs.length - 1 && styles.middleTab,
        ]}
        key={`${name}_${page}`}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={() => onPressHandler(page)}
      >
        <LinearGradient
          colors={isTabActive ? ['#0872C9', '#0764B0'] : ['#FFFFFF', '#F1F1F1']}
          style={[styles.tab, isTabActive && styles.activeTab]}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: scaleWidth(12),
              justifyContent: 'center',
            }}
          >
            <Text
              style={[
                textStyle ?? styles.txtStyle,
                {
                  color: textColor,
                },
              ]}
            >
              {name}
            </Text>
          </View>
        </LinearGradient>

        {page === 1 && isTabActive && (
          <Button
            onPress={() => this.props.displayNotifiPopup()}
            style={{
              position: 'absolute',
              height: scaleHeight(34),
              with: scaleWidth(80),
              right: scaleWidth(10),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={ICON.noti_bell}
              style={{ height: scaleWidth(28), width: scaleHeight(28) }}
            />
            <View
              style={{
                width: scaleWidth(14),
                height: scaleHeight(14),
                backgroundColor: '#EE2F24',
                position: 'absolute',
                top: scaleHeight(2),
                right: 0,
                borderRadius: scaleHeight(7),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: scaleFont(6),
                  fontWeight: '600',
                }}
              >
                {`${notificationContUnread ?? '0'}`}
              </Text>
            </View>
          </Button>
        )}
      </Button>
    );
  },

  render() {
    const { renderLeftItem, renderRightItem } = this.props;
    return (
      <View style={styles.container}>
        {renderLeftItem && renderLeftItem()}
        <View style={[styles.tabContainer, styles.shadow]}>
          {this.props.tabs.map((name, page) => {
            const isTabActive = this.props.activeTab === page;
            const renderTab = this.props.renderTab || this.renderTab;
            return renderTab(name, page, isTabActive, this.props.goToPage);
          })}
        </View>
        {renderRightItem && renderRightItem()}
      </View>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    height: BAR_HEIGHT,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#EEEEEE',
    height: CONTENT_HEIGHT,
    flex: 1,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2,

    elevation: 3,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderRightWidth: 0.5,
    // borderRightColor: '#404040',
  },
  compressible: { flex: 1, backgroundColor: '#eaeaea' },

  activeTab: {
    position: 'absolute',
    height: BAR_HEIGHT,
    left: 0,
    top: 0,
    right: 0,
  },

  middleTab: {
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'transparent',
  },

  textStyle: {
    fontSize: scaleFont(23),
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
  },
});

module.exports = HomeTabBar;
