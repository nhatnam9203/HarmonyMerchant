import React from 'react';
import {
    View,
    Text,
    Keyboard,
    ActivityIndicator,
    DeviceEventEmitter,
    Platform,
    ScrollView
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { StarPRNT, AlignmentPosition } from 'react-native-star-prnt';
import ViewShot, { captureRef } from "react-native-view-shot";

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSzie, localize } from '../utils';
import connectRedux from '@redux/ConnectRedux';
import PrintManager from '@lib/PrintManager';

class PopupEnterPin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            customStyle: {},
            loading: false
        };
        this.viewShotRef = React.createRef();
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
        console.log("-----");
    }

    setStateFromParent = async (value) => {
        this.setState({
            value
        })
    }

    keyboardDidShow = async () => {
        await this.setState({
            customStyle: {
                justifyContent: 'flex-start',
                paddingTop: scaleSzie(80)
            }
        });
    }

    keyboardDidHide = async () => {
        await this.setState({
            customStyle: {}
        });

    }

    loginWithOfflineMode = () => {
        this.props.actions.app.closePopupEnterPin();
    }



    testPrint = async () => {
        try {
            captureRef(this.viewShotRef, {
                // snapshotContentContainer: true,
                // snapshotContentContainer: true
            }).then(
                imageUri => {
                    let commands = [];
                    commands.push({ appendLineFeed: 0 });
                    commands.push({ appendBitmap: imageUri });
                    commands.push({ appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed });
                    PrintManager.getInstance().print("BT:TSP100", commands);
                },
                error => console.error('Oops, snapshot failed', error)
            );

            // let imageUri = await this.viewShotRef.current.capture();
            // console.log("imageUri : ", imageUri);
            // let commands = [];
            // commands.push({ appendLineFeed: 0 });
            // commands.push({ appendBitmap: imageUri });
            // commands.push({ appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed });
            // PrintManager.getInstance().print("BT:TSP100", commands);

        } catch (error) {
            console.log("error : ", error);
        }

    }

    onCapture = uri => {
        console.log("----do something with ", uri);
    }

    // -------------- Render --------------

    render() {
        const { title, visibleEnterPin, isOfflineMode, onRequestClose, confimYes, hideCloseButton, isShowButtonEnterPinCode,
            language
        } = this.props;
        const { value, customStyle, loading } = this.state;

        return (
            <PopupParent
                title={"INVOICE"}
                visible={visibleEnterPin}
                onRequestClose={() => onRequestClose()}
                hideCloseButton={hideCloseButton}
                style={customStyle}
            >
                <View
                    style={{
                        backgroundColor: "#fff",
                        borderBottomLeftRadius: scaleSzie(15),
                        borderBottomRightRadius: scaleSzie(15)
                    }} >
                    <View style={{ height: scaleSzie(50) }} >

                        <ScrollView style={{ flex: 1 }} >
                            <View
                                ref={this.viewShotRef}
                                collapsable={false}
                            >
                                {/* ------------- Store Name ----------- */}
                                <Text style={{ color: "#000", fontSize: scaleSzie(18), fontWeight: "600", alignSelf: "center", marginTop: scaleSzie(10) }} >
                                    AAA Store
                             </Text>
                                {/* ------------- Store Address ----------- */}
                                <Text style={{
                                    color: "#000", fontSize: scaleSzie(16), alignSelf: "center", paddingHorizontal: scaleSzie(10),
                                    marginTop: scaleSzie(6)
                                }} >
                                    30 Cộng Hoà , phường 4 , Q. Tân Bình - HCM
                            </Text>
                                {/* ------------- Phone Address ----------- */}
                                <Text style={{
                                    color: "#000", fontSize: scaleSzie(16), alignSelf: "center", paddingHorizontal: scaleSzie(10),
                                }} >
                                    Tel : 0123-456-789
                            </Text>
                                {/* ------------- Company Website ----------- */}
                                <Text style={{
                                    color: "#000", fontSize: scaleSzie(16), alignSelf: "center", paddingHorizontal: scaleSzie(10),
                                }} >
                                    https://www.harmonypayment.com
                            </Text>
                                {/* ------------- SALE/VOID/REFUND  ----------- */}
                                <Text style={{
                                    color: "#000", fontSize: scaleSzie(20), fontWeight: "bold", alignSelf: "center", marginTop: scaleSzie(15),
                                    marginBottom: scaleSzie(20)
                                }} >
                                    SALE
                            </Text>
                                {/* ------------- Dot Border  ----------- */}
                                <View style={{
                                    height: scaleSzie(1), marginHorizontal: scaleSzie(10),
                                    borderWidth: 1,
                                    borderColor: "#000",
                                    borderStyle: "dashed"

                                }} />
                            </View>
                        </ScrollView>
                    </View>


                    {/* ------ Button ----- */}
                    < View style={{
                        height: scaleSzie(45), alignItems: 'center'
                    }} >
                        <ButtonCustom
                            width={'30%'}
                            height={35}
                            backgroundColor="#0764B0"
                            title={localize('PRINT', language)}
                            textColor="#fff"
                            onPress={this.testPrint}

                            styleText={{
                                fontSize: scaleSzie(14)
                            }}
                            style={{
                                borderRadius: scaleSzie(4)
                            }}
                        />
                    </ View>
                </View>

            </PopupParent>
        );
    }

    render_1() {
        const { title, visibleEnterPin, isOfflineMode, onRequestClose, confimYes, hideCloseButton, isShowButtonEnterPinCode,
            language
        } = this.props;
        const { value, customStyle, loading } = this.state;

        return (
            <PopupParent
                title={title}
                visible={visibleEnterPin}
                onRequestClose={() => onRequestClose()}
                hideCloseButton={hideCloseButton}
                style={customStyle}
            >
                <ViewShot
                    ref={this.viewShotRef}
                    style={{
                        backgroundColor: '#fff',
                        borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                    }} >
                    <View style={{ height: scaleSzie(85), justifyContent: 'center', alignItems: 'center' }} >
                        <View style={{
                            width: '90%', height: scaleSzie(45),
                            borderColor: 'rgb(231,231,231)', borderWidth: 3
                        }} >
                            <TextInputMask
                                type="only-numbers"
                                style={{
                                    flex: 1, fontSize: scaleSzie(18), textAlign: 'center',
                                    padding: 0, margin: 0
                                }}
                                placeholder={localize('Your pin code', language)}
                                keyboardType="numeric"
                                maxLength={4}
                                value={value}
                                onChangeText={(value) => this.setState({ value })}
                                onSubmitEditing={() => {
                                    confimYes();
                                }}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>
                    {
                        isOfflineMode ? <View style={{ height: scaleSzie(120), }} >
                            <Text style={{
                                color: 'rgb(246,195,49)', fontWeight: 'bold', fontSize: scaleSzie(14),
                                textAlign: 'center'
                            }} >
                                {`${localize('Please check your internet', language)} !`}
                            </Text>
                            <Text style={{
                                color: 'rgb(246,195,49)', fontWeight: 'bold', fontSize: scaleSzie(14),
                                textAlign: 'center'
                            }} >
                                Or
                        </Text>
                            <Text style={{
                                color: 'rgb(246,195,49)', fontWeight: 'bold', fontSize: scaleSzie(14),
                                textAlign: 'center'
                            }} >
                                {`${localize('Do you want use offline mode', language)} ?`}
                            </Text>
                            <View style={{
                                flex: 1, flexDirection: 'row', justifyContent: 'space-around',
                                alignItems: 'center'
                            }} >
                                <ButtonCustom
                                    width={'30%'}
                                    height={35}
                                    backgroundColor="#0764B0"
                                    title={localize('Ask me later', language)}
                                    textColor="#fff"
                                    onPress={() => this.props.actions.app.toogleOfflineMode(false)}
                                    styleText={{
                                        fontSize: scaleSzie(14)
                                    }}
                                    style={{
                                        borderRadius: scaleSzie(4)
                                    }}
                                />

                                <ButtonCustom
                                    width={'30%'}
                                    height={35}
                                    backgroundColor="#0764B0"
                                    title={localize('OK', language)}
                                    textColor="#fff"
                                    onPress={this.loginWithOfflineMode}
                                    styleText={{
                                        fontSize: scaleSzie(14)
                                    }}
                                    style={{
                                        borderRadius: scaleSzie(4)
                                    }}
                                />

                            </View>
                        </View> :
                            < View style={{
                                height: scaleSzie(45), alignItems: 'center'
                            }} >
                                {
                                    isShowButtonEnterPinCode ? <View style={{
                                        width: '30%', height: scaleSzie(35), backgroundColor: '#0764B0',
                                        justifyContent: 'center', alignItems: 'center'
                                    }} >
                                        <ActivityIndicator
                                            size="large"
                                            color="#fff"
                                        />
                                    </View> : <ButtonCustom
                                            width={'30%'}
                                            height={35}
                                            backgroundColor="#0764B0"
                                            title={localize('Enter', language)}
                                            textColor="#fff"
                                            // onPress={() => confimYes()}
                                            onPress={this.testPrint}

                                            styleText={{
                                                fontSize: scaleSzie(14)
                                            }}
                                            style={{
                                                borderRadius: scaleSzie(4)
                                            }}
                                        />
                                }

                            </View>
                    }


                </ViewShot>
            </PopupParent >
        );
    }



    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

}


const mapStateToProps = state => ({
    language: state.dataLocal.language,
    isShowButtonEnterPinCode: state.staff.isShowButtonEnterPinCode,
    visibleEnterPin: state.app.visibleEnterPin,
    isOfflineMode: state.network.isOfflineMode
});

export default connectRedux(mapStateToProps, PopupEnterPin);

