import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
} from 'react-native';

import { scaleSzie, localize, getCategoryName, getArrayNameCategories } from '@utils';
import { Text, Button, ButtonCustom, Dropdown, PopupConfirm, PopupAddEditService } from '@components';
import styles from './style';
import IMAGE from '@resources';
import { ItemSettle, HeaderTableSettle } from './widget';

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
                            <Text style={{ fontSize: scaleSzie(18), color: '#6A6A6A' }} >
                                {localize('Search', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1, borderRadius: scaleSzie(4), flexDirection: 'row' }} >
                            <View style={{ flex: 1, paddingHorizontal: scaleSzie(12) }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(18) }}
                                    placeholder={localize('Invoice No / SKU number/customer phone number', language)}
                                    value={keySearch}
                                    onChangeText={(value) => {
                                        if (value === '') {
                                            this.props.actions.extra.clearSearchExtra();
                                        }
                                        this.updateSearchFilterInfo('keySearch', value)
                                    }}
                                    onSubmitEditing={this.searchExtra}
                                />
                            </View>
                            <Button onPress={this.searchExtra} style={{ width: scaleSzie(35), alignItems: 'center', justifyContent: 'center' }} >
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
                            onPress={this.searchExtra}
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
        const { searchFilter, titleRangeTime } = this.state;
        const { paymentMethod, status } = searchFilter;
        const temptColorTextTimeRange = titleRangeTime === 'Time Range' ? 'rgb(155,155,155)' : 'rgb(38,38,38)';
        return (
            <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(18), color: '#6A6A6A' }} >
                            {localize('Filters', language)}
                        </Text>
                    </View>
                    {/* ------------- */}
                    <Button onPress={this.showCalendar} style={{ width: scaleSzie(220) }} >
                        <View style={[{ height: scaleSzie(40), width: '90%', flexDirection: 'row' }, styles.borderStyle]} >
                            <View style={{ alignItems: 'center', flexDirection: 'row' }} >
                                <Text style={{ color: temptColorTextTimeRange, fontSize: scaleSzie(15), marginLeft: scaleSzie(10) }} >
                                    {localize('Time range', language)}
                                </Text>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(6) }} >
                                <Image source={IMAGE.dropdown} style={{ width: scaleSzie(6), height: scaleSzie(3) }} />
                            </View>
                        </View>
                    </Button>
                </View>
            </View>
        );
    }

    renderLeftContent() {
        return (
            <View style={{ flex: 1, paddingRight: scaleSzie(10) }} >
                <View style={{ flex: 1 }} >
                    <HeaderTableSettle />
                    <View style={{ height: scaleSzie(5) }} />
                    <View style={styles.tableLeft} >
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={[0, 1, 2, 3, 4, 5]}
                            renderItem={({ item, index }) => <ItemSettle />}
                        />

                    </View>
                    <View style={{ height: scaleSzie(6) }} />
                </View>
            </View>
        );
    }

    renderRightContent() {
        return (
            <View style={{ flex: 1, paddingLeft: scaleSzie(10) }} >
                {/* ---------- Header -------- */}
                <View style={{ flexDirection: 'row', height: scaleSzie(30) }} >
                    <View style={{ flex: 0.7, justifyContent: 'flex-end' }} >
                        <Text style={[styles.textTitleLefConten, { marginLeft: scaleSzie(10) }]} >
                            Settlement
                        </Text>
                    </View>
                </View>
                {/* ---------- Line -------- */}
                <View style={{ height: scaleSzie(5) }} />
                {/* ---------- Table -------- */}
                <View style={[styles.tableLeft, { paddingHorizontal: scaleSzie(18) }]} >
                    <View style={{ height: scaleSzie(45), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(16) }} >
                            Transactions:
                        </Text>
                        <Text style={{ color: '#404040', fontSize: scaleSzie(22), fontWeight: 'bold' }} >
                            24
                        </Text>
                    </View>
                    {/* ------------ BOX ------------ */}
                    <View style={[styles.tableLeft, { padding: scaleSzie(10) }]} >
                        {/* ---------- Row 1 -------- */}
                        <View style={styles.rowBox} >
                            <Text style={styles.textLeftBox} >
                                Payment by Harmony account
                            </Text>
                            <Text style={styles.textRightBox} >
                                $ 1000
                            </Text>
                        </View>
                        {/* ---------- Row 2 -------- */}
                        <View style={styles.rowBox} >
                            <Text style={styles.textLeftBox} >
                                Payment by Credit card
                            </Text>
                            <Text style={styles.textRightBox} >
                                $ 1300
                            </Text>
                        </View>
                        {/* -------- Box Child ------- */}
                        <View style={styles.boxChild} >
                            {/* ---------- Row child 1 -------- */}
                            <View style={styles.rowBoxChild} >
                                <Image source={IMAGE.visaLogo} style={styles.boxChildLogo} />
                                <Text style={styles.textBoxChild} >
                                    $ 1300
                                </Text>
                            </View>
                            {/* ---------- Row child 2 -------- */}
                            <View style={styles.rowBoxChild} >
                                <Image source={IMAGE.masterCardLogo} style={styles.boxChildLogo} />
                                <Text style={styles.textBoxChild} >
                                    $ 1300
                                </Text>
                            </View>
                            {/* ---------- Row child 3 -------- */}
                            <View style={styles.rowBoxChild} >
                                <Image source={IMAGE.discoverLogo} style={styles.boxChildLogo} />
                                <Text style={styles.textBoxChild} >
                                    $ 1300
                                </Text>
                            </View>
                        </View>
                        {/* ---------- Row 3 -------- */}
                        <View style={styles.rowBox} >
                            <Text style={styles.textLeftBox} >
                                Payment by Credit card
                            </Text>
                            <Text style={styles.textRightBox} >
                                $ 1300
                            </Text>
                        </View>
                        {/* ---------- Row 4 -------- */}
                        <View style={styles.rowBox} >
                            <Text style={styles.textLeftBox} >
                                Payment by Credit card
                            </Text>
                            <Text style={styles.textRightBox} >
                                $ 1300
                            </Text>
                        </View>
                    </View>
                    <View style={{ height: scaleSzie(70), justifyContent: 'center' }} >
                        <View style={{
                            height: scaleSzie(40), backgroundColor: '#307FBF', flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scaleSzie(10)
                        }} >
                            <Text style={{ color: '#fff', fontSize: scaleSzie(14) }} >
                                Payment by Credit card
                        </Text>
                            <Text style={{ color: '#fff', fontSize: scaleSzie(20), fontWeight: 'bold' }} >
                                $ 1300
                        </Text>
                        </View>
                    </View>
                </View>
                {/* ---------- Btn Log Detail -------- */}
                <View style={{ height: scaleSzie(6) }} />
                <View style={[styles.btnLogDetail, { flexDirection: 'row' }]} >
                    <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14) }} >
                        View Log Detail
                    </Text>
                    <Image source={IMAGE.arrowLogDetail} />
                </View>
                <View style={{ height: scaleSzie(6) }} />
            </View>
        );
    }

    renderContent() {
        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    {this.renderLeftContent()}
                    {this.renderRightContent()}
                </View>
            </View>
        );
    }


    render() {
        return (
            <View style={styles.container} >
                {this.renderSearch()}
                <View style={{ height: scaleSzie(10) }} />
                {this.renderFilter()}
                <View style={{ height: scaleSzie(6) }} />
                {this.renderContent()}
            </View>
        );
    }

}

export default Layout;

