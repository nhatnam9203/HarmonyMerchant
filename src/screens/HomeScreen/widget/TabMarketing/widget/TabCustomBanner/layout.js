import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList,
    TextInput,
    Platform
} from 'react-native';

import { ScaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { Text, Button, ButtonCustom, PopupConfirm,ScrollableTabView } from '@components';
import { ItemBanner } from './widget';

class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={styles.header} >
                <View style={{
                    flex: 1, justifyContent: 'flex-end',
                    paddingLeft: ScaleSzie(15), paddingBottom: ScaleSzie(10)
                }} >
                    <Text style={{ color: '#404040', fontSize: ScaleSzie(20) }} >
                        {localize('Media List', language)}
                    </Text>
                </View>
                <View style={{
                    flex: 0.8,
                    paddingBottom: ScaleSzie(10), justifyContent: 'flex-end'
                }} >
                    <Text style={{ color: '#404040', fontSize: ScaleSzie(20) }} >
                        {localize('Create new media', language)}
                    </Text>
                </View>
            </View>
        );
    }

    renderLeftContent() {
        const { listBanners, refreshBannerList } = this.props;
        return (
            <View style={styles.leftContent} >
                <FlatList
                    data={listBanners}
                    renderItem={({ item, index }) => <ItemBanner
                        banner={item}
                        deleteBanner={this.deleteBanner}
                    />}
                    keyExtractor={(item, index) => `${index}`}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshBannerList}
                    onRefresh={this.onRefreshBannerList}
                />
            </View>
        );
    }

    renderUploadBannerLocal() {
        const { language } = this.props;
        const { bannerUpload } = this.state;
        return (
            <View style={{ flex: 1 }} >
                <View style={{ flex: 1, paddingTop: ScaleSzie(40) }} >
                    {
                        bannerUpload.uri !== '' ?
                            // --------- avatar upload -----
                            <View>
                                <View style={{
                                    height: ScaleSzie(140), width: ScaleSzie(220),
                                    marginLeft: ScaleSzie(40), marginTop: ScaleSzie(12)
                                }} >
                                    <Image
                                        source={{ uri: bannerUpload.uri }}
                                        style={{ height: ScaleSzie(140), width: ScaleSzie(220), }}
                                        resizeMode="stretch"
                                    />
                                </View>
                                {/* -------- Btn Cancel ------ */}
                                <View style={{ paddingLeft: ScaleSzie(80), marginTop: ScaleSzie(20) }} >
                                    <ButtonCustom
                                        width={ScaleSzie(140)}
                                        height={40}
                                        backgroundColor="#F1F1F1"
                                        title={localize('Cancel', language)}
                                        textColor="#C5C5C5"
                                        onPress={this.cancelUploadBannerLocal}
                                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                                        styleText={{ fontSize: ScaleSzie(16), fontWeight: '500' }}
                                    />
                                </View>

                            </View>

                            :
                            <View style={{
                                width: ScaleSzie(300), height: ScaleSzie(240),
                                borderWidth: 2, borderColor: '#C5C5C5',
                                borderStyle: "dashed",
                                borderRadius: ScaleSzie(14),
                                alignItems: 'center',
                                paddingTop: ScaleSzie(30)

                            }} >
                                <Button onPress={this.takePhoto} >
                                    <Image
                                        source={IMAGE.camera}
                                    />
                                </Button>

                                <View style={{ flex: 1, alignItems: 'center', marginTop: ScaleSzie(10) }} >
                                    <Text style={{
                                        color: '#C5C5C5', fontSize: ScaleSzie(20), fontWeight: 'bold',
                                    }} >
                                        {localize('Take a Photo', language)}
                                    </Text>
                                    <Text style={{
                                        color: '#C5C5C5', fontSize: ScaleSzie(20),
                                        marginVertical: ScaleSzie(15)
                                    }} >

                                        {localize('Or', language)}
                                    </Text>
                                    <ButtonCustom
                                        width={ScaleSzie(140)}
                                        height={40}
                                        backgroundColor="#F1F1F1"
                                        title={localize('Browse File', language)}
                                        textColor="#C5C5C5"
                                        onPress={this.openImageLibrary}
                                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                                        styleText={{ fontSize: ScaleSzie(16), fontWeight: '500' }}
                                    />
                                </View>
                            </View>
                    }
                </View>
                <View style={{ height: ScaleSzie(70), }} >
                    <ButtonCustom
                        width={ScaleSzie(290)}
                        height={60}
                        backgroundColor="#0764B0"
                        title={localize('NEXT', language)}
                        textColor="#fff"
                        onPress={this.gotoPageUploadToServer}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                        styleText={{ fontSize: ScaleSzie(24), fontWeight: 'bold' }}
                    />
                </View>
            </View>
        );
    }

    renderUploadServer() {
        const { language } = this.props;
        const { bannerUpload, titleBanner, descriptionBanner } = this.state;
        return (
            <View style={{ flex: 1 }} >
                <View style={{ flex: 1 }} >
                    <ScrollView
                        ref={this.scrollInputRef}
                        keyboardShouldPersistTaps="always"
                    >
                        <View style={{
                            height: ScaleSzie(140), width: ScaleSzie(220),
                            marginLeft: ScaleSzie(40), marginTop: ScaleSzie(12)
                        }} >
                            <Image
                                source={{ uri: bannerUpload.uri }}
                                style={{ height: ScaleSzie(140), width: ScaleSzie(220), }}
                                resizeMode="stretch"
                            />
                        </View>
                        {/* ------- title ----- */}
                        <View style={{ flexDirection: 'row', marginTop: ScaleSzie(20), paddingRight: ScaleSzie(20) }} >
                            <View style={{ width: ScaleSzie(100), justifyContent: 'center' }} >
                                <Text style={{ color: '#404040', fontSize: ScaleSzie(16) }} >
                                    {`${localize('Title', language)}:`}
                                </Text>
                            </View>

                            <View style={{
                                flex: 1, height: ScaleSzie(40), borderColor: '#58595B', borderWidth: 2,
                                borderRadius: 4, paddingHorizontal: ScaleSzie(10)
                            }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: ScaleSzie(16) }}
                                    value={titleBanner}
                                    onChangeText={titleBanner => this.setState({ titleBanner })}
                                    onFocus={this.scrollInputTo.bind(this, 170)}
                                />
                            </View>
                        </View>
                        {/* ------- Description ----- */}
                        <View style={{ flexDirection: 'row', marginTop: ScaleSzie(20), paddingRight: ScaleSzie(20) }} >
                            <View style={{ width: ScaleSzie(100), paddingTop: ScaleSzie(14) }} >
                                <Text style={{ color: '#404040', fontSize: ScaleSzie(16) }} >
                                    {`${localize('Description', language)}:`}
                                </Text>
                            </View>

                            <View style={{
                                flex: 1, height: ScaleSzie(90), borderColor: '#58595B', borderWidth: 2,
                                borderRadius: 4, paddingHorizontal: ScaleSzie(10), paddingVertical: ScaleSzie(10)
                            }} >
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: ScaleSzie(16),
                                        textAlignVertical: "top"
                                    }}
                                    multiline={true}
                                    underlineColorAndroid='transparent'
                                    value={descriptionBanner}
                                    onChangeText={descriptionBanner => this.setState({ descriptionBanner })}
                                    onFocus={this.scrollInputTo.bind(this, 220)}
                                />
                            </View>
                        </View>
                        <View style={{ height: ScaleSzie(300) }} />
                    </ScrollView>
                </View >
                {/* ----------- Button  ------ */}
                <View style={{ height: ScaleSzie(70), }} >
                    <ButtonCustom
                        width={ScaleSzie(290)}
                        height={60}
                        backgroundColor="#0764B0"
                        title={localize('SAVE', language)}
                        textColor="#fff"
                        onPress={this.uploadBannerToServer}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                        styleText={{ fontSize: ScaleSzie(24), fontWeight: 'bold' }}
                    />
                </View>
            </View>

        );
    }

    renderRightContent() {
        return (
            <View style={styles.rightContent} >
                <ScrollableTabView
                    ref={this.scrollTabRef}
                    style={{}}
                    initialPage={0}
                    locked={true}
                    renderTabBar={() => <View />}
                    onChangeTab={(index) => {
                        this.setState({ tabCurrent: index.i })
                    }}
                >
                    {this.renderUploadBannerLocal()}
                    {this.renderUploadServer()}
                </ScrollableTabView>

            </View>
        );
    }

    render() {
        const { language } = this.props;
        const { visibleDeleteBanner } = this.state;
        return (
            <View style={styles.container} >
                {this.renderHeader()}
                <View style={styles.content} >
                    {this.renderLeftContent()}
                    {this.renderRightContent()}
                </View>
                <PopupConfirm
                    visible={visibleDeleteBanner}
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Delete this Banner', language)}?`}
                    onRequestClose={() => this.setState({ visibleDeleteBanner: false })}
                    confimYes={this.submitDeleteBanner}
                />
            </View>
        );
    }

}

export default Layout;

