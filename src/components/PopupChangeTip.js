import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Keyboard,
    TextInput
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from 'ramda';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { Dropdown } from './react-native-material-dropdown';
import connectRedux from '@redux/ConnectRedux';

import { scaleSzie } from '../utils';

class PopupChangeTip extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appointmentId: '',
            tip: 0.00,
            customStyle: {},
        };
        this.scrollRef = React.createRef();
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
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

    handleKeyboardWillHide = async () => {

        if (this.scrollRef.current) {
            this.scrollRef.current.scrollTo({ x: 0, y: 0, animated: true })
        }

    }

    setStateFromParent = async (appointmentId, tip) => {
        await this.setState({
            appointmentId,
            tip
        });
    }

    submitChangeStylist = () => {
        const {appointmentId,tip} = this.state;
        this.props.actions.marketing.changeStylist(0, 0,tip, appointmentId, 0, true);
        this.props.onRequestClose();
    }


    // --------------- Render -----------

    render() {
        const { title, visible, onRequestClose, confimYes } = this.props;
        const { tip,customStyle } = this.state;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                width={scaleSzie(260)}
                // style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(50) }}
                styleTitle={{ fontSize: scaleSzie(22), fontWeight: "bold" }}
                style={customStyle}
            >
                <View style={{
                    height: scaleSzie(175), backgroundColor: '#FAFAFA',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(16),

                }} >
                    <View style={{ flex: 1 }} >
                    <ScrollView keyboardShouldPersistTaps="always" >
                        <View style={{ height: scaleSzie(20) }} />
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(16), marginBottom: scaleSzie(5) }} >
                            Tip ($)
                            </Text>
                        {/* ------- Box Price -------- */}
                        <View style={{
                            height: scaleSzie(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                            paddingHorizontal: scaleSzie(10), marginBottom: scaleSzie(10)
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
                                onChangeText={(tip) => this.setState({ tip })}
                            />
                        </View>

                        {/* ------- Button -------- */}
                        <View style={{ marginTop: scaleSzie(20), alignItems: 'center', }} >
                            <ButtonCustom
                                width={scaleSzie(120)}
                                height={45}
                                backgroundColor="#0764B0"
                                title="Submit"
                                textColor="#fff"
                                onPress={this.submitChangeStylist}
                                style={{
                                    borderWidth: 1, borderColor: '#C5C5C5',
                                    borderRadius: 4
                                }}
                            />
                        </View>
                        </ScrollView>
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

