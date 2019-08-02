import React from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator
} from 'react-native';

import { ButtonCustom, PopupParent, Button, ModalCustom } from '@components';
import { scaleSzie, localize, getCategoryName } from '@utils';
import IMAGE from '@resources';

const { width } = Dimensions.get('window');

class PopupLoadingExport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        const { title, visible, onRequestClose, language } = this.props;

        return (
            <ModalCustom
                transparent={true}
                visible={visible}
                onRequestClose={() => { }}
            // style={style}
            >
                <View style={{
                    height: scaleSzie(280),
                    width: scaleSzie(420),
                    backgroundColor: '#fff',
                    borderRadius: scaleSzie(15),
                    paddingTop: scaleSzie(16)
                }} >
                    <View style={{ flex: 1, alignItems: 'center' }} >
                        <Text style={{ color: '#0764B0', fontSize: scaleSzie(24), fontWeight: 'bold' }} >
                            {localize('Please wait !', language)}
                        </Text>
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18), marginTop: scaleSzie(4) }} >
                            {localize('PDF file is being created ...', language)}
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

                        <View style={{paddingVertical:scaleSzie(14)}} >
                            <ButtonCustom
                                width={scaleSzie(120)}
                                height={40}
                                backgroundColor="#F1F1F1"
                                title={localize('Cancel', language)}
                                textColor="#6A6A6A"
                                onPress={() =>onRequestClose()}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5',borderRadius:0 }}
                                styleText={{ fontSize: scaleSzie(15), fontWeight: 'normal' }}
                            />
                        </View>

                    </View>
                </View>
            </ModalCustom>
        );
    }
}



const styles = StyleSheet.create({
})

export default PopupLoadingExport;


