import React from 'react';
import {
    View,
    Image,
    ScrollView,
    TextInput
} from 'react-native';

import { InputForm, FormInfoParent, Text } from '../../components';
import { scaleSzie } from '../../utils';
import styles from './style';
import Configs from '../../configs';
import IMAGE from '../../resources';


export default class Layout extends React.Component {

    render() {
        return (
            <FormInfoParent
                title="Bank Information"
                back={() => alert('back')}
                next={() => alert('next')}
            >
                <View style={{ flex: 1, paddingHorizontal: scaleSzie(25) }} >
                    <View style={{ flex: 1 }} >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ height: scaleSzie(16) }} />
                            <InputForm
                                title="Bank Name *"
                                subTitle=""
                                placeholder=""
                            />

                            <InputForm
                                title="ABA Routing Number *"
                                subTitle=""
                                placeholder=""
                            />

                            <InputForm
                                title="Checking Account Number (DDA) *"
                                subTitle=""
                                placeholder=""
                            />

                            <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                                Void Check *
                            </Text>
                            <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginTop: scaleSzie(10) }} >
                                Please take or upload photos of void check
                            </Text>

                            <View style={{
                                alignItems: 'center',
                                padding: scaleSzie(10), marginTop: scaleSzie(18)
                            }} >
                                <View style={{
                                    width: scaleSzie(400), height: scaleSzie(200),
                                    borderWidth: 2, borderColor: '#C5C5C5', borderStyle: "dashed",
                                    borderRadius: scaleSzie(14),
                                    alignItems: 'center',
                                    paddingTop: scaleSzie(5)

                                }} >
                                    <Image
                                        source={IMAGE.camera}
                                    />
                                    <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }} >
                                        <Text style={{
                                            color: '#6A6A6A', fontSize: scaleSzie(20), fontWeight: 'bold',
                                        }} >
                                            Take a Photo
                                    </Text>

                                        <Text style={{
                                            color: '#6A6A6A', fontSize: scaleSzie(20),
                                        }} >
                                            Or
                                    </Text>
                                        <View style={{
                                            width: scaleSzie(180), height: scaleSzie(40), backgroundColor: '#F1F1F1',
                                            borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 4, justifyContent: "center", alignItems: 'center'
                                        }} >
                                            <Text style={{
                                                color: '#6A6A6A', fontSize: scaleSzie(20),
                                            }} >
                                                Browse File
                                            </Text>
                                        </View>
                                    </View>

                                </View>
                            </View>
                            <View style={{ height: scaleSzie(250) }} />
                        </ScrollView>
                    </View>
                </View>
            </FormInfoParent>

        );
    }
}
