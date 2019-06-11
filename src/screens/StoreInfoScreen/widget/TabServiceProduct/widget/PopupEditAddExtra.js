import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Dimensions,
    ScrollView
} from 'react-native';

import { ButtonCustom, PopupParent, Dropdown } from '../../../../../components';
import { scaleSzie } from '../../../../../utils';

const { width } = Dimensions.get('window');

let data = [{
    value: 'Banana',
}, {
    value: 'Mango',
}, {
    value: 'Pear',
}
];

class PopupEditAddExtra extends React.Component {

    render() {
        const { title, visible, onRequestClose, doneAddExtra ,isSave} = this.props;
        // const temptHeight = width - scaleSzie(800);
        const temptTitleButton = isSave ? 'Save' : 'Done';
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(20) }}
            >
                <View style={{
                    height: scaleSzie(400), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(30)
                }} >
                    <View style={{ flex: 1, }} >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >

                            {/* ------ Extra ---- */}
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(20) }} >
                                Extra name
                            </Text>
                            <View style={{
                                height: scaleSzie(30), borderWidth: 1, borderColor: '#6A6A6A',
                                paddingLeft: scaleSzie(10),
                            }} >
                                <TextInput
                                    placeholder="Extra name"
                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                />
                            </View>
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                Description
                            </Text>
                            <View style={{
                                height: scaleSzie(60), borderWidth: 1, borderColor: '#6A6A6A',
                                paddingLeft: scaleSzie(10), backgroundColor: '#FAFAFA', paddingTop: scaleSzie(5)
                            }} >
                                <TextInput
                                    placeholder=""
                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                    multiline={true}
                                />
                            </View>
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                Duration
                            </Text>
                            <ItemTime
                                title="Minutes"
                            />
                            <View style={{ height: scaleSzie(70), flexDirection: 'row' }} >
                                <View style={{ flex: 1, paddingRight: scaleSzie(50) }}  >
                                    <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                        Price
                                    </Text>
                                    <View style={{
                                        height: scaleSzie(30), paddingHorizontal: scaleSzie(5),
                                        borderWidth: 1, borderColor: '#6A6A6A', flexDirection: 'row'
                                    }} >
                                        <TextInput
                                            style={{ flex: 1, fontSize: scaleSzie(16) }}
                                            placeholder="$ 100"
                                        />
                                    </View>
                                </View>
                                {/* ------ */}
                                <View>
                                    <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                        Status
                                    </Text>
                                    <View style={{
                                        height: scaleSzie(30), width: scaleSzie(90),
                                        flexDirection: 'row'
                                    }} >
                                        <Dropdown
                                            label='Active'
                                            data={data}
                                            // value={'Service Categories'}
                                            // onChangeText={(value) => this.updateUserInfo('state', value, 'address')}
                                            containerStyle={{
                                                backgroundColor: '#F1F1F1',
                                                borderWidth: 1,
                                                borderColor: '#6A6A6A',
                                                flex: 1
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ height: scaleSzie(250) }} />
                        </ScrollView>
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{ height: scaleSzie(50), alignItems: 'center' }} >
                        <ButtonCustom
                            width={150}
                            height={35}
                            backgroundColor="#0764B0"
                            title={temptTitleButton}
                            textColor="#fff"
                            onPress={() =>doneAddExtra()}
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

const ItemTime = (props) => {
    const { title } = props;
    return (
        <View>
            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                {title}
            </Text>
            <View style={{
                height: scaleSzie(30), width: scaleSzie(90),
                borderWidth: 1, borderColor: '#6A6A6A', flexDirection: 'row'
            }} >
                <View style={{ flex: 1, paddingLeft: scaleSzie(5) }} >
                    <TextInput
                        style={{ flex: 1, fontSize: scaleSzie(16) }}
                    />
                </View>
                <View style={{ justifyContent: 'flex-end', paddingRight: 4 }} >
                    <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14) }} >
                        min
                </Text>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        height: scaleSzie(50),
        flexDirection: 'row',
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center'
    },
})

export default PopupEditAddExtra;

