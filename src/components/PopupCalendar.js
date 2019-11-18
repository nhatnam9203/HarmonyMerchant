import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Platform
} from 'react-native';
import moment from 'moment';

import Button from './Button';
import ModalCustom from './ModalCustom';
import ButtonCustom from './ButtonCustom';
import CalendarPicker from './react-native-calendar-picker';
import { scaleSzie } from '@utils';

const DATE = ['Select', 'Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month', 'Customize Date'];

class PopupCalendar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: ``,
            endDate: ``,
            isCustomizeDate: false,
            quickFilter: false
        }
    }

    onDateStartChange = (date) => {
        const { day, month, year } = date._i;
        const temptMonth = parseInt(month + 1);
        const temptDay = parseInt(day);
        const addZeroToMonth = temptMonth < 10 ? `0${temptMonth}` : temptMonth;
        const addZeroToDay = temptDay < 10 ? `0${temptDay}` : temptDay
        this.setState({
            startDate: `${year}-${addZeroToMonth}-${addZeroToDay}`
        })
    }

    onDateEndChange = (date) => {
        const { day, month, year } = date._i;
        const temptMonth = parseInt(month + 1);
        const temptDay = parseInt(day);
        const addZeroToMonth = temptMonth < 10 ? `0${temptMonth}` : temptMonth;
        const addZeroToDay = temptDay < 10 ? `0${temptDay}` : temptDay
        this.setState({
            endDate: `${year}-${addZeroToMonth}-${addZeroToDay}`
        })
    }

    applyCustomDay = async () => {
        const { startDate, endDate } = this.state;
        const temptstartDate = new Date(startDate).getTime();
        const temptEndDate = new Date(endDate).getTime();
        const isBefore = parseInt(temptstartDate) < parseInt(temptEndDate) ? true : false
        if (isBefore) {
            this.props.changeTitleTimeRange('Customize Date');
            await this.setState({
                isCustomizeDate: true,
                quickFilter: 'Customize Date'
            });
        } else {
            alert('The end date must be greater than the start date')
        }
    }

    selectQuickFilter = (quickFilter) => {
        if (quickFilter === 'Customize Date') {
            const { startDate, endDate } = this.state;
            const temptstartDate = new Date(startDate).getTime();
            const temptEndDate = new Date(endDate).getTime();
            const isBefore = parseInt(temptstartDate) < parseInt(temptEndDate) ? true : false;
            if (isBefore) {
                this.props.changeTitleTimeRange(quickFilter);
                this.setState({
                    quickFilter,
                    isCustomizeDate: true
                });
            } else {
                alert('The end date must be greater than the start date')
            }
            // } else if (quickFilter === 'Select') {
            //     this.props.changeTitleTimeRange('Time Range');
            //     this.setState({
            //         quickFilter: false,
            //         isCustomizeDate: false,
            //         startDate: '',
            //         endDate: ''
            //     });
        } else {
            this.props.changeTitleTimeRange(quickFilter);
            this.setState({
                quickFilter,
                isCustomizeDate: false
            });
        }
    }


    render() {
        const { visible, onRequestClose, type } = this.props;
        const { quickFilter, startDate, endDate } = this.state;
        const temptPaddingTop = this.props.paddingTop ? this.props.paddingTop : 155;
        const date = type === 'report' ? DATE.filter((item) => item !== 'Select') : DATE
        return (
            <ModalCustom
                transparent={true}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{
                    justifyContent: 'flex-start', alignItems: 'flex-start',
                    backgroundColor: "transparent",
                    paddingTop: scaleSzie(temptPaddingTop),
                    paddingLeft: scaleSzie(160)
                }}
            >
                <View style={styles.shadowP} >
                    <View style={{ paddingLeft: scaleSzie(10) }} >
                        <View style={[styles.triangle]} />
                    </View>

                    <View style={styles.container} >
                        <View style={{ width: scaleSzie(120), }} >

                            {

                                date.map((day, index) => {
                                    const temptColorText = day === quickFilter ? '#0764B0' : '#404040';

                                    return <ItemDay
                                        key={index}
                                        title={day}
                                        index={index}
                                        onPress={this.selectQuickFilter}
                                        colorText={temptColorText}
                                    />
                                })
                            }
                        </View>
                        <View style={{ flex: 1, paddingVertical: scaleSzie(8), }} >
                            <View style={{ flex: 1, backgroundColor: '#FAFAFA' }} >
                                <View style={{ flex: 1, flexDirection: 'row' }} >
                                    <View style={{ flex: 1, }} >
                                        <CalendarPicker
                                            onDateChange={this.onDateStartChange}
                                            width={scaleSzie(250)}
                                            height={scaleSzie(250)}
                                            dayShape="square"
                                            todayTextStyle={{ color: 'red', fontWeight: 'bold' }}
                                            todayBackgroundColor="transparent"
                                            selectedDayColor="#317AE2"
                                            selectedDayTextColor="#FFFFFF"
                                            selectedStartDate={startDate}

                                        />

                                    </View>
                                    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }} >
                                        <CalendarPicker
                                            onDateChange={this.onDateEndChange}
                                            width={scaleSzie(250)}
                                            height={scaleSzie(250)}
                                            dayShape="square"
                                            todayTextStyle={{ color: 'red', fontWeight: 'bold' }}
                                            todayBackgroundColor="transparent"
                                            selectedDayColor="#317AE2"
                                            selectedDayTextColor="#FFFFFF"
                                            selectedStartDate={endDate}
                                        />

                                    </View>
                                </View>
                                {/* --------- Footer ------- */}
                                <View style={{
                                    height: scaleSzie(45), flexDirection: 'row',
                                    paddingLeft: scaleSzie(10)
                                }} >
                                    <View style={{
                                        width: scaleSzie(100), borderColor: '#317AE2', borderWidth: 1,
                                        height: scaleSzie(30), justifyContent: 'center', paddingLeft: scaleSzie(8)
                                    }} >
                                        <Text style={{ color: '#404040', fontSize: scaleSzie(12) }} >
                                            {this.state.startDate}
                                        </Text>
                                    </View>
                                    <View style={{ height: scaleSzie(30), marginHorizontal: scaleSzie(10), justifyContent: 'center' }} >
                                        <Text style={{ fontSize: scaleSzie(18) }} >
                                            -
                                        </Text>
                                    </View>

                                    <View style={{
                                        width: scaleSzie(100), borderColor: '#317AE2', borderWidth: 1,
                                        height: scaleSzie(30), justifyContent: 'center', paddingLeft: scaleSzie(8)
                                    }} >
                                        <Text style={{ color: '#404040', fontSize: scaleSzie(12) }} >
                                            {this.state.endDate}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: scaleSzie(10) }} >
                                        {/* -------- Button Apply ------ */}
                                        <ButtonCustom
                                            width={scaleSzie(100)}
                                            height={30}
                                            backgroundColor="#0764B0"
                                            title="Apply"
                                            textColor="#fff"
                                            onPress={this.applyCustomDay}
                                            style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 4 }}
                                            styleText={{ fontSize: scaleSzie(15), fontWeight: '500' }}
                                        />
                                    </View>

                                </View>
                            </View>
                        </View>
                    </View>
                </View>

            </ModalCustom>

        );
    }
}

const ItemDay = ({ title, index, onPress, colorText }) => {
    return (
        <Button onPress={() => onPress(title)} style={{
            // height: scaleSzie(320 / 7),
            flex: 1,
            justifyContent: 'center', paddingLeft: scaleSzie(12)
        }} >
            <Text style={{ color: colorText, fontSize: scaleSzie(13) }} >
                {title}
            </Text>
        </Button>

    );
}

const styles = StyleSheet.create({
    container: {
        width: scaleSzie(600),
        height: scaleSzie(320),
        backgroundColor: '#fff',
        borderRadius: 8,
        flexDirection: 'row'
    },
    shadowP: {
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0, 0, 0,0.3)',
                shadowOffset: { width: 1, height: 0 },
                shadowOpacity: 1,

            },

            android: {
                elevation: 2,
            },
        })
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 20,
        borderRightWidth: 20,
        borderBottomWidth: 25,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#fff',
    }
})

export default PopupCalendar;

