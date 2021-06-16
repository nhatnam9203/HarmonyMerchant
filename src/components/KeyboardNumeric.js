import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { scaleSize } from '../utils';
import ICONS from "@resources";

const data = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

export default class KeyboardNumeric extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { onPress = () => { } } = this.props;
        return (
            <>
                <View style={styles.container}>
                    {/* -------- NUMPAD -------- */}
                    {
                        data.map((number, key) => (
                            <NumPad
                                onPress={() => onPress(number)}
                                number={number}
                                key={"numpad" + key}
                            />
                        ))
                    }

                    {/* -------- BUTTON DELETE -------- */}
                    <Pressable
                        onPress={() => onPress("x")}
                        style={({ pressed }) => styles.numPad(pressed)}
                    >
                        {
                            ({ pressed }) => (
                                <Image
                                    resizeMode='contain'
                                    style={styles.iconDelete}
                                    source={
                                        pressed ? ICONS.number_delete_white :
                                            ICONS.number_delete
                                    }
                                />
                            )
                        }
                    </Pressable>
                </View>
                <View style={styles.line} />
            </>
        )
    }
}

class NumPad extends Component {
    render() {
        const { number = "", onPress = () => { } } = this.props;
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => styles.numPad(pressed)}
            >
                {
                    ({ pressed }) => (
                        <Text style={styles.numpadText(pressed)}>
                            {number}
                        </Text>
                    )
                }
            </Pressable>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        // height: scaleSize(300),
        paddingHorizontal: scaleSize(18),
        marginTop : scaleSize(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        zIndex: 9999999999999,
    },
    numPad: (pressed) => {
        return {
            width: '32%',
            height: scaleSize(55),
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: "#dddddd",
            borderRadius: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: scaleSize(7),
            backgroundColor: pressed ? "#1B68AC" : "white",
            borderWidth: pressed ? 0 : 1,
        }
    },
    numpadText: (pressed) => {
        return {
            fontWeight: '600',
            color: "#404040",
            fontSize: scaleSize(22),
            color: pressed ? "white" : "#404040",
        }
    },
    iconDelete: {
        width: scaleSize(35),
        height: scaleSize(35),
    },
    line : {
        width: '100%',
        height: 2,
        backgroundColor : '#eeeeee',
        marginTop : scaleSize(10)
    }
});
