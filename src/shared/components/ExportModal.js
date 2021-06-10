import IMAGE from '@resources';
import { colors, fonts, layouts } from '@shared/themes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import { ButtonGradient, ButtonGradientWhite } from './Button';
import { CustomInput } from './CustomInput';
import { CustomRadioSelect } from './CustomRadioSelect';

const EXPORT_FUNCTION = [
  { value: 'pdf', label: 'PDF' },
  { value: 'csv', label: 'EXCEL' },
];

export const ExportModal = ({}) => {
  const [t] = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState(EXPORT_FUNCTION);
  const [value, setValue] = React.useState(null);
  const [mode, setMode] = React.useState(null);

  const onHandleChange = (val) => {
    setMode(val); // !! select type export => call server get file here follow type select, set callback
  };

  const onExportButtonPress = () => {
    setOpen((x) => !x); // show dropdown here
  };

  const hideModal = () => {
    setMode(null);
    setValue(null);
  };

  const renderContent = () => {
    switch (mode) {
      case 'csv':
        return (
          <View style={styles.content}>
            <Text style={styles.exportTextStyle}>{t('Save as')}</Text>
            <CustomInput
              style={styles.customInput}
              textInputProps={{
                placeholder: t('Untittle.csv'),
                fontSize: scaleFont(17),
                textAlign: 'left',
                // defaultValue: value,
                // onChangeText: onHandleChange,
              }}
            />
            <View style={layouts.marginVertical} />
            <CustomRadioSelect
              data={[
                { label: t('The products need to order more'), value: 1 },
                { label: t('All product'), value: 0 },
              ]}
              selected={() => {}}
            />

            <View style={styles.bottomStyle}>
              <ButtonGradient
                // onPress={onButtonNewOrderPress}
                label={t('Next')}
                width={scaleWidth(140)}
                height={scaleHeight(40)}
              />
            </View>
          </View>
        );
      case 'pdf':
        return (
          <View style={styles.content}>
            <Text style={styles.titleContent}>
              {t('File created successfully')}
            </Text>
            <View style={layouts.marginVertical} />
            <TouchableOpacity style={styles.fileInfo}>
              <Image
                source={IMAGE.ExportCsvFileImage}
                style={{ width: scaleWidth(39), height: scaleHeight(44) }}
              />
              <View style={styles.pdfFileContent}>
                <Text style={styles.pdfFileTitle}>{'Products.pdf'}</Text>
                <Text style={styles.pdfFileText}>{'152Kb'}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.pdfBottom}>
              <TouchableOpacity>
                <Image source={IMAGE.ExportShareIcon} />
              </TouchableOpacity>
              <View style={layouts.marginHorizontal} />
              <TouchableOpacity>
                <Image source={IMAGE.ExportDownloadIcon} />
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View>
      <DropDownPicker
        items={items}
        open={open}
        setOpen={setOpen}
        setItems={setItems}
        value={value}
        setValue={setValue}
        onChangeValue={onHandleChange}
        onPress={() => {}}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropDownContainerStyle}
        textStyle={styles.textStyle}
        listItemLabelStyle={styles.textStyle}
        containerStyle={styles.containerStyle}
        dropDownDirection="AUTO"
        scrollViewProps={{
          decelerationRate: 'fast',
        }}
        itemKey="value"
        closeAfterSelecting={true}
        showTickIcon={false}
        showArrowIcon={false}
        disableBorderRadius={true}

        // placeholder={placeholder}
      />
      <ButtonGradientWhite
        label={t('Export')}
        width={scaleWidth(100)}
        height={scaleHeight(32)}
        textColor={colors.OCEAN_BLUE}
        fontSize={scaleFont(15)}
        onPress={onExportButtonPress}
        borderColor={open ? colors.OCEAN_BLUE : '#ccc'}
      >
        <View style={layouts.marginHorizontal} />
        <Image
          source={IMAGE.blue_order_export}
          width={scaleWidth(20)}
          height={scaleWidth(20)}
        />
      </ButtonGradientWhite>

      <Modal style={styles.modal} visible={!!mode} onRequestClose={hideModal}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[layouts.fill, styles.txtTitle]}>{t('Export')}</Text>
            <TouchableOpacity style={styles.buttonClose} onPress={hideModal}>
              <Image source={IMAGE.closePopup} style={styles.iconButtonClose} />
            </TouchableOpacity>
          </View>
          {renderContent()}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: 0,
  },

  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: scaleWidth(400),
    borderRadius: scaleHeight(20),
    overflow: 'hidden',
  },

  dropdown: {
    width: 0,
    height: 0,
    borderWidth: 0,
  },

  dropDownContainerStyle: {
    borderWidth: 0,
    borderColor: '#fff',
    borderRadius: scaleHeight(3),
    marginTop: scaleHeight(35),
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    color: colors.BROWNISH_GREY,
  },

  containerStyle: {
    shadowColor: '#0006',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,

    elevation: 3,
  },

  header: {
    height: scaleWidth(48),
    width: '100%',
    backgroundColor: colors.OCEAN_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  txtTitle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(23),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.WHITE,
  },

  buttonClose: {
    width: scaleWidth(28),
    height: scaleHeight(28),
    borderRadius: scaleWidth(14),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: scaleWidth(10),
  },

  iconButtonClose: {
    width: scaleWidth(14),
    height: scaleHeight(14),
  },

  exportTextStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },

  bottomStyle: {
    width: '100%',
    height: scaleHeight(80),
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: { flex: 0, width: '100%', paddingHorizontal: scaleWidth(20) },

  customInput: {
    height: scaleHeight(40),
    width: '100%',
  },

  titleContent: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.GREYISH_BROWN,
  },

  fileInfo: {
    width: '100%',
    height: scaleHeight(60),
    backgroundColor: colors.WHITE,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dddddd',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(8),
  },

  pdfFileContent: {
    flex: 1,
    padding: scaleWidth(8),
  },

  pdfBottom: {
    height: scaleHeight(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  pdfFileTitle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(15),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.OCEAN_BLUE,
  },

  pdfFileText: {
    fontFamily: fonts.LIGHT,
    fontSize: scaleFont(15),
    fontWeight: '300',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },
});
