import React from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Image,
    ScrollView,
    TextInput
} from 'react-native';

import { Button, Text, Dropdown } from '@components';
import { scaleSzie } from '@utils';
import Configs from "@configs";
import ICON from "@resources";

class EditOrCreateCustomerTab extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(10) }} >
                {/* ------------- Header ------------ */}
                <View style={{
                    height: scaleSzie(45), flexDirection: "row",
                    alignItems: "center", justifyContent: "space-between", marginTop: scaleSzie(10)
                }} >
                    <Text style={{ color: "#0764B0", fontSize: scaleSzie(20), fontWeight: "600" }} >
                        {`New customer`}
                    </Text>
                    <View style={{
                        width: scaleSzie(85), height: scaleSzie(28), backgroundColor: "#0764B0", borderRadius: scaleSzie(20),
                        justifyContent: "center", alignItems: "center"
                    }} >
                        <Text style={{ color: "#fff", fontSize: scaleSzie(13) }} >
                            {`Normal`}
                        </Text>
                    </View>
                </View>

                {/* ------------- Line ------------ */}
                <View style={{ height: 1, backgroundColor: "#EEEEEE" }} />

                <View style={{ flex: 1, flexDirection: "row" }} >
                    {/* ------------------ Left Content ------------------ */}
                    <View style={{ flex: 1 }} >
                        <ScrollView>
                            <View style={{ height: scaleSzie(18) }} />
                            {/* --------- Item -------- */}
                            <FromItem
                                title={`First Name`}
                                isRequired={true}
                                placeholder="First name"
                            />

                            <FromItem
                                title={`Last Name`}
                                isRequired={true}
                                placeholder="Last Name"
                            />

                            <FromItem
                                title={`Phone Number`}
                                isRequired={true}
                                placeholder="Enter phone number"
                            />

                            <FromItem
                                title={`Contact email`}
                                placeholder="Email address"
                            />

                            <Text style={{ fontSize: scaleSzie(14), color: "#404040", fontWeight: "600" }} >
                                {`Gender`}
                            </Text>
                            <View style={{ width: scaleSzie(150), height: scaleSzie(35), marginTop: scaleSzie(10) }} >
                                <Dropdown
                                    label={"Gender"}
                                    data={[
                                        { value: "Male" },
                                        { value: "Female" }
                                    ]}
                                    value={"timezone"}
                                    // onChangeText={(timezone) => this.setState({ timezone })}
                                    containerStyle={{
                                        borderWidth: 1,
                                        borderColor: '#C5C5C5',
                                        flex: 1
                                    }}
                                />
                            </View>

                        </ScrollView>
                    </View>

                    {/* ----------------- Padding ------------ */}
                    <View style={{ width: scaleSzie(30) }} />

                    {/* ------------------ Right Content ------------------ */}
                    <View style={{ flex: 1 }} >
                        <ScrollView>
                            <View style={{ height: scaleSzie(18) }} />
                            <Text style={{ fontSize: scaleSzie(14), color: "#404040", fontWeight: "600" }} >
                                {`Birthday`}
                            </Text>

                            <View style={{ height: scaleSzie(35), flexDirection: "row", justifyContent: "space-between", marginTop: scaleSzie(10),marginBottom:scaleSzie(14)}} >

                                <View style={{ width: scaleSzie(95), }} >
                                    <Dropdown
                                        label={"Day"}
                                        data={[
                                            { value: "Male" },
                                            { value: "Female" }
                                        ]}
                                        value={""}
                                        // onChangeText={(timezone) => this.setState({ timezone })}
                                        containerStyle={{
                                            borderWidth: 1,
                                            borderColor: '#C5C5C5',
                                            flex: 1
                                        }}
                                    />
                                </View>
                                <View style={{ width: scaleSzie(95), }} >
                                    <Dropdown
                                        label={"Month"}
                                        data={[
                                            { value: "Male" },
                                            { value: "Female" }
                                        ]}
                                        value={""}
                                        // onChangeText={(timezone) => this.setState({ timezone })}
                                        containerStyle={{
                                            borderWidth: 1,
                                            borderColor: '#C5C5C5',
                                            flex: 1
                                        }}
                                    />
                                </View>
                                <View style={{ width: scaleSzie(95), }} >
                                    <Dropdown
                                        label={"Year"}
                                        data={[
                                            { value: "Male" },
                                            { value: "Female" }
                                        ]}
                                        value={""}
                                        // onChangeText={(timezone) => this.setState({ timezone })}
                                        containerStyle={{
                                            borderWidth: 1,
                                            borderColor: '#C5C5C5',
                                            flex: 1
                                        }}
                                    />
                                </View>
                            </View>

                             {/* ------------ Address --------- */}
                             <FromItem
                                title={`Address`}
                                isRequired={true}
                                placeholder="Address"
                            />

                            {/* ----------- City + State ------------- */}

                             {/* ------------ Referrer Phone Number --------- */}
                             <FromItem
                                title={`Referrer Phone Number`}
                                isRequired={true}
                                placeholder="Enter phone number"
                            />

                             {/* ------------ Note --------- */}
                             <Text style={{ fontSize: scaleSzie(14), color: "#404040", fontWeight: "600" ,marginBottom:scaleSzie(10)}} >
                                {`Note:`}
                            </Text>
                            <View style={{height:scaleSzie(60),borderColor:"#CCCCCC",borderWidth:1}} >

                            </View>

                        </ScrollView>
                    </View>
                </View>
            </View>
        );
    }
}

const FromItem = ({ title, isRequired, placeholder }) => {

    return (
        <View style={{ marginBottom: scaleSzie(14) }} >
            <Text style={{ fontSize: scaleSzie(14), color: "#404040", fontWeight: "600" }} >
                {`${title}`}
                {
                    isRequired ? <Text style={{ color: "#FF3B30" }} >
                        {` *`}
                    </Text> : null
                }

            </Text>

            <View style={{ height: scaleSzie(35), borderWidth: 1, borderColor: "#CCCCCC", marginTop: scaleSzie(10), paddingHorizontal: scaleSzie(10) }} >
                <TextInput
                    style={{
                        flex: 1,
                        fontSize: scaleSzie(14),
                        color: "#404040"

                    }}
                    placeholder={placeholder ? placeholder : ""}
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    SHADOW: {
        backgroundColor: "#fff",
        borderRadius: scaleSzie(4),
        ...Platform.select({
            ios: {
                shadowRadius: 2,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOpacity: 0.6,
                shadowOffset: { width: 0, height: 1 },
            },

            android: {
                elevation: 2,
            },
        })
    },

})

export default EditOrCreateCustomerTab;

