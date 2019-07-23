import React from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    Dimensions,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { ButtonCustom, PopupParent, Dropdown } from '@components';
import { scaleSzie, localize, getCategoryName } from '@utils';
import IMAGE from '@resources';

const { width } = Dimensions.get('window');

class PopupCustomerDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        const { title, visible, onRequestClose, isSave, language
        } = this.props;
        const temptHeight = width - scaleSzie(500);
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(20) }}
            >
                <View style={{
                    height: scaleSzie(temptHeight),
                    backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15),
                    borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(30)
                }} >
                    <View style={{ flex: 1 }} >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                               <TouchableOpacity activeOpacity={1}>
                            {/* -------------------- */}
                            <View style={{ marginTop: scaleSzie(14), flexDirection: 'row' }} >
                                <View style={{ flex: 1 }} >
                                    <ItemDetail
                                        title={`${localize('First Name', language)} *`}
                                        value={'Adrienne'}
                                    />
                                </View>
                                <View style={{ flex: 1 }} >
                                    <ItemDetail
                                        title={`${localize('Last Name', language)} *`}
                                        value={'Miller'}
                                    />
                                </View>
                            </View>
                            {/* -------------------- */}
                            <ItemDetail
                                style={{ marginTop: scaleSzie(12) }}
                                title={`${localize('Phone Number', language)} *`}
                                value={'(362) 200-4503'}
                            />

                            {/* -------------------- */}
                            <ItemDetail
                                style={{ marginTop: scaleSzie(12) }}
                                title={`${localize('Contact email', language)}:`}
                                value={'hillct@yahoo.com'}
                            />

                            {/* -------------------- */}
                            <ItemDetail
                                style={{ marginTop: scaleSzie(12) }}
                                title={`${localize('Address', language)}`}
                                value={'Unknown'}
                            />

                            {/* -------------------- */}
                            <ItemDetail
                                style={{ marginTop: scaleSzie(12) }}
                                title={`${localize('Referrer Phone Number', language)}`}
                                value={'(874) 895-8899'}
                            />

                            {/* -------------------- */}
                            <ItemDetail
                                style={{ marginTop: scaleSzie(12) }}
                                title={`${localize('Note', language)}`}
                                value={'- Note about customers favourite'}
                            />

                            {/* -----  */}
                            <View style={{ height: scaleSzie(250) }} />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{ height: scaleSzie(50), alignItems: 'center' }} >
                        <ButtonCustom
                            width={150}
                            height={35}
                            backgroundColor="#0764B0"
                            title={'Edit'}
                            textColor="#fff"
                            onPress={this.doneAddProduct}
                            style={{ borderRadius: scaleSzie(2) }}
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

const ItemDetail = ({ title, value, style }) => {
    return (
        <View style={style} >
            <Text style={{ color: '#404040', fontSize: scaleSzie(16), marginBottom: scaleSzie(10) }} >
                {title}
            </Text>
            <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                {value}
            </Text>
        </View>
    );
}


export default PopupCustomerDetail;


