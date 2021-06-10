import { basketRetailer } from '@redux/slices';
import {
  ButtonGradient,
  FormAddress,
  FormContactEmail,
  FormFullName,
  FormPhoneNumber,
  FormTitle,
} from '@shared/components';
import { DialogLayout } from '@shared/layouts';
import {
  useCreateCustomer,
  useEditCustomer,
} from '@shared/services/api/retailer';
import { colors, fonts, layouts } from '@shared/themes';
import { statusSuccess } from '@shared/utils';
import { useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

const log = (obj, message = '') => {
  Logger.log(`[DialogNewCustomer] ${message}`, obj);
};

export const DialogNewCustomer = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);
  const [isEdit, setEdit] = React.useState(false);

  /**
  |--------------------------------------------------
  | CALL API

  |--------------------------------------------------
  */
  const [customerData, createCustomer] = useCreateCustomer();
  const [customerEdit, editCustomer] = useEditCustomer();

  React.useImperativeHandle(ref, () => ({
    show: ({ phone, customer }) => {
      if (phone) {
        setEdit(false);
        form.setFieldValue('phone', phone);
      } else if (customer) {
        setEdit(true);
        form.setValues(customer);
      }
      dialogRef.current?.show();
    },
    hide: () => {
      dialogRef.current?.hide();
    },
  }));

  /**
  |--------------------------------------------------
  | VALIDATE
  |--------------------------------------------------
  */
  const form = useFormik({
    initialValues: {},
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required(t('FirstName is required!')),
      lastName: Yup.string().required(t('LastName is required!')),
      phone: Yup.string().required(t('Phone Number is required')),
      email: Yup.string(),
      addressPost: Yup.object().shape({
        firstName: Yup.string().required(t('FirstName is required!')),
        lastName: Yup.string().required(t('LastName is required!')),
        phone: Yup.string().required(t('Phone Number is required')),
        street: Yup.string(),
        state: Yup.number(),
        city: Yup.string(),
        zip: Yup.string(),
        defaultBillingAddress: Yup.boolean(),
        defaultShippingAddress: Yup.boolean(),
      }),
    }),
    onSubmit: (values) => {
      // alert(JSON.stringify(values));
      if (!isEdit) {
        createCustomer(values);
      } else {
        editCustomer(values, values.customerId);
      }
      dialogRef.current?.hide();
    },
  });

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */
  React.useEffect(() => {
    if (!customerData && !customerEdit) {
      return;
    }

    const { codeStatus, message, data } = customerData || customerEdit;
    if (statusSuccess(codeStatus)) {
      if (!isEdit) {
        dispatch(basketRetailer.setCustomer(data));
      } else {
        dispatch(basketRetailer.setCustomer(form.values));
      }
    }
  }, [customerData, customerEdit]);

  return (
    <View>
      <DialogLayout
        title={t('New customer')}
        ref={dialogRef}
        bottomChildren={() => (
          <View style={styles.bottomStyle}>
            <ButtonGradient
              label={t('Next')}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              disable={!form.isValid || !form.dirty}
              onPress={form.handleSubmit}
            />
          </View>
        )}
        style={styles.dialog}
      >
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <View style={layouts.marginHorizontal} />
            {/* <View>
              <FormTitle label={t('Shipping address')} />
              <View style={layouts.marginHorizontal} />
              <View style={styles.row}>
                <CustomCheckBox
                  label={t('Same as billing address')}
                  value={true}
                  textStyle={styles.textStyle}
                  // onValueChange={setToggleCheckBox}
                />
              </View>
              <View style={layouts.marginHorizontal} />
              <FormFullName
                title={t('Name')}
                firstName={form.values?.addressPost?.firstName}
                lastName={form.values?.addressPost?.lastName}
                onChangeFirstName={form.handleChange('addressPost.firstName')}
                onChangeLastName={form.handleChange('addressPost.lastName')}
              />

              <FormAddress
                reverse={true}
                onChangeCityValue={form.handleChange('addressPost.city')}
                onChangeStateValue={(value) =>
                  form.setFieldValue('addressPost.state', value)
                }
                onChangeZipCodeValue={form.handleChange('addressPost.zip')}
                onChangeStreetValue={form.handleChange('addressPost.street')}
                defaultStateValue={form?.values?.addressPost?.state}
                defaultStreetValue={form?.values?.addressPost?.street}
                defaultCityValue={form?.values?.addressPost?.city}
                defaultZipCodeValue={form?.values?.addressPost?.zip}
              />
            </View> */}

            <FormFullName
              title={t('Name')}
              firstName={form.values?.addressPost?.firstName}
              lastName={form.values?.addressPost?.lastName}
              onChangeFirstName={form.handleChange('addressPost.firstName')}
              onChangeLastName={form.handleChange('addressPost.lastName')}
            />

            <FormPhoneNumber
              phoneNumber={form.values?.addressPost?.phone}
              onChangePhoneNumber={form.handleChange('addressPost.phone')}
              dropDownDirection="BOTTOM"
            />

            <FormAddress
              reverse={true}
              onChangeCityValue={form.handleChange('addressPost.city')}
              onChangeStateValue={(value) =>
                form.setFieldValue('addressPost.state', value)
              }
              onChangeZipCodeValue={form.handleChange('addressPost.zip')}
              onChangeStreetValue={form.handleChange('addressPost.street')}
              defaultStateValue={form?.values?.addressPost?.state}
              defaultStreetValue={form?.values?.addressPost?.street}
              defaultCityValue={form?.values?.addressPost?.city}
              defaultZipCodeValue={form?.values?.addressPost?.zip}
            />

            <FormTitle label={t('Address')} />

            <View style={styles.row}>
              <View style={layouts.fill}>
                <FormPhoneNumber
                  phoneNumber={form.values?.phone}
                  onChangePhoneNumber={form.handleChange('phone')}
                />
              </View>
              <View style={layouts.marginHorizontal} />
              <View style={layouts.fill}>
                <FormContactEmail
                  onChangeEmail={form.handleChange('email')}
                  defaultValue={form.values?.email}
                />
              </View>
            </View>

            <FormFullName
              title={t('Customer Name')}
              firstName={form?.values?.firstName}
              lastName={form?.values?.lastName}
              onChangeFirstName={form?.handleChange('firstName')}
              onChangeLastName={form?.handleChange('lastName')}
            />
          </View>
        </KeyboardAwareScrollView>
      </DialogLayout>
    </View>
  );
});

const styles = StyleSheet.create({
  dialog: {
    flex: 0,
    width: scaleWidth(600),
  },

  container: {
    flex: 0,
    flexDirection: 'column-reverse',
  },

  row: { flexDirection: 'row', alignItems: 'center' },

  bottomStyle: {
    width: '100%',
    height: scaleHeight(80),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },

  title: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(23),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.OCEAN_BLUE,
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.VERY_LIGHT_PINK_C_5,
  },
});
