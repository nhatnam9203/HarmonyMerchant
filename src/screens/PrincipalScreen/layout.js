import React from 'react';
import {
    View,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';

import {
    FormInfoParent, Text, Button, PopupUpload, DatePicker,
} from '@components';
import { scaleSize, localize } from '@utils';
import IMAGE from '@resources';
import BodyPrincipal from './widget/bodyPrincipal';

const { width } = Dimensions.get('window');

export default class Layout extends React.Component {


    render() {
        const { principalInfo, isShowPrincipal1, dateOfBirth, uriUpload,
            isShowPrincipal2, principalInfo2, uriUploadPrincipal2, dateOfBirthPrincipal2,
            phoneCodePrincipal1, phoneCodePrincipal2,
            dynamicMarginBottomStatePrincipal1,
            dynamicMarginBottomDAStateIssuedPrincipal1,
            dynamicMarginBottomStatePrincipal2,
            dynamicMarginBottomDAStateIssuedPrincipal2,
        } = this.state;
        const { language } = this.props;
        const iconPrincipal1 = isShowPrincipal1 ? IMAGE.top_scroll_active : IMAGE.right_scroll_active;
        const iconPrincipal2 = isShowPrincipal2 ? IMAGE.top_scroll_active : IMAGE.right_scroll_active;

        return (
            <FormInfoParent
                title={localize('Principal Information', language)}
                back={this.backScreen}
                next={this.nextScreen}

            >
                <ScrollView
                    ref={this.srollPrincipalRef}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                >
                    {/* ------ Header ------ */}
                    <View style={{
                        width, paddingHorizontal: scaleSize(15),
                        marginTop: scaleSize(8)
                    }}  >
                        <Text style={{ color: '#0764B0', fontWeight: 'bold', fontSize: scaleSize(18) }} >
                            {localize('Please fill the form below', language)}
                        </Text>
                        <View style={{
                            height: scaleSize(38), backgroundColor: '#0764B0', justifyContent: 'center',
                            paddingLeft: scaleSize(5), marginTop: scaleSize(5)
                        }} >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: scaleSize(18) }} >
                                {localize('Principal Information', language)}
                            </Text>
                        </View>
                    </View>
                    {/* ------------------------- */}
                    <View style={{ paddingHorizontal: scaleSize(16), marginTop: scaleSize(10) }} >
                        <Text style={{ color: '#404040', fontSize: scaleSize(18) }} >
                            {localize('Principal Des', language)}
                        </Text>
                    </View>

                    <View style={{ flex: 1, paddingHorizontal: scaleSize(25) }} >
                        <View style={{ height: scaleSize(16) }} />
                        {/* ------------------   Principal 1 ---------------- */}
                        <View style={{ flexDirection: "row" }} >
                            <View style={{ marginTop: scaleSize(10), width: scaleSize(100) }} >
                                <Text style={{
                                    color: '#404040', fontSize: scaleSize(18), fontWeight: 'bold',
                                    marginBottom: scaleSize(10)
                                }} >
                                    {`${localize('Principal', language)} 1*`}
                                </Text>
                            </View>
                            <Button onPress={this.showPrincipal1} style={{
                                width: scaleSize(30), justifyContent: "center", alignItems: "center",
                            }} >
                                <Image
                                    source={iconPrincipal1}
                                />
                            </Button>
                            <View style={{ flex: 1, justifyContent: "center" }} >
                                <View style={{ width: "100%", height: 2, backgroundColor: "#0764B0" }} />
                            </View>
                        </View>

                        {
                            isShowPrincipal1 ? <BodyPrincipal
                                ref={this.principalFirstRef}
                                principalInfo={principalInfo}
                                language={language}
                                dateOfBirth={dateOfBirth}
                                uriUpload={uriUpload}
                                scrollPrincipalTo={this.scrollPrincipalTo}
                                updatePrincipalInfo={this.updatePrincipalInfo}
                                showCalendar={this.showCalendar}
                                takePhoto={this.takePhoto}
                                openImageLibrary={this.openImageLibrary}
                                updatePhoneCode={this.updatePhoneCode}
                                phoneCodePrincipal={phoneCodePrincipal1}
                                dynamicMarginBottomStatePrincipal={dynamicMarginBottomStatePrincipal1}
                                dynamicMarginBottomDAStateIssuedPrincipal={dynamicMarginBottomDAStateIssuedPrincipal1}
                                updateMarginTopState={this.updateMarginTopState1}
                                updateMarginTopStateIssued={this.updateMarginTopStateIssued1}
                                resetMarginTopState={this.resetMarginTopState}
                                resetMarginTopStateIssued={this.resetMarginTopStateIssued}
                            /> : <View />
                        }

                        {/* ------------------   Principal 2 ---------------- */}
                        <View style={{ flexDirection: "row" }} >
                            <View style={{ marginTop: scaleSize(10), width: scaleSize(100) }} >
                                <Text style={{
                                    color: '#404040', fontSize: scaleSize(18), fontWeight: 'bold',
                                    marginBottom: scaleSize(10)
                                }} >
                                    {`${localize('Principal', language)} 2`}
                                </Text>
                            </View>
                            <Button onPress={this.showPrincipal2} style={{
                                width: scaleSize(30), justifyContent: "center", alignItems: "center"
                            }} >
                                <Image
                                    source={iconPrincipal2}
                                />
                            </Button>
                            <View style={{ flex: 1, justifyContent: "center" }} >
                                <View style={{ width: "100%", height: 2, backgroundColor: "#0764B0" }} />
                            </View>
                        </View>
                        {
                            isShowPrincipal2 ? <BodyPrincipal
                                ref={this.principalSecondRef}
                                principalInfo={principalInfo2}
                                language={language}
                                dateOfBirth={dateOfBirthPrincipal2}
                                uriUpload={uriUploadPrincipal2}
                                scrollPrincipalTo={this.scrollPrincipalTo}
                                updatePrincipalInfo={this.updatePrincipalInfo}
                                showCalendar={this.showCalendar}
                                takePhoto={this.takePhoto}
                                openImageLibrary={this.openImageLibrary}
                                isPrincipalSecond={true}
                                updatePhoneCode={this.updatePhoneCode}
                                phoneCodePrincipal={phoneCodePrincipal2}
                                dynamicMarginBottomStatePrincipal={dynamicMarginBottomStatePrincipal2}
                                dynamicMarginBottomDAStateIssuedPrincipal={dynamicMarginBottomDAStateIssuedPrincipal2}
                                updateMarginTopState={this.updateMarginTopState2}
                                updateMarginTopStateIssued={this.updateMarginTopStateIssued2}
                                resetMarginTopState={this.resetMarginTopState}
                                resetMarginTopStateIssued={this.resetMarginTopStateIssued}
                            /> : <View />
                        }

                        {/* ---------------------- */}
                    </View>
                    <PopupUpload
                        ref={this.uploadVoidCheckRef}
                        visible={this.state.visibleUpload}
                        title={localize('File Upload', language)}
                        message={`${localize('Do you want to Archive this Category', language)}?`}
                        onRequestClose={() => this.setState({ visibleUpload: false })}
                        uri={this.state.uriUpload}
                        saveVoidCheck={this.saveVoidCheck}
                        isPricipal={true}
                    />
                    {/* ------------- Date Picker ------ */}
                    <DatePicker
                        visible={this.state.showCalendar}
                        onRequestClose={() => this.setState({ showCalendar: false })}
                        title={localize('Date of Birth ', language)}
                        dateCalendar={isShowPrincipal1 ? dateOfBirth : dateOfBirthPrincipal2}
                        setDateSelected={this.setDateSelected}
                        heightPicker={scaleSize(190)}
                    />
                    <View style={{ height: scaleSize(250) }} />
                </ScrollView>
            </FormInfoParent>

        );
    }
}
