import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Platform
} from 'react-native';

import { Button, ModalCustom, ButtonCustom ,CalendarPicker} from '@components';
import { scaleSzie } from '@utils';
import IMAGE from '@resources';

const DATE = ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month', 'Customize Date'];

class PopupCalendar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onDateChange = (date) => {
    }

    render() {
        const { visible, onRequestClose } = this.props;
        return (
            <ModalCustom
                transparent={true}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{
                    justifyContent: 'flex-start', alignItems: 'flex-start',
                    backgroundColor: "transparent",
                    paddingTop: scaleSzie(155),
                    paddingLeft: scaleSzie(210)
                }}
            >
                <View style={styles.shadowP} >
                    <View style={{ paddingLeft: scaleSzie(10) }} >
                        <View style={[styles.triangle]} />
                    </View>

                    <View style={styles.container} >
                        <View style={{ width: scaleSzie(155), }} >
                            {
                                DATE.map((day, index) => <ItemDay
                                    key={index}
                                    title={day}
                                />)
                            }
                        </View>
                        <View style={{ flex: 1, paddingVertical: scaleSzie(8), }} >
                            <View style={{ flex: 1, backgroundColor: '#FAFAFA' }} >
                                <View style={{ flex: 1, flexDirection: 'row' }} >
                                    <View style={{ flex: 1, }} >
                                        <CalendarPicker
                                            onDateChange={this.onDateChange}
                                            width={scaleSzie(200)}
                                            height={scaleSzie(200)}
                                            dayShape="square"
                                            selectedDayColor="#317AE2"
                                            selectedDayTextColor="#FFFFFF"
                                        />

                                    </View>
                                    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }} >
                                        <CalendarPicker
                                            onDateChange={this.onDateChange}
                                            width={scaleSzie(200)}
                                            height={scaleSzie(200)}
                                            dayShape="square"
                                            selectedDayColor="#317AE2"
                                            selectedDayTextColor="#FFFFFF"
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
                                        height: scaleSzie(30),justifyContent:'center',paddingLeft:scaleSzie(8)
                                    }} >
                                        <Text style={{color:'#404040',fontSize:scaleSzie(12)}} >
                                        22/12/2018
                                        </Text>
                                    </View>
                                    <View style={{ height: scaleSzie(30), marginHorizontal: scaleSzie(10), justifyContent: 'center' }} >
                                        <Text style={{ fontSize: scaleSzie(18) }} >
                                            -
                                        </Text>
                                    </View>

                                    <View style={{
                                        width: scaleSzie(100), borderColor: '#317AE2', borderWidth: 1,
                                        height: scaleSzie(30),justifyContent:'center',paddingLeft:scaleSzie(8)
                                    }} >
                                        <Text style={{color:'#404040',fontSize:scaleSzie(12)}} >
                                        7/1/2019
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end',paddingRight:scaleSzie(10) }} >
                                        {/* -------- Button Apply ------ */}
                                        <ButtonCustom
                                            width={scaleSzie(100)}
                                            height={30}
                                            backgroundColor="#0764B0"
                                            title="Apply"
                                            textColor="#fff"
                                            onPress={this.searchCustomer}
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

const ItemDay = ({ title }) => {
    return (
        <View style={{
            height: scaleSzie(320 / 7),
            justifyContent: 'center', paddingLeft: scaleSzie(12)
        }} >
            <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                {title}
            </Text>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        width: scaleSzie(550),
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

