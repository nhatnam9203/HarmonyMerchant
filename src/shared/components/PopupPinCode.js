import { ButtonGradient, ButtonGradientWhite } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { colors, fonts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, TextInput, View, Image } from "react-native";
import { useDispatch } from "react-redux";
import ICON from '@resources';

const PIN_CODE_CHARS = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ".",
    "0",
    "delete",
];
const MAX_LENGTH = 4;

/**
 * Component Popup
 */
export const PopupPinCode = React.forwardRef(
    ({ onForceClosePopup, onClosePopup, onSubmit }, ref) => {
        const dispatch = useDispatch();
        const [t] = useTranslation();

        /**
         * useRef
         */
        const dialogRef = React.useRef(null);
        const textInputRef = React.useRef(null);


        /**
         * useState
         */
        const [value, setValue] = React.useState("");
        const [isLoading, setLoading] = React.useState(false);

        /**
         * Call API check permission
         */
        const onHandleSubmit = async () => {
            if (onSubmit && typeof onSubmit === 'function') {
                onSubmit(value);
            }
        };

        /**
         * Handle Force Close Popup Events
         */
        const onHandleForceClosePopup = () => {
            clearTextInput();

            if (onForceClosePopup && typeof onForceClosePopup === "function") {
                onForceClosePopup();
            }
        };

        /**
         * Handle Close Popup Events
         */
        const onHandleClose = () => {
            dialogRef.current?.hide();
            clearTextInput();

            if (onClosePopup && typeof onClosePopup === "function") {
                onClosePopup();
            }
        };


        /**
         * Clear text input
         */
        const clearTextInput = () => {
            setValue("");
            textInputRef.current?.clear();
        };

        /**
         * Ref Components
         */
        React.useImperativeHandle(ref, () => ({
            show: () => {
                clearTextInput();
                dialogRef.current?.show();
            },
            hide: () => {
                onHandleClose();
                dialogRef.current?.hide();
            },
        }));

        /**
         * Render number button
         */
        const renderItem = ({ item = "" }) => {
            const onPressItem = () => {
                if (item === "delete") {
                    if (value?.length > 0) setValue((prev) => prev.slice(0, -1));
                } else if (value?.trim().length === 0 || value?.length < MAX_LENGTH) {
                    setValue((prev) => `${prev}${item}`);
                }
            };

            return (
                <ButtonGradientWhite
                    width={scaleWidth(100)}
                    height={scaleWidth(60)}
                    borderRadius={scaleWidth(3)}
                    onPress={onPressItem}
                    borderColor={"#ddd"}
                >
                    {item === "delete" ? <Image resizeMode="center" style={styles.itemStyle} source={ICON["remove_pin_code"]} /> : <Text style={styles.textStyle}>{item}</Text>}
                </ButtonGradientWhite>
            );
        };

        /**
         * Render Popup
         */
        return (
            <View>
                <DialogLayout
                    title={t("Lock Screen")}
                    ref={dialogRef}
                    hideCloseButton={true}
                    bottomChildren={() => (
                        <View style={styles.bottomStyle}>
                            <ButtonGradient
                                label={t("Submit")}
                                width={scaleWidth(140)}
                                height={scaleHeight(40)}
                                borderRadius={scaleWidth(3)}
                                disable={value?.length !== MAX_LENGTH}
                                onPress={onHandleSubmit}
                                loading={isLoading}
                            />
                        </View>
                    )}
                    style={styles.dialog}
                    onForceClose={onHandleForceClosePopup}
                >
                    <View style={styles.container}>
                        <View style={styles.marginVertical} />
                        <Text style={styles.title}>
                            {t("Enter your PIN code")}
                        </Text>
                        <View style={styles.marginVertical} />
                        <View style={styles.input}>
                            <TextInput
                                ref={textInputRef}
                                value={value}
                                secureTextEntry={true}
                                blurOnSubmit={false}
                                style={styles.textInput}
                                editable={false}
                                maxLength={MAX_LENGTH}
                                placeholder={t("Your PIN")}
                            />
                        </View>

                        <View style={styles.marginVertical} />
                        <FlatList
                            bounces={false}
                            style={styles.flatList}
                            data={PIN_CODE_CHARS}
                            renderItem={renderItem}
                            keyExtractor={(item) => item}
                            numColumns={3}
                            columnWrapperStyle={styles.columnWrapper}
                            ItemSeparatorComponent={() => (
                                <View style={styles.itemSeparator} />
                            )}
                        />
                        <View style={styles.marginVertical} />
                    </View>
                </DialogLayout>
            </View>
        );
    }
);

const styles = StyleSheet.create({
    dialog: {
        flex: 0,
        width: scaleWidth(420),
        backgroundColor: colors.WHITE
    },

    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 0,
    },

    row: { flexDirection: "row", alignItems: "center" },

    bottomStyle: {
        width: "100%",
        height: scaleHeight(80),
        justifyContent: "space-evenly",
        alignItems: "center",
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },

    title: {
        fontFamily: fonts.MEDIUM,
        fontSize: scaleFont(20),
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: colors.GREYISH_BROWN,
    },



    input: {
        width: scaleWidth(320),
        height: scaleHeight(48),
        borderRadius: scaleWidth(3),
        backgroundColor: colors.WHITE,
        borderStyle: "solid",
        borderWidth: scaleWidth(1),
        borderColor: "#dddddd",
        justifyContent: "center",
        alignItems: "center",
    },

    textInput: {
        fontFamily: fonts.MEDIUM,
        fontSize: scaleFont(20),
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: scaleWidth(2),
        textAlign: "center",
        color: colors.GREYISH_BROWN,
        width: "100%",
    },

    marginVertical: {
        height: scaleHeight(16),
    },

    flatList: { width: scaleWidth(320) },

    charButton: {
        width: scaleWidth(72),
        height: scaleHeight(54),
        borderRadius: scaleWidth(3),
        borderStyle: "solid",
        borderWidth: scaleWidth(1),
        borderColor: "#eeeeee",
    },

    columnWrapper: {
        justifyContent: "space-between",
    },

    itemSeparator: {
        width: scaleWidth(4),
        height: scaleHeight(10),
    },

    textStyle: {
        fontFamily: fonts.MEDIUM,
        fontSize: scaleFont(26),
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: colors.GREYISH_BROWN
    },

    itemStyle: {
        width: scaleWidth(32),
        height: scaleHeight(32),
    }


});
