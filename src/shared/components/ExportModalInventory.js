import IMAGE from '@resources';
import { colors, fonts, layouts } from '@shared/themes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { appMerchant } from '@redux/slices';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import { ButtonGradient, ButtonGradientWhite } from './Button';
import { CustomInput } from './CustomInput';
import { CustomRadioSelect } from './CustomRadioSelect';
import {
  createFilePath,
  getInfoPathFile,
  handleTheDownloadedFile,
  handleShareFile,
} from '@shared/utils/files';
const EXPORT_FUNCTION = [
  // { value: 'pdf', label: 'PDF' },
  { value: 'excel', label: 'EXCEL' },
  { value: 'csv', label: 'CSV' },
];

const EXPORT_PAGE = ['preview', 'export'];

export const ExportModalInventory = React.forwardRef(
  ({ onExportFile, title }, ref) => {
    const [t] = useTranslation();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState(EXPORT_FUNCTION);
    const [value, setValue] = React.useState(null);
    const [mode, setMode] = React.useState(null);
    const [show_modal, setShowModal] = React.useState(false);
    const [files, setFiles] = React.useState({});
    const [fileName, setFileName] = React.useState(title);
    const [isNeedToOrder, setNeedToOrder] = React.useState(0);
    const [page, setPage] = React.useState(EXPORT_PAGE[1]);
    React.useImperativeHandle(ref, () => ({
      show: () => {
        setShowModal(true);
      },
      hide: () => {
        setShowModal(false);
      },

      onCreateFile: (url) => onHandleCreateFile(url),
    }));

    const resetState = () => {
      setMode(null);
      setValue(null);
      setPage(EXPORT_PAGE[1]);
      setFileName(title);
      setNeedToOrder(0);
    };

    const onHandleChange = (val) => {
      setMode(val); // !! select type export => call server get file here follow type select, set callback
      val && setShowModal(true);
    };

    const onRequestFileFromServer = () => {
      if (typeof onExportFile === 'function') {
        onExportFile({
          type: mode,
          isNeedToOrder: isNeedToOrder === 0 ? true : false,
        });
      }
      setShowModal(false);
    };

    const onHandleCreateFile = async (url) => {
      let filePath = await createFilePath({
        fileName: fileName,
        extention: mode,
        url,
      });
      let files = await getInfoPathFile(filePath);
      setFiles(files);
      setShowModal(true);
      setPage(EXPORT_PAGE[0]);
    };

    const onExportButtonPress = () => {
      setOpen((x) => !x); // show dropdown here
    };

    const hideModal = () => {
      resetState();
      setShowModal(false);
    };

    const onDownloadFile = () => {
      hideModal();
      setTimeout(() => {
        handleTheDownloadedFile(files?.path);
      }, 250);
    };

    const onShareFile = () => {
      hideModal();
      setTimeout(() => {
        handleShareFile(fileName, files?.path);
      }, 250);
    };

    const onHandleChangeFileName = (value) => {
      setFileName(value);
    };
    const onHandleChangeSelect = (item) => {
      setNeedToOrder(item.value);
    };

    /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */
    React.useEffect(() => {
      mode && dispatch(appMerchant.saveExportType(mode));
    }, [mode]);

    /**
  |--------------------------------------------------
  | LAYOUT
  |--------------------------------------------------
  */

    const renderImageFile = () => {
      switch (mode) {
        case 'excel':
        case 'csv':
          return IMAGE.ExportCsvFileImage;
        case 'pdf':
          return IMAGE.ExportPdfFileImage;
        default:
          return '';
      }
    };

    const renderLayoutPreview = () => {
      return (
        <View style={styles.content}>
          <Text style={styles.titleContent}>
            {t('File created successfully')}
          </Text>
          <View style={layouts.marginVertical} />
          <TouchableOpacity style={styles.fileInfo}>
            <Image
              source={renderImageFile()}
              style={{ width: scaleWidth(39), height: scaleHeight(44) }}
            />
            <View style={styles.pdfFileContent}>
              <Text style={styles.pdfFileTitle}>{files?.filename}</Text>
              <Text style={styles.pdfFileText}>{files?.size}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.pdfBottom}>
            <TouchableOpacity onPress={onDownloadFile}>
              <Image source={IMAGE.ExportShareIcon} />
            </TouchableOpacity>
            <View style={layouts.marginHorizontal} />
            <TouchableOpacity onPress={onShareFile}>
              <Image source={IMAGE.ExportDownloadIcon} />
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    const renderContent = () => {
      switch (page) {
        case EXPORT_PAGE[1]:
          return (
            <View style={styles.content}>
              <Text style={styles.exportTextStyle}>{t('Save as')}</Text>
              <CustomInput
                style={styles.customInput}
                textInputProps={{
                  placeholder: t('Untittle.csv'),
                  fontSize: scaleFont(17),
                  textAlign: 'left',
                  defaultValue: fileName,
                  onChangeText: onHandleChangeFileName,
                }}
              />
              <View style={layouts.marginVertical} />
              <CustomRadioSelect
                data={[
                  { label: t('The products need to order more'), value: 0 },
                  { label: t('All product'), value: 1 },
                ]}
                onSelect={onHandleChangeSelect}
                required={true}
              />

              <View style={styles.bottomStyle}>
                <ButtonGradient
                  onPress={onRequestFileFromServer}
                  label={t('Next')}
                  width={scaleWidth(140)}
                  height={scaleHeight(40)}
                />
              </View>
            </View>
          );
        case EXPORT_PAGE[0]:
          return renderLayoutPreview();
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

        <Modal
          style={styles.modal}
          visible={show_modal}
          onRequestClose={hideModal}
        >
          <KeyboardAvoidingView behavior="position">
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={[layouts.fill, styles.txtTitle]}>
                  {t('Export')}
                </Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={hideModal}
                >
                  <Image
                    source={IMAGE.closePopup}
                    style={styles.iconButtonClose}
                  />
                </TouchableOpacity>
              </View>
              {renderContent()}
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  }
);

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
