import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { Dropdown } from './react-native-material-dropdown';
import connectRedux from '@redux/ConnectRedux';

import { scaleSzie } from '../utils';

class PopupChangeStylist extends React.Component {

    getStaffDataDropdown(staffs) {

    }

    render() {
        const { title, visible, listStaffByMerchant, onRequestClose, confimYes } = this.props;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                width={scaleSzie(200)}
            >
                <View style={{
                    height: scaleSzie(250), backgroundColor: '#FAFAFA',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(16),
                    paddingTop: scaleSzie(20), paddingBottom: scaleSzie(16)
                }} >
                    <View style={{ flex: 1 }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(16), marginBottom: scaleSzie(5) }} >
                            Stylist
                        </Text>
                        {/* ------- Dropdown -------- */}
                        <View style={{ height: scaleSzie(40), marginBottom: scaleSzie(10) }} >
                            <Dropdown
                                label='Facial'
                                data={[{ value: 'Phi' }, { value: 'Tam' }]}
                                value={'Phi'}
                                // onChangeText={(value) => this.updateProductInfo('categoryId', value)}
                                containerStyle={{
                                    backgroundColor: '#fff',
                                    borderWidth: 1,
                                    borderColor: '#C5C5C5',
                                    flex: 1
                                }}
                            />
                        </View>
                        {/* ------- Tip -------- */}
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(16), marginBottom: scaleSzie(5) }} >
                            Price ($)
                        </Text>
                        {/* ------- Box -------- */}
                        <View style={{ height: scaleSzie(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5', }} >

                        </View>
                         {/* ------- Button -------- */}
                        <View style={{ flex: 1, alignItems: 'center' ,justifyContent:'flex-end'}} >
                            <ButtonCustom
                                width={scaleSzie(120)}
                                height={45}
                                backgroundColor="#0764B0"
                                title="Submit"
                                textColor="#fff"
                                onPress={() => this.props.backTab()}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5',
                                borderRadius: 4
                            }}
                            />
                        </View>
                    </View>
                </View>
            </PopupParent>
        );
    }

}



const mapStateToProps = state => ({
    listStaffByMerchant: state.staff.listStaffByMerchant
})



export default connectRedux(mapStateToProps, PopupChangeStylist);

