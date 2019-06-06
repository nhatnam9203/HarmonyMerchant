import React from 'react';
import {
    View,
    Image,
    ScrollView,
    TextInput
} from 'react-native';

import { InputForm, FormInfoParent, Text, Dropdown } from '../../components';
import { scaleSzie } from '../../utils';
import styles from './style';
import Configs from '../../configs';
import IMAGE from '../../resources';

let data = [{
    value: 'Banana',
}, {
    value: 'Mango',
}, {
    value: 'Pear',
}
];

export default class Layout extends React.Component {

    render() {
        return (
            <FormInfoParent
                title="General Information"
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
                            <InputForm
                                title="Doing Business As Name (DBA) *"
                                subTitle=""
                                placeholder="DBA"
                            /><View style={{ flexDirection: 'row' }} >
                                <View style={{ width: scaleSzie(100) }} >
                                    <InputForm
                                        title="Federal Tax ID *"
                                        subTitle=""
                                        placeholder=""
                                    />
                                </View>
                                <View style={{ width: scaleSzie(20), justifyContent: 'center', alignItems: 'center' }} >
                                    <Text style={{ fontSize: scaleSzie(20) }} >
                                        -
                                </Text>
                                </View>
                                <View style={{ width: scaleSzie(250) }} >
                                    <InputForm
                                        title="   "
                                        subTitle=""
                                        placeholder=""
                                    />
                                </View>
                            </View>
                            <InputForm
                                title="DBA Business Address *"
                                subTitle="(no P.O. Box)"
                                placeholder="DBA address"
                                style={{
                                    marginBottom: scaleSzie(10)
                                }}
                            />
                            <View style={{
                                height: scaleSzie(30), marginBottom: scaleSzie(24), justifyContent: 'space-between',
                                flexDirection: 'row', alignItems: 'flex-end'
                            }} >
                                <View style={{ width: scaleSzie(180) }} >
                                    <InputForm
                                        title=""
                                        subTitle=""
                                        placeholder="City"
                                        style={{
                                            marginBottom: 0
                                        }}
                                    />
                                </View>
                                <View style={{ width: scaleSzie(180), backgroundColor: 'red' }} >
                                    <Dropdown
                                        label={'State'}
                                        data={data}
                                        // value={timeStart}
                                        // onChangeText={(value) => this.setState({ timeStart: value })}
                                        containerStyle={{
                                            backgroundColor: '#F1F1F1',
                                            borderWidth: 1,
                                            borderColor: '#6A6A6A',
                                            flex: 1
                                        }}
                                    />
                                </View>
                                <View style={{ width: scaleSzie(180) }} >
                                    <InputForm
                                        title=""
                                        subTitle=""
                                        placeholder="Zip"
                                        style={{
                                            marginBottom: 0
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
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
