import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSzie,formatMoney } from '../utils';
import connectRedux from '@redux/ConnectRedux';

class PopupChangeMoney extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cashBack: '0.00'
        }
    }

    setStateFromParent = async (cashBack) => {
        await this.setState({
            cashBack
        })
    }

    confimOK = () => {
        this.props.actions.appointment.completeTransaction();
    }

    render() {
        const { title, onRequestClose, visibleChangeMoney, moneyChanged } = this.props;
        const { cashBack } = this.state;
        return (
            <PopupParent
                title={title}
                visible={visibleChangeMoney}
                onRequestClose={() => onRequestClose()}
                hideCloseButton={true}
            >
                <View style={{
                    height: scaleSzie(130), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                            {`Change : $ ${formatMoney(moneyChanged)}`}
                        </Text>
                    </View>
                    <View style={{
                        height: scaleSzie(45), alignItems: 'center'
                    }} >
                        <ButtonCustom
                            width={'30%'}
                            height={35}
                            backgroundColor="#0764B0"
                            title="OK"
                            textColor="#fff"
                            onPress={this.confimOK}
                            styleText={{
                                fontSize: scaleSzie(14)
                            }}
                        />
                    </View>
                </View>
            </PopupParent>
        );
    }

}

const mapStateToProps = state => ({
    visibleChangeMoney: state.appointment.visibleChangeMoney,
    moneyChanged: state.appointment.moneyChanged
})

export default connectRedux(mapStateToProps, PopupChangeMoney);



