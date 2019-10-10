import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    Switch
} from 'react-native';

import { Text, StatusBarHeader, Button, ParentContainer, ButtonCustom, PopupCalendar } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { HeaderTableStaffSalary, RowTableStaffSalary, RowEmptyTableStaffSalary, RowFooterStaffSalary } from './widget';

export default class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={{
                height: scaleSzie(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: scaleSzie(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: scaleSzie(16), color: '#0764B0' }} >
                    {localize('Reports', language)}
                </Text>
            </View>
        );
    }

    renderFilter() {
        const { titleRangeTime } = this.state;
        const temptColorTextTimeRange = titleRangeTime === 'All time' ? 'rgb(155,155,155)' : 'rgb(38,38,38)';
        return (
            <View style={{ paddingHorizontal: scaleSzie(20), marginTop: scaleSzie(20), marginBottom: scaleSzie(10) }} >
                {/* ---------- Row 1 ---------- */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={IMAGE.sale} style={{ width: scaleSzie(26), height: scaleSzie(32) }} />
                    <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(22), fontWeight: '700', marginLeft: scaleSzie(8) }} >
                        Compare sales of Staffs
                    </Text>
                </View>
                {/* ---------- Row 2 ---------- */}
                <View style={{ flexDirection: 'row', marginTop: scaleSzie(16), alignItems: 'center' }}>
                    <Text style={{ fontSize: scaleSzie(18), color: '#6A6A6A', marginRight: scaleSzie(10) }} >
                        Filters
                    </Text>

                    <Button onPress={this.showCalendar} style={{ width: scaleSzie(200) }} >
                        <View style={[{ height: scaleSzie(40), width: '90%', flexDirection: 'row' }, styles.borderStyle]} >
                            <View style={{ alignItems: 'center', flexDirection: 'row' }} >
                                <Text style={{ color: temptColorTextTimeRange, fontSize: scaleSzie(15), marginLeft: scaleSzie(10) }} >
                                    {titleRangeTime}
                                </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(6) }} >
                                <Image source={IMAGE.dropdown} style={{ width: scaleSzie(6), height: scaleSzie(3) }} />
                            </View>
                        </View>
                    </Button>
                    {/* ----- Btn Search ---- */}
                    <View style={{ width: scaleSzie(120), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={'Search'}
                            textColor="#6A6A6A"
                            onPress={this.searchStaff}
                            style={{
                                borderWidth: 1, borderColor: '#C5C5C5',
                                backgroundColor: '#0764B0'
                            }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: '500', color: '#fff' }}
                        />
                    </View>
                </View>
                {/* ---------- Row 3 ---------- */}
                <View style={{ flexDirection: 'row', marginTop: scaleSzie(22), alignItems: 'center' }}>
                    <Text style={{ fontSize: scaleSzie(18), color: '#6A6A6A', marginRight: scaleSzie(16) }} >
                        Graph Chart
                    </Text>
                    <Switch
                        ios_backgroundColor="#0764B0"
                        trackColor={{ false: '', true: '#0764B0' }}
                        style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                        value={this.state.valueSwitch}
                        onValueChange={this.onValueChangeSwich}
                    />
                    <Text style={{ fontSize: scaleSzie(18), color: '#6A6A6A', marginLeft: scaleSzie(16) }} >
                        Grid View
                    </Text>
                </View>
            </View>
        );
    }

    renderTable() {
        const { listStaffsSalary, refreshListStaffsSalary } = this.props;
        return (
            <View style={{ flex: 1 }} >
                <HeaderTableStaffSalary />
                <FlatList
                    data={listStaffsSalary}
                    renderItem={({ item, index }) => <RowTableStaffSalary
                        staff={item}
                        index={index + 1}
                    />}
                    keyExtractor={(item, index) => `${item.staffId}`}
                    ListEmptyComponent={<RowEmptyTableStaffSalary />}
                    refreshing={refreshListStaffsSalary}
                    onRefresh={() => this.props.actions.staff.getListStaffsSalaryTop(false)}
                />
                <RowFooterStaffSalary
                    data={listStaffsSalary}
                />
            </View>
        );
    }

    renderFooterTable() {
        return (
            <View style={{ height: scaleSzie(45), backgroundColor: '#E5E5E5' }} >

            </View>
        );
    }

    render() {
        const { isFocus, visibleCalendar } = this.state;
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
                activeScreen={isFocus}
            >
                <View style={styles.container} >
                    <StatusBarHeader />
                    {this.renderHeader()}
                    {this.renderFilter()}
                    {this.renderTable()}
                    <Button onPress={this.openDrawer} style={{ position: 'absolute', top: 20, left: 0 }} >
                        <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>
                </View>
                <PopupCalendar
                    ref={this.modalCalendarRef}
                    visible={visibleCalendar}
                    onRequestClose={() => this.setState({ visibleCalendar: false })}
                    changeTitleTimeRange={this.changeTitleTimeRange}
                />
            </ParentContainer>
        );
    }
}
