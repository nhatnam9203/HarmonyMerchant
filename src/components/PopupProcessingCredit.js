import React from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Platform
} from 'react-native';

import ButtonCustom from "./ButtonCustom";
import ModalCustom from "./ModalCustom";
// const { persistor, store } = configureStore();

import { scaleSize, localize, PaymentTerminalType } from '@utils';

class PopupProcessingCredit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            transactionId: false,
            countDown: 120,
        }
        // this.timer = React.useRef(null);
    }

    // componentDidUpdate(prevProps, prevState) {
    //     const { hardware } = store.getState();

    //     if (hardware.paymentMachineType == PaymentTerminalType.Dejavoo) {
    //         const { visible } = this.props;
    //         if (prevProps.visible != visible) {
    //             if (visible) {
    //                 console.log('start timer')
    //                 this.startTimer();
    //             } else {
    //                 console.log('clear timer')
    //                 this.clearTimer();
    //             }
    //         }
    //     }
    // }


    setStateFromParent = async (transactionId) => {
        await this.setState({
            transactionId
        })
    }


    // clearTimer = () => {
    //   if (this.timer.current) {
    //     clearTimeout(this.timer.current);
    //     this.timer.current = null;
    //   }
    // };
  
    // startTimer = () => {
    //   this.timer.current = setTimeout(() => {
    //     const countDown = this.state.countDown > 0 ? this.state.countDown - 1 : 0;
    //     console.log('countDown', countDown)
    //     this.setState({ countDown })
    //   }, 1000);
    // };
  


    render() {
        const { visible, onRequestClose, language } = this.props;
        const { transactionId } = this.state;

        return (
            <ModalCustom
                transparent={true}
                visible={visible}
                onRequestClose={() => { }}
            >
                <View style={{
                    height: scaleSize(280),
                    width: scaleSize(420),
                    backgroundColor: '#fff',
                    borderRadius: scaleSize(15),
                    paddingTop: scaleSize(16)
                }} >
                    <View style={{ flex: 1, alignItems: 'center' }} >
                        <Text style={{ color: '#0764B0', fontSize: scaleSize(24), fontWeight: 'bold' }} >
                            {`${localize('Please wait', language)}!`}
                        </Text>
                        <Text style={{ color: '#404040', fontSize: scaleSize(18), marginTop: scaleSize(4) }} >
                            {`${localize('Transaction is processing', language)} ...`}
                        </Text>

                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            transform: [{ scale: 4 }]
                        }} >
                            <ActivityIndicator
                                size={'large'}
                                color="rgb(83,157,209)"

                            />
                        </View>

                        {
                            transactionId ? <Text style={{ alignSelf: "center", color: "#404040", fontSize: scaleSize(18) }} >
                                Enter<Text style={{ color: "red", fontWeight: "bold" }} >{` ${transactionId} `}</Text> number into your PAX machine!
                        </Text> : <View />
                        }

                        {
                            Platform.OS === "ios" ? <View style={{ paddingVertical: scaleSize(14) }} >
                                <ButtonCustom
                                    width={scaleSize(120)}
                                    height={40}
                                    backgroundColor="#F1F1F1"
                                    title={localize('Cancel', language)}
                                    textColor="#6A6A6A"
                                    onPress={() => onRequestClose()}
                                    style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 0 }}
                                    styleText={{ fontSize: scaleSize(15), fontWeight: 'normal' }}
                                />
                            </View> : <View />
                        }


                    </View>
                </View>
            </ModalCustom>
        );
    }
}


export default PopupProcessingCredit;


