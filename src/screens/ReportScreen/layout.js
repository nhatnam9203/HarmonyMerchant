import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    Switch
} from 'react-native';

import { Text, StatusBarHeader, Button, ParentContainer, ButtonCustom } from '@components';
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

                    <Button onPress={() => { }} style={{ width: scaleSzie(200) }} >
                        <View style={[{ height: scaleSzie(40), width: '90%', flexDirection: 'row' }, styles.borderStyle]} >
                            <View style={{ alignItems: 'center', flexDirection: 'row' }} >
                                <Text style={{ color: 'rgb(155,155,155)', fontSize: scaleSzie(15), marginLeft: scaleSzie(10) }} >
                                    All time
                                </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(6) }} >
                                <Image source={IMAGE.dropdown} style={{ width: scaleSzie(6), height: scaleSzie(3) }} />
                            </View>
                        </View>
                    </Button>
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
        const { listStaffsSalary } = this.props;
        return (
            <View style={{ flex: 1 }} >
                <HeaderTableStaffSalary />
                <FlatList
                    data={listStaffsSalary}
                    renderItem={({ item, index }) => <RowTableStaffSalary
                        staff={item}
                        index={index+1}
                    />}
                    keyExtractor={(item, index) => `${item.staffId}`}
                    ListEmptyComponent={<RowEmptyTableStaffSalary />}
                />
                <RowFooterStaffSalary />
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
        const { isFocus } = this.state;
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
            </ParentContainer>
        );
    }
}
