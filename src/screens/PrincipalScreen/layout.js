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
                title="Principal Information"
                back={() => this.props.navigation.goBack()}
                next={() => alert('next')}

            >
                <View style={{ paddingHorizontal: scaleSzie(16), marginTop: scaleSzie(10) }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                        Provide the following information for each individual who owns, directly or indirectly,
                         25% or more of the equity interest of your business.
                    </Text>
                </View>

                <View style={{ flex: 1, paddingHorizontal: scaleSzie(25) }} >
                    <View style={{ height: scaleSzie(16) }} />
                    <Text style={{
                        color: '#404040', fontSize: scaleSzie(18), fontWeight: 'bold',
                        marginBottom: scaleSzie(10)
                    }} >
                        Principal 1 *
                            </Text>

                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ flex: 1 }} >
                            <InputForm
                                title="Principal Name *"
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
                    <InputForm
                        title="Ownership (%) *"
                        subTitle=""
                        placeholder=""
                    />

                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ flex: 1 }} >
                            <InputForm
                                title="Home Phone *"
                                subTitle=""
                                placeholder=""
                            />
                        </View>
                        <View style={{ flex: 1, paddingLeft: scaleSzie(20) }} >
                            <InputForm
                                title="Mobile Phone"
                                subTitle=""
                                placeholder=""
                            />
                        </View>
                    </View>

                    <InputForm
                        title="Address *"
                        subTitle=""
                        placeholder="Home address"
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

                    <InputForm
                        title="Years at This Address *"
                        subTitle=""
                        placeholder=""
                    />
                    <InputForm
                        title="Social Security Number (SSN) *"
                        subTitle=""
                        placeholder=""
                    />
                    {/* ------ thieu ----- */}
                    <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginBottom: scaleSzie(6) }} >
                        Date of Birth (dd/mm/yy) *
                            </Text>
                    <View style={{
                        height: scaleSzie(30), marginBottom: scaleSzie(24),
                        flexDirection: 'row', alignItems: 'flex-end'
                    }} >
                        <View style={{ width: scaleSzie(120) }} >
                            <Dropdown
                                label={'1'}
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
                        <View style={{ width: scaleSzie(120), marginHorizontal: scaleSzie(20) }} >
                            <Dropdown
                                label={'Jan'}
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
                        <View style={{ width: scaleSzie(120) }} >
                            <Dropdown
                                label={'2000'}
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
                    </View>

                    {/* ------------- */}
                    <InputForm
                        title="Email Address *"
                        subTitle=""
                        placeholder="example@gmail.com"
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

                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ flex: 1, paddingRight: scaleSzie(20) }} >
                            <InputForm
                                title="Principal Name *"
                                subTitle=""
                                placeholder="First name"
                            />
                        </View>
                        <View style={{ width: scaleSzie(180), }} >
                            <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginBottom: scaleSzie(5) }} >
                                State Issued *
                            </Text>
                            <Dropdown
                                label={'2000'}
                                data={data}
                                // value={timeStart}
                                // onChangeText={(value) => this.setState({ timeStart: value })}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#6A6A6A',
                                    width: scaleSzie(180),
                                    height: scaleSzie(30)
                                }}
                            />
                        </View>
                    </View>

                    {/* ------ Take Photo ---- */}

                    <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginTop: scaleSzie(10) }} >
                        Please take or upload photos of Driver License
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

                    {/* ---------------------- */}
                </View>
            </FormInfoParent>

        );
    }
}
