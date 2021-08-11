import {
    ButtonGradient,
  } from "@shared/components";
  import { colors, layouts } from "@shared/themes";
  import React from "react";
  import { useTranslation } from "react-i18next";
  import { StyleSheet, Text, View, TextInput } from "react-native";
  import _ from "lodash";
  
  export const Layout = ({
    layoutData,
    onChangeText,
    onButtonSavePress,
  }) => {
    const { t } = useTranslation();
    
    const onHandleSave = () => {
        onButtonSavePress(layoutData);
      };
    const renderRow = (title, key) => {
        return (
            <View style={{marginTop: scaleHeight(20)}}>
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.fontNormal}>
                    {title}
                    </Text>
                    <Text style={styles.fontRed}>{" *"}</Text>
                </View>

                <View style={styles.textInputView}>
                    <TextInput
                        style={styles.textInput}
                        value={_.get(layoutData, key)}
                        onChangeText={(value) => onChangeText(value, key)}
                    />
                </View>
            </View>
        )
    }
    
    return (
      <View style={styles.container}>
        <View style={styles.viewContent}>
          <Text style={layouts.formTitleBlue}>{t("Layout")}</Text>
          {renderRow(t("Column 1"), "column1")}
          {renderRow(t("Column 2"), "column2")}
          {renderRow(t("Column 3"), "column3")}
        </View>

        <View style={{alignItems: 'center'}}>
        <ButtonGradient
            label={t("SAVE")}
            width={scaleWidth(400)}
            height={scaleHeight(60)}
            borderRadius={scaleWidth(3)}
            fontSize={scaleFont(25)}
            textColor={colors.WHITE}
            fontWeight="500"
            onPress={onHandleSave}
        />
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'space-between',
        marginBottom: scaleHeight(40)
    },
    textInputView: {
        height: scaleHeight(35),
        width: '50%',
        borderColor: 'rgb(227,227,227)',
        borderWidth: scaleHeight(1),
        paddingHorizontal: scaleHeight(10),
    },
    textInput: { 
        flex: 1, 
        fontSize: scaleFont(14) 
    },
    fontNormal: {
      fontSize: scaleFont(17),
      fontFamily: fonts.LIGHT,
    },
    fontRed: {
      fontSize: scaleFont(25),
      color: colors.ORANGEY_RED,
    },
    viewContent:{
      marginLeft: scaleWidth(20),
      marginTop: scaleHeight(20)
    }
  });
  