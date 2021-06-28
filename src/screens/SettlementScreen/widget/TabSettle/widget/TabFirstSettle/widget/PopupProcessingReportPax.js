import React from 'react';
import {
    View,
    Text,
    ActivityIndicator
} from 'react-native';

import {
    ButtonCustom, ModalCustom
} from '@components';
import { scaleSize, localize } from '@utils';

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
                    height: scaleSize(200),
                    width: scaleSize(420),
                    backgroundColor: '#fff',
                    borderRadius: scaleSize(15),
                    paddingTop: scaleSize(16)
                }} >
                    <View style={{ flex: 1, alignItems: 'center' }} >
                        <Text style={{ color: '#0764B0', fontSize: scaleSize(24), fontWeight: 'bold' }} >
                            {`${localize('Please wait', language)}!`}
                        </Text>
                        <Text style={{ color: '#404040', fontSize: scaleSize(14), marginTop: scaleSize(4),textAlign:"center" }} >
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


