'use strict';

import React, { Component } from 'react';
import {
    Dimensions,
    View,
    Text,
    Platform,
    TouchableOpacity
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import { scaleSzie } from '../utils';
import Modal from "./ModalCustom"

const { width } = Dimensions.get('window');

export default class DatePicker extends Component {

    setDate = (event, date) => {
        //console.log('----date : ', `${moment(date).format()}`);
        const temptDate = `${moment(date).format()}`;
        this.props.setDateSelected(temptDate);
    }

    render() {
        const { visible, onRequestClose,
            heightPicker, title, data, selectedValue, onValueChange,
            dateCalendar
        } = this.props;
        const height = heightPicker && heightPicker || scaleSzie(180);
        return (
            <Modal
                transparent={true}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                animationType={this.props.animationType || 'none'}
                style={{
                    justifyContent: 'flex-end'
                }}
            >
                <View style={{ width, height, backgroundColor: '#fff' }} >
                    <View style={{ alignItems: "center", paddingVertical: scaleSzie(12), }} >
                        <Text style={{ fontSize: scaleSzie(18), color: '#0764B0', fontWeight: '500' }} >
                            {title}
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={1} style={{ flex: 1, justifyContent: 'center' }} >
                        <DateTimePicker
                            value={new Date(dateCalendar)}
                            mode={'date'}
                            display="default"
                            onChange={this.setDate}
                        />
                    </TouchableOpacity>

                </View>
            </Modal>
        );
    }

}

