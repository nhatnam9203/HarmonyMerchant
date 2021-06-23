import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Keyboard,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _, { isEmpty } from 'ramda';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { Dropdown } from './react-native-material-dropdown';
import connectRedux from '@redux/ConnectRedux';
import { ScaleSzie, formatWithMoment } from '../utils';
import ICON from '@resources';
import Button from './Button';

const INIT_STATE = {
  staffId: '',
  name: '',
  tip: 0.0,
  price: 0.0,
  bookingServiceId: '',
  serviceIdLocal: '',
  appointmentIdChangeStylist: -1,
  note: '',
  extras: [],
};

class PopupChangeStylist extends React.Component {
  constructor(props) {
    super(props);
    this.state = INIT_STATE;
    this.scrollRef = React.createRef();
  }

  componentDidMount() {
    // this.keyboardWillHide = Keyboard.addListener('keyboardWillHide', this.handleKeyboardWillHide);
  }

  handleKeyboardWillHide = async () => {
    if (this.scrollRef.current) {
      this.scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  checkIsSelected = (arrSelectedExtra, extra) => {
    let isExit = false;
    for (let i = 0; i < arrSelectedExtra.length; i++) {
      if (arrSelectedExtra[i]?.data?.extraId === extra?.extraId) {
        isExit = true;
        break;
      }
    }

    return isExit;
  };

  setStateFromParent = async (service, appointmentId) => {
    const { servicesByMerchant } = this.props;
    const staff = service?.staff || {};
    const extras = [];
    const arrSelectedExtra = service?.extras || [];

    for (let i = 0; i < servicesByMerchant.length; i++) {
      if (servicesByMerchant[i]?.serviceId === service?.data?.serviceId) {
        const extrasByMerchant = servicesByMerchant[i]?.extras || [];
        for (let j = 0; j < extrasByMerchant.length; j++) {
          extras.push({
            ...extrasByMerchant[j],
            isSelect: this.checkIsSelected(
              arrSelectedExtra,
              extrasByMerchant[j]
            ),
          });
        }
        break;
      }
    }

    await this.setState({
      extras: [...extras],
      staffId: staff?.staffId || '',
      name: staff?.displayName || '',
      bookingServiceId: service?.data?.bookingServiceId || '',
      tip: staff?.tip || 0.0,
      serviceIdLocal: service?.data?.serviceId || '',
      appointmentIdChangeStylist: appointmentId,
      price: service?.data?.price || 0.0,
      note: service?.note || '',
    });
  };

  getStaffDataDropdown(staffs) {
    const { groupAppointment } = this.props;
    const { appointmentIdChangeStylist } = this.state;
    let fromTime = new Date();

    if (!_.isEmpty(groupAppointment)) {
      const appointments = groupAppointment.appointments
        ? groupAppointment.appointments
        : [];
      const appointmentDetail = appointments.find(
        (appointment) =>
          appointment.appointmentId === appointmentIdChangeStylist
      );
      fromTime =
        appointmentDetail && appointmentDetail.fromTime
          ? appointmentDetail.fromTime
          : new Date();
    }
    const data = [];
    const dayNameOfWeek = formatWithMoment(fromTime, 'dddd');

    for (let i = 0; i < staffs.length; i++) {
      if (
        staffs[i].isDisabled === 0 &&
        staffs[i].isActive &&
        staffs[i].workingTimes[dayNameOfWeek].isCheck
      ) {
        data.push({
          staffId: staffs[i].staffId,
          value: `${staffs[i].displayName}`,
        });
      }
    }
    return data;
  }

  changeStylist = async (name, id) => {
    await this.setState({
      staffId: id,
      name,
    });
  };

  submitChangeStylist = () => {
    const {
      staffId,
      bookingServiceId,
      tip,
      serviceIdLocal,
      appointmentIdChangeStylist,
      price,
      note,
      extras,
    } = this.state;
    const { groupAppointment } = this.props;
    if (_.isEmpty(groupAppointment)) {
      this.props.changeStylistBasketLocal(serviceIdLocal, staffId, tip, price);
    } else {
      const tempExtras = [];
      for (let extra of extras) {
        if (extra?.isSelect) {
          tempExtras.push(extra?.extraId);
        }
      }
      this.props.actions.marketing.changeStylist(
        staffId,
        bookingServiceId,
        tip,
        appointmentIdChangeStylist,
        price,
        tempExtras,
        0,
        note,
        true
      );
    }
    this.props.onRequestClose();
  };

  onFocusToScroll = (number) => () => {
    this.scrollRef.current.scrollTo({
      x: 0,
      y: ScaleSzie(number),
      animated: true,
    });
  };

  onRequestClose = async () => {
    await this.setState(INIT_STATE);
    this.props.onRequestClose();
  };

  selectExtra = (extra) => {
    const { extras } = this.state;
    const tempExtra = [...extras];
    for (let i = 0; i < tempExtra.length; i++) {
      if (tempExtra[i]?.extraId === extra?.extraId) {
        tempExtra[i]['isSelect'] = !tempExtra[i]?.isSelect;
        break;
      }
    }
    this.setState({
      extras: tempExtra,
    });
  };

  // --------------- Render -----------

  render() {
    const { title, visible, listStaffByMerchant, confimYes } = this.props;
    const { name, tip, price, note, extras } = this.state;
    const dataDropdown = this.getStaffDataDropdown(listStaffByMerchant);
    return (
      <PopupParent
        title={title}
        visible={visible}
        onRequestClose={this.onRequestClose}
        width={440}
        styleTitle={{ fontSize: ScaleSzie(20), fontWeight: '600' }}
      >
        <View
          style={{
            height: ScaleSzie(420),
            backgroundColor: '#fff',
            borderBottomLeftRadius: ScaleSzie(15),
            borderBottomRightRadius: ScaleSzie(15),
            paddingHorizontal: ScaleSzie(30),
          }}
        >
          <View style={{ flex: 1 }}>
            <ScrollView
              ref={this.scrollRef}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
            >
              <TouchableOpacity activeOpacity={1}>
                <View style={{ height: ScaleSzie(20) }} />
                <Text style={[styles.txt_title]}>{`Staff`}</Text>
                {/* ------- Dropdown -------- */}
                <View
                  style={{ height: ScaleSzie(40), marginBottom: ScaleSzie(10) }}
                >
                  <Dropdown
                    label="Name"
                    data={dataDropdown}
                    value={name}
                    onChangeText={(value, index) =>
                      this.changeStylist(value, dataDropdown[index].staffId)
                    }
                    containerStyle={{
                      backgroundColor: '#fff',
                      borderWidth: 1,
                      borderColor: '#C5C5C5',
                      flex: 1,
                    }}
                    fontSize={ScaleSzie(20)}
                    // extraHeight={ScaleSzie(90)}
                  />
                </View>
                {/* ------- Price -------- */}
                <Text style={[styles.txt_title]}>{`Price ($)`}</Text>
                {/* ------- Box Price -------- */}
                <View
                  style={{
                    height: ScaleSzie(40),
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: '#C5C5C5',
                    paddingHorizontal: ScaleSzie(10),
                    marginBottom: ScaleSzie(10),
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
                    style={{
                      flex: 1,
                      fontSize: ScaleSzie(16),
                      color: '#6A6A6A',
                    }}
                    value={price}
                    onChangeText={(price) => this.setState({ price })}
                    onFocus={this.onFocusToScroll(110)}
                  />
                </View>
                {/* ------- Tip -------- */}
                <Text style={[styles.txt_title]}>{`Tip ($)`}</Text>
                {/* ------- Box Tip -------- */}
                <View
                  style={{
                    height: ScaleSzie(40),
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: '#C5C5C5',
                    paddingHorizontal: ScaleSzie(10),
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
                    style={{
                      flex: 1,
                      fontSize: ScaleSzie(16),
                      color: '#6A6A6A',
                    }}
                    value={tip}
                    onChangeText={(tip) => this.setState({ tip })}
                    onFocus={this.onFocusToScroll(185)}
                  />
                </View>

                {/* ----------- Extra ----------- */}
                {!isEmpty(extras) && (
                  <Text
                    style={[styles.txt_title, { marginTop: ScaleSzie(10) }]}
                  >
                    {`Extra`}
                  </Text>
                )}

                {extras?.map((extra, index) => (
                  <ExtraItem
                    key={`${extra?.extraId}_${index}`}
                    extra={extra}
                    selectExtra={this.selectExtra}
                  />
                ))}

                {/* ------- Note -------- */}
                <Text style={[styles.txt_title, { marginTop: ScaleSzie(10) }]}>
                  {`Note`}
                </Text>
                <View
                  style={{
                    height: ScaleSzie(70),
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: '#C5C5C5',
                    paddingHorizontal: ScaleSzie(10),
                  }}
                >
                  <TextInput
                    style={{
                      flex: 1,
                      fontSize: ScaleSzie(16),
                      color: '#6A6A6A',
                    }}
                    multiline={true}
                    value={note}
                    onChangeText={(note) => this.setState({ note })}
                    onFocus={this.onFocusToScroll(400)}
                  />
                </View>

                {/* ------- Button -------- */}
                {/* <View style={{ marginTop: ScaleSzie(20), alignItems: 'center', backgroundColor: "red" }} >  */}

                {/* </View> */}
                <View style={{ height: ScaleSzie(250) }} />
              </TouchableOpacity>
            </ScrollView>
          </View>

          <ButtonCustom
            width={ScaleSzie(140)}
            height={38}
            backgroundColor="#0764B0"
            title="SUBMIT"
            textColor="#fff"
            onPress={this.submitChangeStylist}
            style={{
              borderWidth: 1,
              borderColor: '#C5C5C5',
              borderRadius: 4,
              position: 'absolute',
              bottom: ScaleSzie(15),
              marginLeft: ScaleSzie((440 - 140) / 2),
            }}
            styleText={{ fontWeight: '600', fontSize: ScaleSzie(14) }}
          />
        </View>
      </PopupParent>
    );
  }

  componentWillUnmount() {
    this.keyboardWillHide?.remove();
  }
}

const ExtraItem = ({ extra, selectExtra }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: ScaleSzie(10),
        alignItems: 'center',
      }}
    >
      <Button
        onPress={() => selectExtra(extra)}
        style={{ width: ScaleSzie(18), height: ScaleSzie(18) }}
      >
        <Image
          source={extra?.isSelect ? ICON.checkBox : ICON.checkBoxEmpty}
          style={{ width: ScaleSzie(18), height: ScaleSzie(18) }}
        />
      </Button>

      <View
        style={{
          width: ScaleSzie(36),
          height: ScaleSzie(36),
          marginLeft: ScaleSzie(14),
          marginRight: ScaleSzie(10),
        }}
      >
        {extra?.imageUrl ? (
          <Image
            source={{ uri: extra?.imageUrl }}
            style={{ width: ScaleSzie(36), height: ScaleSzie(36) }}
          />
        ) : (
          <Image
            source={ICON.extra_holder}
            style={{ width: ScaleSzie(36), height: ScaleSzie(36) }}
          />
        )}
      </View>
      <Text
        style={{
          flex: 1,
          color: '#404040',
          fontWeight: '600',
          fontSize: ScaleSzie(14),
        }}
      >
        {extra?.name}
      </Text>
      <View style={{ width: 10 }} />
      <View
        style={{
          width: ScaleSzie(100),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          numberOfLines={2}
          style={{
            color: '#404040',
            fontSize: ScaleSzie(12),
            fontWeight: '300',
          }}
        >
          {`15 min`}
        </Text>

        <Text
          style={{
            color: '#404040',
            fontSize: ScaleSzie(12),
            fontWeight: '600',
          }}
        >
          {`$ ${extra?.price || `0.00`}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  txt_title: {
    color: '#404040',
    fontSize: ScaleSzie(15),
    fontWeight: '500',
    marginBottom: ScaleSzie(8),
    marginTop: ScaleSzie(8),
  },
});

const mapStateToProps = (state) => ({
  listStaffByMerchant: state.staff.listStaffByMerchant,
  groupAppointment: state.appointment.groupAppointment,
  servicesByMerchant: state.service.servicesByMerchant,
});

export default connectRedux(mapStateToProps, PopupChangeStylist);
