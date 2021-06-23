import React from 'react';
import {
    View,
    Text,
    ActivityIndicator
} from 'react-native';

import {
    ButtonCustom, ModalCustom
} from '@components';
import { ScaleSzie, localize } from '@utils';

class PopupProcessingReportPax extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            transactionId : false
        }
    }

    setStateFromParent = async (transactionId) =>{
      await  this.setState({
            transactionId
        })
    }


    render() {
        const { visible, onRequestClose, language } = this.props;
        const {transactionId} = this.state;

        return (
            <ModalCustom
                transparent={true}
                visible={visible}
                onRequestClose={() => { }}
            >
                <View style={{
                    height: ScaleSzie(200),
                    width: ScaleSzie(420),
                    backgroundColor: '#fff',
                    borderRadius: ScaleSzie(15),
                    paddingTop: ScaleSzie(16)
                }} >
                    <View style={{ flex: 1, alignItems: 'center' }} >
                        <Text style={{ color: '#0764B0', fontSize: ScaleSzie(24), fontWeight: 'bold' }} >
                            {`${localize('Please wait', language)}!`}
                        </Text>
                        <Text style={{ color: '#404040', fontSize: ScaleSzie(14), marginTop: ScaleSzie(4),textAlign:"center" }} >
                            {`${localize(`The system is getting reports from your Pax machine. Don't use Pax machine while getting!`, language)} ...`}
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

                    </View>
                </View>
            </ModalCustom>
        );
    }
}


export default PopupProcessingReportPax;


