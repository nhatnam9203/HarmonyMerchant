import React from 'react';
import { View, TextInput, Image, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import _ from 'ramda';
import LinearGradient from 'react-native-linear-gradient';

import { ScrollableTabView } from '@components';
import styles from './style';
import ICON from '@resources';
import { scaleSize, localize } from '@utils';
import { OrderHome, OrderDetail } from './widget';

import OrderCheckout from '../OrderCheckout';

class Layout extends React.Component {
  render() {
    const { language } = this.props;

    return (
      <View style={styles.container}>
        <ScrollableTabView
          ref={this.scrollableTabViewRef}
          style={{ flex: 1 }}
          initialPage={0}
          locked={true}
          renderTabBar={() => <View />}
        >
          <OrderHome handleNewOrder={this.handleNewOrder} />
          <OrderDetail backOrderHome={this.backOrderHome} />
          <OrderCheckout />
        </ScrollableTabView>
      </View>
    );
  }
}

export default Layout;
