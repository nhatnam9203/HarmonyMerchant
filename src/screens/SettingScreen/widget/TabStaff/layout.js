import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text, Button, ButtonCustom, Dropdown } from '@components';
import styles from './style';
import IMAGE from '@resources';
import { HeaderTableStaff, RowTableStaff, AddStaff } from './widget';

class Layout extends React.Component {

    renderSearch() {
        const { language } = this.props;
        const { keySearch } = this.state;
        return (
            <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                            <Text style={{ fontSize: scaleSzie(18), color: '#6A6A6A' }} >
                                {localize('Search', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1, borderRadius: scaleSzie(4), flexDirection: 'row' }} >
                            <View style={{ flex: 1, paddingHorizontal: scaleSzie(12) }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(18) }}
                                    placeholder={localize('Staff Name', language)}
                                    value={keySearch}
                                    onChangeText={(value) => this.setState({ keySearch: value })}
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
                            textColor="#6A6A6A"
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
        return (
            <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                            <Text style={{ fontSize: scaleSzie(18), color: '#6A6A6A' }} >
                                {localize('Filters', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ width: scaleSzie(120) }} >
                                <Dropdown
                                    label={localize('Role', language)}
                                    data={[{ value: 'Admin' }, { value: 'Member' }, { value: 'Staff' }]}
                                    // value={state}
                                    // onChangeText={(value) => this.updateGeneralInfo('state', value, 'businessAddress')}
                                    containerStyle={{
                                        backgroundColor: 'rgb(246,246,246)',
                                        borderWidth: 1,
                                        borderColor: '#6A6A6A',
                                        flex: 1,
                                        borderRadius: scaleSzie(4)
                                    }}
                                />
                            </View>
                            <View style={{ width: scaleSzie(12) }} />
                            <View style={{ width: scaleSzie(120) }} >
                                <Dropdown
                                    label={localize('Statuses', language)}
                                    data={[{ value: '1' }, { value: '2' }, { value: 3 }, { value: '4' }]}
                                    // value={state}
                                    // onChangeText={(value) => this.updateGeneralInfo('state', value, 'businessAddress')}
                                    containerStyle={{
                                        backgroundColor: '#F1F1F1',
                                        borderWidth: 1,
                                        borderColor: '#6A6A6A',
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
                            textColor="#6A6A6A"
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
        const { listStaffByMerchant } = this.props;
        return (
            <View style={styles.container} >
                {this.renderSearch()}
                <View style={{ height: scaleSzie(10) }} />
                {this.renderFilter()}
                <View style={{ height: scaleSzie(10) }} />
                <View style={{ flex: 1 }} >
                    <HeaderTableStaff />
                    <FlatList
                        data={listStaffByMerchant}
                        renderItem={({ item, index }) => <RowTableStaff
                            index={index}
                            staff={item}
                            archiveStaff={() => this.archiveStaff(item)}
                            editStaff={() => this.editStaff(item)}
                            restoreStaff={() => this.restoreStaff(item)}
                        />}
                        keyExtractor={(item, index) => `${index}`}
                    />
                </View>
            </View>
        );
    }

    render() {
        const { isAddStaff } = this.props;
        if (isAddStaff) {
            return <AddStaff />
        }
        return this.renderTableStaff();

    }

}

export default Layout;

