import {
    ButtonGradient,
    ButtonGradientRed,
    SearchBar,
  } from "@shared/components";
  import { Table } from "@shared/components/CustomTable";
  import { getUniqueId } from "@shared/components/CustomTable/helpers";
  import { colors, layouts } from "@shared/themes";
  import { dateToString, DATE_SHOW_FORMAT_STRING } from "@shared/utils";
  import React from "react";
  import { useTranslation } from "react-i18next";
  import { StyleSheet, Text, View } from "react-native";
  import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";
  import _ from "lodash";
  
  export const Layout = ({
    layout,
    onChangeText,
    onButtonSavePress,
  }) => {
    const { t } = useTranslation();
    
    const onHandleSave = () => {
        onButtonSavePress(layout);
      };
    const renderRow = (title, key) => {
        return (
            <View>
                <View style={layouts.formRow}>
                    <Text style={layouts.fontLightBrown}>
                    {title}
                    </Text>
                    <Text style={{color: 'red'}}>{"*"}</Text>
                </View>

                <View style={styles.textInputView}>
                    <TextInput
                        style={styles.textInput}
                        value={_.get(layout, key)}
                        onChangeText={(value) => onChangeText(value, key)}
                    />
                </View>
            </View>
        )
    }
    
    return (
      <View style={styles.container}>
        <View style={layouts.formRow}>
            <Text style={layouts.formTitleBlue}>{t("Layout")}</Text>
        </View>
        {renderRow(t("Column 1"), "column1")}
        {renderRow(t("Column 2"), "column2")}
        {renderRow(t("Column 3"), "column3")}

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
  });
  