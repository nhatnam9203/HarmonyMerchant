import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSize, localize } from '../utils';

class PopupPairingCode extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title, visible, message, onRequestClose, language } =
      this.props;

    return (
      <PopupParent
        title={localize('PairingCode', language)}
        visible={visible}
        hideCloseButton={true}
      >
        <View
          style={{
            height: scaleSize(130),
            backgroundColor: '#fff',
            borderBottomLeftRadius: scaleSize(15),
            borderBottomRightRadius: scaleSize(15),
          }}
        >
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={{ color: '#404040', fontSize: scaleSize(18) }}>
              {message}
            </Text>
          </View>
          
        </View>
      </PopupParent>
    );
  }
}

export default PopupPairingCode;
