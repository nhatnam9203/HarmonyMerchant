import React from 'react';
import {
    View,
    Image,
    TextInput
} from 'react-native';

import { Text, StatusBarHeader, Button, ParentContainer, ButtonCustom } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import {HeaderTableProducts} from './widget';

export default class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={{
                height: scaleSzie(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: scaleSzie(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: scaleSzie(16), color: '#0764B0' }} >
                    {localize('Inventory', language)}
                </Text>
            </View>
        );
    }

    renderSearch() {
        const { language } = this.props;
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
                                    placeholder={`${localize('SKU Number', language)}/ ${localize('Product Name', language)}`}
                                />
                            </View>
                            <Button onPress={() => { }} style={{ width: scaleSzie(35), alignItems: 'center', justifyContent: 'center' }} >
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
                            onPress={() => { }}
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
                        <View style={{
                            flexDirection: 'row', alignItems: 'flex-end', marginRight: scaleSzie(10),
                            paddingBottom: scaleSzie(2)
                        }} >
                            <Image source={IMAGE.checkBox} style={{ marginBottom: scaleSzie(4) }} />
                            <Text style={{
                                fontSize: scaleSzie(16), color: '#0764B0',
                                marginLeft: scaleSzie(10)
                            }} >
                                {localize('Select All', language)}
                            </Text>
                        </View>

                        <View style={[{
                            width: scaleSzie(90), justifyContent: 'center', alignItems: 'center',
                            marginRight: scaleSzie(14)
                        }, styles.borderStyle]} >
                            <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(15) }} >

                                {localize('Restock', language)}
                            </Text>
                        </View>
                        <View style={[{ width: scaleSzie(160), flexDirection: 'row', }, styles.borderStyle]} >
                            <View style={{ alignItems: 'center', flexDirection: 'row' }} >
                                <Image source={IMAGE.export} style={{
                                    width: scaleSzie(22), height: scaleSzie(22),
                                    marginHorizontal: scaleSzie(8)
                                }} />
                                <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(15) }} >

                                    {localize('Export', language)}
                                </Text>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(10) }} >
                                <Image source={IMAGE.dropdown} style={{ width: scaleSzie(12), height: scaleSzie(6) }} />
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-end' }} >
                            <View style={[{ width: scaleSzie(160), flexDirection: 'row', }, styles.borderStyle]} >
                                <View style={{ alignItems: 'center', flexDirection: 'row', paddingLeft: scaleSzie(10) }} >
                                    <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(15) }} >
                                        {localize('Cteategories', language)}
                                    </Text>
                                </View>

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(10) }} >
                                    <Image source={IMAGE.dropdown} style={{ width: scaleSzie(12), height: scaleSzie(6) }} />
                                </View>
                            </View>
                        </View>

                    </View>
                    <View style={{ width: scaleSzie(170), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Scan SKU', language)}
                            textColor="#6A6A6A"
                            onPress={() => { }}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: '500' }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderTable() {
        return (
            <View style={{ flex: 1, paddingTop: scaleSzie(20) }} >
                <HeaderTableProducts />
            </View>
        );
    }

    render() {
        const { language } = this.props;
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
            >
                <View style={styles.container} >
                    <StatusBarHeader />
                    {this.renderHeader()}
                    <View style={{ height: scaleSzie(18) }} />
                    {this.renderSearch()}
                    <View style={{ height: scaleSzie(10) }} />
                    {this.renderFilter()}
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
