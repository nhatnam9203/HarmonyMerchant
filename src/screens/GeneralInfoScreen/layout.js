import React from 'react';
import { View, ScrollView, Dimensions, Image } from 'react-native';

import {
  InputForm,
  FormInfoParent,
  Text,
  InputFormPhone,
  TextInputSuggestion,
  Button,
} from '@components';
import { scaleSize, localize } from '@utils';
import ICON from '@resources';

const { width } = Dimensions.get('window');

export default class Layout extends React.Component {
  render() {
    const { language } = this.props;
    const {
      generalInfo,
      isDBAAddress,
      dynamicMarginBottomBA,
      dynamicMarginBottomDA,
    } = this.state;
    const {
      businessName,
      doingBusiness,
      tax,
      businessAddress,
      businessPhone,
      email,
      firstName,
      lastName,
      position,
      contactPhone,
      dbaAddress,
    } = generalInfo;
    const { prefix, suffix } = tax;
    const { address, city, state, zip } = businessAddress;
    const {
      address: addressDBA,
      city: cityDBA,
      state: stateDBA,
      zip: zipDBA,
    } = dbaAddress;

    const temptIconCheck = isDBAAddress ? ICON.checkBox : ICON.checkBoxEmpty;

    return (
      <FormInfoParent
        back={() => this.props.navigation.goBack()}
        next={this.nextTab}
      >
        <ScrollView
          ref={this.srollGeneralRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {/* ------ Header ------ */}
          <View
            style={{
              width,
              paddingHorizontal: scaleSize(15),
              marginTop: scaleSize(8),
            }}
          >
            <Text
              style={{
                color: '#0764B0',
                fontWeight: 'bold',
                fontSize: scaleSize(18),
              }}
            >
              {localize('Please fill the form below', language)}
            </Text>
            <View
              style={{
                height: scaleSize(38),
                backgroundColor: '#0764B0',
                justifyContent: 'center',
                paddingLeft: scaleSize(5),
                marginTop: scaleSize(5),
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: scaleSize(18),
                }}
              >
                {localize('General Information', language)}
              </Text>
            </View>
          </View>
          {/* ------------------------- */}
          <View style={{ flex: 1, paddingHorizontal: scaleSize(25) }}>
            <View style={{ height: scaleSize(16) }} />
            <InputForm
              title={`${localize('Legal Business Name', language)}* `}
              subTitle={``}
              placeholder={`${localize('Legal Business Name', language)}*`}
              value={businessName}
              onChangeText={(value) =>
                this.updateGeneralInfo('businessName', value)
              }
              onFocus={() => this.scrollGeneralTo(85)}
            />
            <InputForm
              title={`${localize('Doing Business As', language)}*(DBA)`}
              subTitle=""
              placeholder="DBA"
              value={doingBusiness}
              onChangeText={(value) =>
                this.updateGeneralInfo('doingBusiness', value)
              }
              onFocus={() => this.scrollGeneralTo(160)}
            />

            <Text
              style={[
                {
                  color: '#404040',
                  fontSize: scaleSize(14),
                  fontWeight: '600',
                  marginBottom: scaleSize(5),
                },
              ]}
            >
              {'Federal Tax ID*'}
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: scaleSize(24) }}>
              <View style={{ width: scaleSize(100) }}>
                <InputForm
                  subTitle=""
                  placeholder=""
                  value={prefix}
                  onChangeText={(value) =>
                    this.updateGeneralInfo('prefix', value, 'tax')
                  }
                  keyboardType="numeric"
                  onFocus={() => this.scrollGeneralTo(240)}
                  style={{ marginBottom: 0 }}
                  styleBoxInput={{ marginTop: 0 }}
                  maxLength={2}
                />
              </View>
              <View
                style={{
                  width: scaleSize(20),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: scaleSize(20) }}>-</Text>
              </View>
              <View style={{ width: scaleSize(250) }}>
                <InputForm
                  subTitle=""
                  placeholder=""
                  value={suffix}
                  onChangeText={(value) =>
                    this.updateGeneralInfo('suffix', value, 'tax')
                  }
                  keyboardType="numeric"
                  onFocus={() => this.scrollGeneralTo(240)}
                  style={{ marginBottom: 0 }}
                  styleBoxInput={{ marginTop: 0 }}
                  maxLength={7}
                />
              </View>
            </View>

            {/* ---------------  Business Address --------------- */}
            <InputForm
              title={`${localize('Business Address', language)}*`}
              subTitle="(no P.O. Boxes)"
              placeholder={localize('Street Address', language)}
              style={{
                marginBottom: scaleSize(10),
              }}
              value={address}
              onChangeText={(value) =>
                this.updateGeneralInfo('address', value, 'businessAddress')
              }
              onFocus={() => this.scrollGeneralTo(310)}
            />

            <View
              style={{
                height: scaleSize(30),
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginBottom: scaleSize(dynamicMarginBottomBA),
              }}
            >
              <View style={{ width: scaleSize(180) }}>
                <InputForm
                  title=""
                  subTitle=""
                  placeholder={localize('City', language)}
                  style={{
                    marginBottom: 0,
                  }}
                  value={city}
                  onChangeText={(value) =>
                    this.updateGeneralInfo('city', value, 'businessAddress')
                  }
                  onFocus={() => this.scrollGeneralTo(310)}
                />
              </View>
              <View style={{ width: scaleSize(180), height: '100%' }}>
                <TextInputSuggestion
                  value={state}
                  onChangeText={(value, count) => {
                    this.updateGeneralInfo('state', value, 'businessAddress');
                    this.setState({
                      dynamicMarginBottomBA: count * 24,
                    });
                  }}
                  resetMarginState={() =>
                    this.setState({ dynamicMarginBottomBA: 24 })
                  }
                  onFocus={() => this.scrollGeneralTo(310)}
                />
              </View>
              <View style={{ width: scaleSize(180) }}>
                <InputForm
                  title=""
                  subTitle=""
                  placeholder="Zip Code"
                  style={{
                    marginBottom: 0,
                  }}
                  value={zip}
                  onChangeText={(value) =>
                    this.updateGeneralInfo('zip', value, 'businessAddress')
                  }
                  // keyboardType="numeric"
                  // maxLength={10}
                  //isOnlyNumber={true}
                  onFocus={() => this.scrollGeneralTo(310)}
                />
              </View>
            </View>

            {/* ---------------  DBA Address --------------- */}
            <View style={{ flexDirection: 'row', marginTop: scaleSize(10) }}>
              <Text
                style={[
                  {
                    color: '#404040',
                    fontSize: scaleSize(14),
                    fontWeight: '600',
                  },
                ]}
              >
                {`DBA Address*`}
              </Text>
              <Button
                onPress={this.toggleDBAAddress}
                style={{
                  marginLeft: scaleSize(15),
                  marginRight: scaleSize(5),
                }}
              >
                <Image source={temptIconCheck} />
              </Button>

              <Text style={[{ color: '#404040', fontSize: scaleSize(12) }]}>
                {`Same as Business Address`}
              </Text>
            </View>

            <InputForm
              title={null}
              subTitle={null}
              placeholder={localize('Street Address', language)}
              style={{
                marginBottom: scaleSize(10),
              }}
              value={addressDBA}
              onChangeText={(value) =>
                this.updateGeneralInfo('address', value, 'dbaAddress')
              }
              onFocus={() => this.scrollGeneralTo(425)}
              editable={!isDBAAddress}
            />
            <View
              style={{
                height: scaleSize(30),
                marginBottom: scaleSize(dynamicMarginBottomDA),
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}
            >
              <View style={{ width: scaleSize(180) }}>
                <InputForm
                  title=""
                  subTitle=""
                  placeholder={localize('City', language)}
                  style={{
                    marginBottom: 0,
                  }}
                  value={cityDBA}
                  onChangeText={(value) =>
                    this.updateGeneralInfo('city', value, 'dbaAddress')
                  }
                  onFocus={() => this.scrollGeneralTo(425)}
                  editable={!isDBAAddress}
                />
              </View>
              <View style={{ width: scaleSize(180), height: '100%' }}>
                <TextInputSuggestion
                  value={stateDBA}
                  onChangeText={(value, count) => {
                    this.updateGeneralInfo('state', value, 'dbaAddress');
                    this.setState({
                      dynamicMarginBottomDA: count * 24,
                    });
                  }}
                  resetMarginState={() =>
                    this.setState({ dynamicMarginBottomDA: 24 })
                  }
                  onFocus={() => this.scrollGeneralTo(425)}
                  editable={!isDBAAddress}
                />
              </View>
              <View style={{ width: scaleSize(180) }}>
                <InputForm
                  title=""
                  subTitle=""
                  placeholder="Zip Code"
                  style={{
                    marginBottom: 0,
                  }}
                  value={zipDBA}
                  onChangeText={(value) =>
                    this.updateGeneralInfo('zip', value, 'dbaAddress')
                  }
                  maxLength={10}
                  // keyboardType="numeric"
                  //isOnlyNumber={true}
                  onFocus={() => this.scrollGeneralTo(425)}
                  editable={!isDBAAddress}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginTop: scaleSize(10) }}>
              <View style={{ flex: 1 }}>
                <InputFormPhone
                  ref={this.businessPhoneRef}
                  title={`${localize('Business Phone', language)}*`}
                  subTitle=""
                  placeholder=""
                  value={businessPhone}
                  onChangeText={(value) =>
                    this.updateGeneralInfo('businessPhone', value)
                  }
                  keyboardType="numeric"
                  onFocus={() => this.scrollGeneralTo(560)}
                />
              </View>
              <View style={{ flex: 1 }} />
            </View>

