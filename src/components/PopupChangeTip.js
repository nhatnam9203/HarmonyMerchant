import React from 'react';
import {
    View,
    Text,
    Keyboard,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from 'ramda';

import ButtonCustom from './ButtonCustom';
import Button from "./Button";
import PopupParent from './PopupParent';
import connectRedux from '@redux/ConnectRedux';

import { scaleSzie, roundFloatNumber,formatNumberFromCurrency } from '../utils';

class PopupChangeTip extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appointmentId: '',
            tip: 0.00,
            customStyle: {},
            percent: 0,
            subTotal: 0.00,
        };
        this.scrollRef = React.createRef();
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
    }

    setStateFromParent = async (appointmentId, tip, subTotal = 0) => {
        // console.log("---- subTotal : ", subTotal);
        await this.setState({
            appointmentId,
            tip,
            subTotal,
            percent: 0,
        });
    }

    keyboardDidShow = async () => {
        await this.setState({
            customStyle: {
                justifyContent: 'flex-start',
                paddingTop: scaleSzie(40)
            }
        });
    }

    keyboardDidHide = async () => {
        await this.setState({
            customStyle: {}
        });

    }

    handleKeyboardWillHide = async () => {

        if (this.scrollRef.current) {
            this.scrollRef.current.scrollTo({ x: 0, y: 0, animated: true })
        }

    }

    submitChangeStylist = () => {
        const { appointmentId, tip } = this.state;
        this.props.actions.marketing.changeStylist(0, 0, tip, appointmentId, 0, true);
        this.props.onRequestClose();
    }

    selectPercent = async (percent) => {
        const { subTotal } = this.state;
        // console.log("-----subTotal : ",subTotal);
        const tip = ( formatNumberFromCurrency(subTotal) * percent) / 100;
        await this.setState({
            percent,
            tip : roundFloatNumber(tip)
        });
    }

    onChangeTip = async (tip) => {
        await this.setState({
            tip,
            percent: 0
        });
    }

    // --------------- Render -----------

    render() {
        const { title, visible, onRequestClose, confimYes } = this.props;
        const { tip, customStyle, percent } = this.state;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                width={scaleSzie(360)}
                styleTitle={{ fontSize: scaleSzie(22), fontWeight: "bold" }}
                style={customStyle}
            >
                <View style={{
                    height: scaleSzie(270), backgroundColor: '#FAFAFA',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                }} >
                    <View style={{ flex: 1 }} >
                        {/* -------------- Input ------------ */}
                        <View style={{ paddingHorizontal: scaleSzie(40) }} >
                            <View style={{ height: scaleSzie(25) }} />
                            <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(16), marginBottom: scaleSzie(15), fontWeight: "600" }} >
                                {`Tip Amount ($)`}
                            </Text>
                            {/* ------- Box Price -------- */}
                            <View style={{
                                height: scaleSzie(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                paddingHorizontal: scaleSzie(10),
                            }} >
                                <TextInputMask
                                    // type="only-numbers"
                                    type={'money'}
                                    options={{
                                        precision: 2,
                                        separator: '.',
                                        delimiter: ',',
                                        unit: '',
                                        suffixUnit: ''
                                    }}
                                    style={{ flex: 1, fontSize: scaleSzie(16), color: '#6A6A6A' }}
                                    value={tip}
                                    onChangeText={this.onChangeTip}
                                />
                            </View>
                        </View>


                        {/* -------------- Percent Row ------------ */}
                        <View style={{
                            flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: scaleSzie(40),
                        }} >
                            {
                                [15, 18, 20, 25].map((data, index) => {
                                    const txt_color = data === percent ? { color: "#fff" } : { color: "#0764B0" };
                                    const bg_select = data === percent ? { backgroundColor: "#0764B0" } : { backgroundColor: "#fff" };

                                    return (
                                        <Button onPress={this.selectPercent.bind(this, data)} key={`percent_${data}_${index}`} style={[{
                                            width: scaleSzie(75), height: scaleSzie(35),
                                            borderColor: "#0764B0", borderWidth: 2, borderRadius: scaleSzie(4),
                                            justifyContent: "center", alignItems: "center"
                                        }, bg_select]}  >
                                            <Text style={[{ color: "#0764B0", fontSize: scaleSzie(16), fontWeight: "500" }, txt_color]}  >
                                                {`${data} %`}
                                            </Text>
                                        </Button>
                                    );
                                })
                            }

                        </View>

                        {/* ------- Button -------- */}
                        <View style={{
                            flex: 1, justifyContent: "center", alignItems: 'center',
                            borderTopWidth: 1, borderTopColor: '#C5C5C5',
                        }} >
                            <ButtonCustom
                                width={scaleSzie(150)}
                                height={45}
                                backgroundColor="#0764B0"
                                title="Submit"
                                textColor="#fff"
                                onPress={this.submitChangeStylist}
                                style={{
                                    borderWidth: 1, borderColor: '#C5C5C5',
                                    borderRadius: scaleSzie(4)
                                }}
                            />
                        </View>
                    </View>
                </View>
            </PopupParent>
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();;
        this.keyboardDidHideListener.remove();

    }


}



const mapStateToProps = state => ({
    groupAppointment: state.appointment.groupAppointment
})

export default connectRedux(mapStateToProps, PopupChangeTip);

