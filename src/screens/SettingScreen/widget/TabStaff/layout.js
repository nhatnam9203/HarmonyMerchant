import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text, Button, ButtonCustom, Dropdown, PopupConfirm } from '@components';
import styles from './style';
import IMAGE from '@resources';
import { HeaderTableStaff, RowTableStaff, AddStaff, RowTableEmptyStaff } from './widget';

class Layout extends React.Component {

    renderSearch() {
        const { language } = this.props;
        const { searchFilter } = this.state;
        const { keySearch } = searchFilter;
        return (
            <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                            <Text style={{ fontSize: scaleSzie(18), color: '#C5C5C5' }} >
                                {localize('Search', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1, borderRadius: scaleSzie(4), flexDirection: 'row' }} >
                            <View style={{ flex: 1, paddingHorizontal: scaleSzie(12) }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(18) }}
                                    placeholder={localize('Staff Name', language)}
                                    value={keySearch}
                                    onChangeText={(value) => {
                                        if (value === '') {
                                            this.props.actions.staff.clearSearch();
                                        }
                                        this.updateSearchFilterInfo('keySearch', value)
                                    }}
                                    onSubmitEditing={this.searchStaff}
                                />
                            </View>
                            <Button onPress={this.searchStaff} style={{ width: scaleSzie(35), alignItems: 'center', justifyContent: 'center' }} >
                                <Image source={IMAGE.search} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                            </Button>

                        </View>
                    </View>
                    <View style={{ width: scaleSzie(170), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Search', language)}
                            textColor="#C5C5C5"
                            onPress={this.searchStaff}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: '500' }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderFilter() {
        const { language } = this.props;
        const { searchFilter } = this.state;
        const { role, status } = searchFilter;
        return (
            <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                            <Text style={{ fontSize: scaleSzie(18), color: '#C5C5C5' }} >
                                {localize('Filters', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ width: scaleSzie(120) }} >
                                <Dropdown
                                    label={localize('Role', language)}
                                    data={[{ value: '' }, { value: 'Admin' }, { value: 'Staff' }]}
                                    value={role}
                                    onChangeText={(value) => this.updateSearchFilterInfo('role', value)}
                                    containerStyle={{
                                        backgroundColor: 'rgb(246,246,246)',
                                        borderWidth: 1,
                                        borderColor: '#C5C5C5',
                                        flex: 1,
                                        borderRadius: scaleSzie(4)
                                    }}
                                />
                            </View>
                            <View style={{ width: scaleSzie(12) }} />
                            <View style={{ width: scaleSzie(120) }} >
                                <Dropdown
                                    label={localize('Statuses', language)}
                                    data={[{ value: '' }, { value: 'Active' }, { value: 'Disable' }]}
                                    value={status}
                                    onChangeText={(value) => this.updateSearchFilterInfo('status', value)}
                                    containerStyle={{
                                        backgroundColor: '#F1F1F1',
                                        borderWidth: 1,
                                        borderColor: '#C5C5C5',
                                        flex: 1,
                                        borderRadius: scaleSzie(4)
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ width: scaleSzie(170), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Add New', language)}
                            textColor="#C5C5C5"
                            onPress={this.addStaff}
                            style={{
                                borderWidth: 1, borderColor: '#C5C5C5',
                                backgroundColor: '#0764B0'
                            }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: '500', color: '#fff' }}
                        />
                    </View>
                </View>
            </View>
        );
    }


    renderTableStaff() {
        const { listStaffByMerchant, isShowSearch, listSearchStaff, refreshListStaffs } = this.props;
        const { visibleArchive, visibleRestore } = this.state;
        const temptData = isShowSearch ? listSearchStaff : listStaffByMerchant
        return (
            <View style={styles.container} >
                {this.renderSearch()}
                <View style={{ height: scaleSzie(10) }} />
                {this.renderFilter()}
                <View style={{ height: scaleSzie(10) }} />
                <View style={{ flex: 1 }} >
                    <HeaderTableStaff />
                    <FlatList
                        data={temptData}
                        renderItem={({ item, index }) => <RowTableStaff
                            index={index}
                            staff={item}
                            archiveStaff={() => this.archiveStaff(item)}
                            editStaff={() => this.editStaff(item)}
                            restoreStaff={() => this.restoreStaff(item)}
                        />}
                        keyExtractor={(item, index) => `${index}`}
                        ListEmptyComponent={<RowTableEmptyStaff />}
                        onRefresh={() => this.props.actions.staff.getStaffByMerchantId(false)}
                        refreshing={refreshListStaffs}
                    />
                </View>
                <PopupConfirm
                    visible={visibleArchive}
                    title="Confirmation"
                    message="Do you want to Archive this Staff ?"
                    onRequestClose={() => this.togglePopupArchive(false)}
                    confimYes={() => this.archirveStaffYess()}
                />
                <PopupConfirm
                    visible={visibleRestore}
                    title="Confirmation"
                    message="Do you want to Restore this Staff ?"
                    onRequestClose={() => this.togglePopupRestore(false)}
                    confimYes={() => this.archirveRestoreYess()}
                />
            </View>
        );
    }

    render() {
        const { isAddStaff, language, stateCity } = this.props;
        const { isEditStaff, staffHandle } = this.state
        return (
            <View style={{ flex: 1 }} >
                {
                    isAddStaff ? <AddStaff
                        stateCity={stateCity}
                        language={language}
                        infoStaffHandle={staffHandle}
                        isEditStaff={isEditStaff}
                        addStaff={this.submitAddStaff}
                        editStaff={this.submitEditStaff}
                    /> : this.renderTableStaff()
                }
            </View>
        );
    }

}

export default Layout;

