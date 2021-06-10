import React from 'react';
import { View, Text } from 'react-native';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSize, localize } from '../utils';

class PopupLogout extends React.Component {
  constructor(props) {
    super(props);
    this.onConfirmYes = this.onConfirmYes.bind(this);
  }

  onConfirmYes() {
    const { onRequestClose, confimYes } = this.props;
    if (onRequestClose && typeof onRequestClose === 'function') {
      onRequestClose();
    }

    if (confimYes && typeof confimYes === 'function') {
      confimYes();
    }
  }

  render() {
    const { title, visible, message, onRequestClose, confimYes, language } =
      this.props;

    return (
      <PopupParent
        title={title}
        visible={visible}
        onRequestClose={() => onRequestClose()}
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
          <View
            style={{
              height: scaleSize(45),
              flexDirection: 'row',
            }}
          >
            <View style={{ flex: 1, alignItems: 'center' }}>
              <ButtonCustom
                width={'60%'}
                height={35}
                backgroundColor="#fff"
                title={localize('CANCEL', language)}
                textColor="#6A6A6A"
                onPress={() => onRequestClose()}
                style={{
                  borderWidth: 1,
                  borderColor: '#C5C5C5',
                }}
                styleText={{
                  fontSize: scaleSize(14),
                }}
              />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <ButtonCustom
                width={'60%'}
                height={35}
                backgroundColor="#EC1818"
                title={localize('LOG OUT', language)}
                textColor="#fff"
                onPress={this.onConfirmYes}
                styleText={{
                  fontSize: scaleSize(14),
                }}
              />
            </View>
          </View>
        </View>
      </PopupParent>
    );
  }
}

export default PopupLogout;
