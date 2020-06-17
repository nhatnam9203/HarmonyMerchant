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
import { scaleSzie, localize } from '@utils';
import IMAGE from '@resources';
import styles from './style';
import BodyPrincipal from './widget/bodyPrincipal';

const { width } = Dimensions.get('window');

export default class Layout extends React.Component {


    render() {
        const { principalInfo, isShowPrincipal1, dateOfBirth, uriUpload,
            isShowPrincipal2, principalInfo2, uriUploadPrincipal2, dateOfBirthPrincipal2,
            phoneCodePrincipal1, phoneCodePrincipal2
        } = this.state;
        const { language } = this.props;
        const iconPrincipal1 = isShowPrincipal1 ? IMAGE.top_scroll_active : IMAGE.right_scroll_active;
        const iconPrincipal2 = isShowPrincipal2 ? IMAGE.top_scroll_active : IMAGE.right_scroll_active;

        return (
            <FormInfoParent
                title={localize('Principal Information', language)}
                back={() => this.props.navigation.goBack()}
                next={this.nextScreen}

            >
                <ScrollView
                    ref={this.srollPrincipalRef}
                    showsVerticalScrollIndicator={false}
                >
                    {/* ------ Header ------ */}
                    <View style={{
                        width, paddingHorizontal: scaleSzie(15),
                        marginTop: scaleSzie(8)
                    }}  >
                        <Text style={{ color: '#0764B0', fontWeight: 'bold', fontSize: scaleSzie(18) }} >
                            {localize('Please fill the form below', language)}
                        </Text>
                        <View style={{
                            height: scaleSzie(38), backgroundColor: '#0764B0', justifyContent: 'center',
                            paddingLeft: scaleSzie(5), marginTop: scaleSzie(5)
                        }} >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: scaleSzie(18) }} >
                                {localize('Principal Information', language)}
                            </Text>
                        </View>
                    </View>
                    {/* ------------------------- */}
                    <View style={{ paddingHorizontal: scaleSzie(16), marginTop: scaleSzie(10) }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                            {localize('Principal Des', language)}
                        </Text>
                    </View>

                    <View style={{ flex: 1, paddingHorizontal: scaleSzie(25) }} >
                        <View style={{ height: scaleSzie(16) }} />
                        {/* ------------------   Principal 1 ---------------- */}
                        <View style={{ flexDirection: "row" }} >
                            <View style={{ marginTop: scaleSzie(10), width: scaleSzie(100) }} >
                                <Text style={{
                                    color: '#404040', fontSize: scaleSzie(18), fontWeight: 'bold',
                                    marginBottom: scaleSzie(10)
                                }} >
                                    {`${localize('Principal', language)} 1*`}
                                </Text>
                            </View>
                            <Button onPress={this.showPrincipal1} style={{
                                width: scaleSzie(30), justifyContent: "center", alignItems: "center",
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
                            /> : <View />
                        }

                        {/* ------------------   Principal 2 ---------------- */}
                        <View style={{ flexDirection: "row" }} >
                            <View style={{ marginTop: scaleSzie(10), width: scaleSzie(100) }} >
                                <Text style={{
                                    color: '#404040', fontSize: scaleSzie(18), fontWeight: 'bold',
                                    marginBottom: scaleSzie(10)
                                }} >
                                    {`${localize('Principal', language)} 2`}
                                </Text>
                            </View>
                            <Button onPress={this.showPrincipal2} style={{
                                width: scaleSzie(30), justifyContent: "center", alignItems: "center"
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
                        title={localize('Day Of Birth', language)}
                        dateCalendar={isShowPrincipal1 ? dateOfBirth : dateOfBirthPrincipal2}
                        setDateSelected={this.setDateSelected}
                    />
                    <View style={{ height: scaleSzie(250) }} />
                </ScrollView>
            </FormInfoParent>

        );
    }
}
