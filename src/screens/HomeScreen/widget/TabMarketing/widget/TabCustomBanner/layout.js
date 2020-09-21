import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList,
    TextInput,
    Platform
} from 'react-native';

import { scaleSzie, localize } from '@utils';
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
                    paddingLeft: scaleSzie(15), paddingBottom: scaleSzie(10)
                }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                        {localize('Media List', language)}
                    </Text>
                </View>
                <View style={{
                    flex: 0.8,
                    paddingBottom: scaleSzie(10), justifyContent: 'flex-end'
                }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
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
                <View style={{ flex: 1, paddingTop: scaleSzie(40) }} >
                    {
                        bannerUpload.uri !== '' ?
                            // --------- avatar upload -----
                            <View>
                                <View style={{
                                    height: scaleSzie(140), width: scaleSzie(220),
                                    marginLeft: scaleSzie(40), marginTop: scaleSzie(12)
                                }} >
                                    <Image
                                        source={{ uri: bannerUpload.uri }}
                                        style={{ height: scaleSzie(140), width: scaleSzie(220), }}
                                        resizeMode="stretch"
                                    />
                                </View>
                                {/* -------- Btn Cancel ------ */}
                                <View style={{ paddingLeft: scaleSzie(80), marginTop: scaleSzie(20) }} >
                                    <ButtonCustom
                                        width={scaleSzie(140)}
                                        height={40}
                                        backgroundColor="#F1F1F1"
                                        title={localize('Cancel', language)}
                                        textColor="#C5C5C5"
                                        onPress={this.cancelUploadBannerLocal}
                                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                                        styleText={{ fontSize: scaleSzie(16), fontWeight: '500' }}
                                    />
                                </View>

                            </View>

                            :
                            <View style={{
                                width: scaleSzie(300), height: scaleSzie(240),
                                borderWidth: 2, borderColor: '#C5C5C5',
                                borderStyle: "dashed",
                                borderRadius: scaleSzie(14),
                                alignItems: 'center',
                                paddingTop: scaleSzie(30)

                            }} >
                                <Button onPress={this.takePhoto} >
                                    <Image
                                        source={IMAGE.camera}
                                    />
                                </Button>

                                <View style={{ flex: 1, alignItems: 'center', marginTop: scaleSzie(10) }} >
                                    <Text style={{
                                        color: '#C5C5C5', fontSize: scaleSzie(20), fontWeight: 'bold',
                                    }} >
                                        {localize('Take a Photo', language)}
                                    </Text>
                                    <Text style={{
                                        color: '#C5C5C5', fontSize: scaleSzie(20),
                                        marginVertical: scaleSzie(15)
                                    }} >

                                        {localize('Or', language)}
                                    </Text>
                                    <ButtonCustom
                                        width={scaleSzie(140)}
                                        height={40}
                                        backgroundColor="#F1F1F1"
                                        title={localize('Browse File', language)}
                                        textColor="#C5C5C5"
                                        onPress={this.openImageLibrary}
                                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                                        styleText={{ fontSize: scaleSzie(16), fontWeight: '500' }}
                                    />
                                </View>
                            </View>
                    }
                </View>
                <View style={{ height: scaleSzie(70), }} >
                    <ButtonCustom
                        width={scaleSzie(290)}
                        height={60}
                        backgroundColor="#0764B0"
                        title={localize('NEXT', language)}
                        textColor="#fff"
                        onPress={this.gotoPageUploadToServer}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                        styleText={{ fontSize: scaleSzie(24), fontWeight: 'bold' }}
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
                            height: scaleSzie(140), width: scaleSzie(220),
                            marginLeft: scaleSzie(40), marginTop: scaleSzie(12)
                        }} >
                            <Image
                                source={{ uri: bannerUpload.uri }}
                                style={{ height: scaleSzie(140), width: scaleSzie(220), }}
                                resizeMode="stretch"
                            />
                        </View>
                        {/* ------- title ----- */}
                        <View style={{ flexDirection: 'row', marginTop: scaleSzie(20), paddingRight: scaleSzie(20) }} >
                            <View style={{ width: scaleSzie(100), justifyContent: 'center' }} >
                                <Text style={{ color: '#404040', fontSize: scaleSzie(16) }} >
                                    {`${localize('Title', language)}:`}
                                </Text>
                            </View>

                            <View style={{
                                flex: 1, height: scaleSzie(40), borderColor: '#58595B', borderWidth: 2,
                                borderRadius: 4, paddingHorizontal: scaleSzie(10)
                            }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                    value={titleBanner}
                                    onChangeText={titleBanner => this.setState({ titleBanner })}
                                    onFocus={this.scrollInputTo.bind(this, 170)}
                                />
                            </View>
                        </View>
                        {/* ------- Description ----- */}
                        <View style={{ flexDirection: 'row', marginTop: scaleSzie(20), paddingRight: scaleSzie(20) }} >
                            <View style={{ width: scaleSzie(100), paddingTop: scaleSzie(14) }} >
                                <Text style={{ color: '#404040', fontSize: scaleSzie(16) }} >
                                    {`${localize('Description', language)}:`}
                                </Text>
                            </View>

                            <View style={{
                                flex: 1, height: scaleSzie(90), borderColor: '#58595B', borderWidth: 2,
                                borderRadius: 4, paddingHorizontal: scaleSzie(10), paddingVertical: scaleSzie(10)
                            }} >
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: scaleSzie(16),
                                        ...Platform.select({
                                            android: {
                                                textAlignVertical: "top"
                                            }
                                        })
                                    }}
                                    multiline={true}
                                    underlineColorAndroid='transparent'
                                    value={descriptionBanner}
                                    onChangeText={descriptionBanner => this.setState({ descriptionBanner })}
                                    onFocus={this.scrollInputTo.bind(this, 220)}
                                />
                            </View>
                        </View>
                        <View style={{ height: scaleSzie(300) }} />
                    </ScrollView>
                </View >
                {/* ----------- Button  ------ */}
                <View style={{ height: scaleSzie(70), }} >
                    <ButtonCustom
                        width={scaleSzie(290)}
                        height={60}
                        backgroundColor="#0764B0"
                        title={localize('SAVE', language)}
                        textColor="#fff"
                        onPress={this.uploadBannerToServer}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                        styleText={{ fontSize: scaleSzie(24), fontWeight: 'bold' }}
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

