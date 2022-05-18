import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { ButtonCustom, Text } from '@components';
import { ButtonGradient } from '@shared/components';
import { scaleSize, localize, formatNumberFromCurrency } from '@utils';
import IMAGE from '@resources';
import connectRedux from '@redux/ConnectRedux';

class Layout extends React.Component {
  render() {
    const { isSubmitTax, profile } = this.props;
    const { serviceTAX, productTAX } = this.state;
    const { type } = profile || {};

    const renderItemSetupByTypeMerchant = () => {
      switch (type) {
        case Constants.APP_TYPE.RETAILER:
          return (
            <ItemSetup
              title={'Product Tax (%) :'}
              placeholder={'10'}
              value={productTAX}
              onChangeText={this.onChangeProductTax}
            />
          );
        case Constants.APP_TYPE.POS:
        default:
          return (
            <>
              <ItemSetup
                title={'Service Tax (%) :'}
                placeholder={'10'}
                value={serviceTAX}
                onChangeText={this.onChangeServiceTax}
              />

              <ItemSetup
                title={'Product Tax (%) :'}
                placeholder={'10'}
                value={productTAX}
                onChangeText={this.onChangeProductTax}
              />
            </>
          );
      }
    };
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: scaleSize(14),
          paddingTop: scaleSize(20),
        }}
      >
        <Text
          style={{
            fontSize: scaleSize(16),
            fontWeight: '600',
            color: '#0764B0',
          }}
        >
          {`Tax Settings`}
        </Text>
        <ScrollView keyboardShouldPersistTaps="always">
          {renderItemSetupByTypeMerchant()}
          <View style={{ height: scaleSize(300) }} />
        </ScrollView>
        {/* ------- Footer -------- */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            justifyContent: 'flex-end',
            paddingBottom: scaleSize(30),
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {
              <ButtonGradient
                label={'Save'.toUpperCase()}
                width={scaleWidth(400)}
                height={scaleHeight(60)}
                fontSize={scaleFont(25)}
                textColor={'#fff'}
                fontWeight="500"
                disable={!isSubmitTax}
                onPress={this.setupTAX}
              />
            }
          </View>
        </View>
      </View>
    );
  }
}

const ItemSetup = ({ title, value, placeholder, onChangeText }) => {
  return (
    <View style={{ flexDirection: 'row', marginTop: scaleSize(20) }}>
      <View style={{ width: scaleSize(140), justifyContent: 'center' }}>
        <Text style={{ fontSize: scaleSize(14), color: 'rgb(42,42,42)' }}>
          {title}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: scaleSize(35),
            width: '50%',
            borderColor: 'rgb(227,227,227)',
            borderWidth: scaleSize(1),
            paddingHorizontal: scaleSize(10),
          }}
        >
          <TextInputMask
            type={'money'}
            options={{
              precision: 2,
              separator: '.',
              delimiter: ',',
              unit: '',
              suffixUnit: '',
            }}
            style={{ flex: 1, fontSize: scaleSize(14) }}
            placeholder={placeholder}
            value={value}
            onChangeText={(value) => onChangeText(value)}
            keyboardType="numeric"
            // type="only-numbers"
          />
        </View>
      </View>
    </View>
  );
};

export default Layout;
