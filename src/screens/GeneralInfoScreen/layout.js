import React from 'react';
import {
    View,
    Image,
    ScrollView,
    TextInput
} from 'react-native';

import { InputForm, FormInfoParent,Text } from '../../components';
import { scaleSzie } from '../../utils';
import styles from './style';
import Configs from '../../configs';
import IMAGE from '../../resources';

export default class Layout extends React.Component {

    render() {
        return (
            <FormInfoParent
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
                                title="Legal Business Name * "
                                subTitle="(as shown on your income tax return)"
                                placeholder="Legal Business Name"
                            />
                            <View style={{ flexDirection: 'row' }} >
                                <View style={{width:scaleSzie(100)}} >
                                    <InputForm
                                        title="Federal Tax ID *"
                                        subTitle=""
                                        placeholder=""
                                    />
                                </View>
                                <View style={{width:scaleSzie(20),justifyContent:'center',alignItems:'center'}} >
                                    <Text style={{fontSize :scaleSzie(20)}} >
                                        -
                                    </Text>
                                </View>
                                <View style={{ width:scaleSzie(250)}} >
                                    <InputForm
                                        title="   "
                                        subTitle=""
                                        placeholder=""
                                    />
                                </View>
                            </View>
                            <InputForm
                                title="Doing Business As Name (DBA) *"
                                subTitle=""
                                placeholder="DBA"
                            />
                            <InputForm
                                title="DBA Business Address *"
                                subTitle="(no P.O. Box)"
                                placeholder="DBA"
                            />
                            <View style={{ flexDirection: 'row' }} >
                                <View style={{ flex: 1 }} >
                                    <InputForm
                                        title="Business Phone Number *"
                                        subTitle=""
                                        placeholder=""
                                    />
                                </View>
                                <View style={{ flex: 1 }} />
                            </View>

                            <InputForm
                                title="Contact's  Email Address *"
                                subTitle=""
                                placeholder="example@gmail.com"
                            />

                            <View style={{ flexDirection: 'row' }} >
                                <View style={{ flex: 1 }} >
                                    <InputForm
                                        title="Contact Name *"
                                        subTitle=""
                                        placeholder="First name"
                                    />
                                </View>
                                <View style={{ flex: 1, paddingLeft: scaleSzie(20) }} >
                                    <InputForm
                                        title="   "
                                        subTitle=""
                                        placeholder="Last name"
                                    />
                                </View>
                            </View>
                            <InputForm
                                title="Title/Position *"
                                subTitle=""
                                placeholder="Manager"
                            />

                            <View style={{ flexDirection: 'row' }} >
                                <View style={{ flex: 1 }} >
                                    <InputForm
                                        title="Contact's Phone Number *"
                                        subTitle=""
                                        placeholder=""
                                    />
                                </View>
                                <View style={{ flex: 1 }} />
                            </View>

                            <View style={{ height: scaleSzie(250) }} />
                        </ScrollView>
                    </View>
                </View>
            </FormInfoParent>

        );
    }
}