            <InputForm
              title={`${localize('Contact Email Address', language)}*`}
              subTitle=""
              placeholder="example@gmail.com"
              value={email}
              onChangeText={(value) => this.updateGeneralInfo('email', value)}
              onFocus={() => this.scrollGeneralTo(515 + 120)}
            />

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <InputForm
                  title={`${localize('Contact Name', language)}*`}
                  subTitle=""
                  placeholder={localize('First Name', language)}
                  value={firstName}
                  onChangeText={(value) =>
                    this.updateGeneralInfo('firstName', value)
                  }
                  onFocus={() => this.scrollGeneralTo(590 + 120)}
                />
              </View>
              <View style={{ flex: 1, paddingLeft: scaleSize(20) }}>
                <InputForm
                  title="   "
                  subTitle=""
                  placeholder={localize('Last Name', language)}
                  value={lastName}
                  onChangeText={(value) =>
                    this.updateGeneralInfo('lastName', value)
                  }
                  onFocus={() => this.scrollGeneralTo(590 + 120)}
                />
              </View>
            </View>
            <InputForm
              title={`${localize('Title/Position', language)}*`}
              subTitle=""
              placeholder="President/Manager/Owner"
              value={position}
              onChangeText={(value) =>
                this.updateGeneralInfo('position', value)
              }
              onFocus={() => this.scrollGeneralTo(665 + 120)}
            />

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <InputFormPhone
                  ref={this.contactPhoneRef}
                  title={`${localize('Contact Phone Number', language)}*`}
                  subTitle=""
                  placeholder=""
                  value={contactPhone}
                  onChangeText={(value) =>
                    this.updateGeneralInfo('contactPhone', value)
                  }
                  keyboardType="numeric"
                  onFocus={() => this.scrollGeneralTo(665 + 120)}
                />
              </View>
              <View style={{ flex: 1 }} />
            </View>
          </View>
          <View style={{ height: scaleSize(350) }} />
        </ScrollView>
      </FormInfoParent>
    );
  }
}
