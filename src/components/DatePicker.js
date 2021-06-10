'use strict';

import React, { Component } from 'react';
import { Dimensions, View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import { scaleSize } from '../utils';
import Modal from './ModalCustom';
import Button from './Button';
import connectRedux from '@redux/ConnectRedux';

const { width } = Dimensions.get('window');

class DatePicker extends Component {
  setDate = (event, date) => {
    const temptDate = `${moment(date).format()}`;
    this.props.setDateSelected(temptDate);
  };

  render() {
    const {
      visible,
      onRequestClose,
      heightPicker,
      title,
      dateCalendar,
      loading,
    } = this.props;
    const height = heightPicker ? heightPicker : scaleSize(180);

    const tempVisible = loading ? false : visible;

    return (
      <Modal
        transparent={true}
        visible={tempVisible}
        //onRequestClose={() => onRequestClose()}
        animationType={this.props.animationType || 'none'}
        style={{
          justifyContent: 'flex-end',
        }}
      >
        <View style={{ width, height, backgroundColor: '#fff' }}>
          <View
            style={{ alignItems: 'center', paddingVertical: scaleSize(12) }}
          >
            <Text
              style={{
                fontSize: scaleSize(18),
                color: '#0764B0',
                fontWeight: '500',
              }}
            >
              {title}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <DateTimePicker
              value={new Date(dateCalendar)}
              mode={'date'}
              display="default"
              onChange={this.setDate}
              style={{ width: '100%', height: '100%', color: '#000' }}
            />
          </TouchableOpacity>

          {/* ----------- Done ------------  */}
          <Button
            onPress={() => onRequestClose()}
            style={{
              width: scaleSize(60),
              height: scaleSize(40),
              position: 'absolute',
              top: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: scaleSize(14),
                color: '#0764B0',
                fontWeight: 'bold',
              }}
            >
              {`Done`}
            </Text>
          </Button>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.app.loading,
});

export default connectRedux(mapStateToProps, DatePicker);
