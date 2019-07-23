import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList
} from 'react-native';

import { Text, StatusBarHeader, Button, ParentContainer, ButtonCustom, Dropdown } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import {
    ItemInvoice
} from './widget';

export default class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={{
                height: scaleSzie(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: scaleSzie(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: scaleSzie(16), color: '#0764B0' }} >
                    {localize('Invoice', language)}
                </Text>
            </View>
        );
    }

    renderSearch() {
        const { language } = this.props;
        const { keySearch } = this.state;
        return (
            <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1, borderRadius: scaleSzie(4), flexDirection: 'row' }} >
                            <View style={{ flex: 1, paddingHorizontal: scaleSzie(12) }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(18) }}
                                    placeholder={`${localize('Invoice No / SKU number/Phone number / Customer Name', language)}`}
                                    value={keySearch}
                                    onChangeText={(keySearch) => {
                                        if (keySearch == '') {
                                            this.props.actions.customer.clearSearCustomer();
                                        }
                                        this.setState({ keySearch })
                                    }}
                                    onSubmitEditing={this.searchCustomer}
                                />
                            </View>
                            <Button onPress={this.searchCustomer} style={{ width: scaleSzie(35), alignItems: 'center', justifyContent: 'center' }} >
                                <Image source={IMAGE.search} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                            </Button>

                        </View>
                    </View>
                    <View style={{ width: scaleSzie(120), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Search', language)}
                            textColor="#6A6A6A"
                            onPress={this.searchCustomer}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: '500' }}
                        />
                    </View>
                    <View style={{ width: scaleSzie(120), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Scan SKU', language)}
                            textColor="#6A6A6A"
                            onPress={this.searchCustomer}
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
                    <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(18), color: '#6A6A6A' }} >
                            {localize('Filters', language)}
                        </Text>
                    </View>
                    {/* ------------- */}
                    <View style={{ width: scaleSzie(180) }} >
                        <Dropdown
                            label={localize('Time Range', language)}
                            data={[{ value: '' }, { value: 'Product' }, { value: 'Service' }]}
                            // value={category}
                            // onChangeText={(value) => this.updateSearchFilterInfo('category', value)}
                            containerStyle={{
                                backgroundColor: 'rgb(246,246,246)',
                                borderWidth: 1,
                                borderColor: '#C5C5C5',
                                flex: 1,
                                borderRadius: scaleSzie(4)
                            }}
                        />
                    </View>
                    {/* ------------- */}
                    <View style={{ width: scaleSzie(170), marginLeft: scaleSzie(16) }} >
                        <Dropdown
                            label={localize('Payment Method', language)}
                            data={[{ value: '' }, { value: 'Product' }, { value: 'Service' }]}
                            // value={category}
                            // onChangeText={(value) => this.updateSearchFilterInfo('category', value)}
                            containerStyle={{
                                backgroundColor: 'rgb(246,246,246)',
                                borderWidth: 1,
                                borderColor: '#C5C5C5',
                                flex: 1,
                                borderRadius: scaleSzie(4)
                            }}
                        />
                    </View>
                    {/* ------------- */}
                    <View style={{ width: scaleSzie(140), marginLeft: scaleSzie(16) }} >
                        <Dropdown
                            label={localize('Statuses', language)}
                            data={[{ value: '' }, { value: 'Product' }, { value: 'Service' }]}
                            // value={category}
                            // onChangeText={(value) => this.updateSearchFilterInfo('category', value)}
                            containerStyle={{
                                backgroundColor: 'rgb(246,246,246)',
                                borderWidth: 1,
                                borderColor: '#C5C5C5',
                                flex: 1,
                                borderRadius: scaleSzie(4)
                            }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderTable() {
        const { } = this.props;
        return (
            <View style={{ flex: 1, flexDirection: 'row' }} >
                {/* ---------- Left ------ */}
                <View style={{ flex: 1.4 }}>
                    <View style={{
                        paddingLeft: scaleSzie(12),
                        borderBottomColor: '#C5C5C5', borderBottomWidth: 1, paddingBottom: scaleSzie(6)
                    }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                            Invoice List
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} >
                        {/* ----- Item Invoice ----- */}
                        <ItemInvoice />
                        <ItemInvoice />
                        <ItemInvoice />
                    </View>
                </View>
                {/* ---------- Right ------ */}
                <View style={{ flex: 1, }}>
                    <View style={{
                        paddingLeft: scaleSzie(12),
                        borderBottomColor: '#C5C5C5', borderBottomWidth: 1, paddingBottom: scaleSzie(6)
                    }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                            Invoice Detail
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} >

                    </View>

                </View>
            </View>
        );
    }

    render() {
        const { language, stateCity } = this.props;
        const { visibleAdd, visibleDetail, visibleEdit } = this.state;
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
            >
                <View style={styles.container} >
                    <StatusBarHeader />
                    {this.renderHeader()}
                    <View style={{ height: scaleSzie(18) }} />
                    {this.renderSearch()}
                    <View style={{ height: scaleSzie(16) }} />
                    {this.renderFilter()}
                    <View style={{ height: scaleSzie(18) }} />
                    {this.renderTable()}

                    <Button onPress={this.openDrawer} style={{ position: 'absolute', top: 20, left: 0 }} >
                        <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>

                    <Button onPress={this.showLockScreen} style={{
                        position: 'absolute', top: 20, right: 0,
                        width: scaleSzie(34), height: scaleSzie(34), backgroundColor: '#0764B0', justifyContent: 'center', alignItems: 'center'
                    }} >
                        <Image source={IMAGE.arrowRight} style={{ width: scaleSzie(22), height: scaleSzie(17) }} />
                    </Button>
                </View>
            </ParentContainer>
        );
    }
}
