import React from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSzie } from '../utils';
import KeyboardNumeric from "./KeyboardNumeric";
import connectRedux from '@redux/ConnectRedux';

class PopupCheckStaffPermission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      customStyle: {},
      appointmentId: '',
      isBlock: false,
    };
  }

  setStateFromParent = async (
    value = '',
    appointmentId = '',
    isBlock = false,
  ) => {
    await this.setState({
      value,
      appointmentId,
      isBlock,
    });
  };

  onChangeValue = (number) => {
    if (number === ".") return;
    let { value } = this.state;
    if (number === "x") {
      value = value.substring(0, value.length - 1);
    } else {
      if (value.toString().length < 4) {
        value += number;
      }
    }
    this.setState({ value })
  }

  submitPin = () => {
    const { profile, tabName } = this.props;
    const { value, appointmentId, isBlock } = this.state;
    if (value.length === 4) {
      this.props.actions.auth.checkStaffPermission(
        profile.merchantCode,
        value,
        tabName,
        appointmentId,
        isBlock,
      );
    } else {
      Alert.alert(`PIN must be 4 digits.`);
    }
  };

  onRequestClose = async () => {
    await this.setState({
      value: '',
    });
    this.props.onRequestClose();
  };

  render() {
    const {
      title,
      isLoadingCheckStaffPermission,
      visiblePopupCheckStaffPermission,
      hideCloseButton,
      tabName,
    } = this.props;
    const { value, customStyle, appointmentId } = this.state;
    return (
      <PopupParent
        title={`${title}`}
        visible={visiblePopupCheckStaffPermission}
        onRequestClose={this.onRequestClose}
        hideCloseButton={hideCloseButton}
        style={customStyle}
      >
        <View
          style={{
            minHeight: scaleSzie(460),
            maxHeight: scaleSzie(530),
            backgroundColor: '#fff',
            borderBottomLeftRadius: scaleSzie(15),
            borderBottomRightRadius: scaleSzie(15),
          }}
        >
          <View
            style={{
              alignItems: 'center',
              marginTop: scaleSzie(18),
              marginBottom: scaleSzie(4),
            }}
          >
            <Text style={{ color: '#404040', fontSize: scaleSzie(18), fontWeight: '500', marginTop: scaleSzie(5) }}>
              {'Please enter the authorized PIN number'}
            </Text>
          </View>
          <View
            style={{ flex: 1, marginVertical: scaleSzie(15), alignItems: 'center' }}
          >
            <View
              style={{
                width: '90%',
                height: scaleSzie(45),
                borderColor: '#dddddd',
                borderWidth: 2,
              }}
            >
              <TextInputMask
                type="only-numbers"
                style={{
                  flex: 1,
                  fontSize: scaleSzie(18),
                  textAlign: 'center',
                  padding: 0,
                  margin: 0,
                }}
                placeholder="Your PIN"
                keyboardType="numeric"
                maxLength={4}
                value={value}
                onChangeText={(value) => this.setState({ value })}
                onSubmitEditing={this.submitPin}
                secureTextEntry={true}
                editable={false}
                showSoftInputOnFocus={false}
              />
            </View>
            <KeyboardNumeric onPress={this.onChangeValue} />
          </View>
          <View
            style={{
              height: scaleSzie(45),
              alignItems: 'center',
              marginBottom : scaleSzie(15)
            }}
          >
            {isLoadingCheckStaffPermission ? (
              <View
                style={{
                  width: '35%',
                  height: scaleSzie(40),
                  backgroundColor: '#0764B0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : (
                <ButtonCustom
                  width={'35%'}
                  height={40}
                  backgroundColor="#0764B0"
                  title="SUBMIT"
                  textColor="#fff"
                  onPress={this.submitPin}
                  styleText={{
                    fontSize: scaleSzie(14),
                  }}
                  style={{
                    borderRadius: scaleSzie(4),
                  }}
                />
              )}
          </View>
        </View>
      </PopupParent>
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener?.remove();
    this.keyboardDidHideListener?.remove();
  }
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  isLoadingCheckStaffPermission: state.auth.isLoadingCheckStaffPermission,
  profile: state.dataLocal.profile,
});

export default connectRedux(mapStateToProps, PopupCheckStaffPermission);

