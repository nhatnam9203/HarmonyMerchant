import NavigationServices from '@navigators/NavigatorServices';
import {
  INPUT_TYPE,
  dateToString,
  BIRTH_DAY_DATE_FORMAT_STRING,
} from '@shared/utils';
import { useFormik } from 'formik';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { addStaffByMerchant, editStaff } from '@redux/actions/staff';
import { useDispatch, useSelector } from 'react-redux';
import { BusinessWorkingTime } from '@utils';
let counter = -1000000;

const INITIAL_VALUE_STAFF = {
  firstName: '',
  lastName: '',
  displayName: '',
  address: {
    street: '',
    city: '',
    state: 0,
    zip: '',
  },
  cellphone: '',
  email: '',
  pin: '',
  confirmPin: '',
  isActive: true,
  isDisabled: 0,
  workingTime: BusinessWorkingTime,
  birthdate: '',
  gender: '',
  roles: {
    nameRole: 'Admin',
  },
  driverlicense: null,
  socialSecurityNumber: null,
  professionalLicense: null,
  tipFee: {
    percent: {
      value: '0.0',
      isCheck: false,
    },
    fixedAmount: {
      value: '0.0',
      isCheck: false,
    },
  },
  salary: {
    perHour: {
      value: '0.00',
      isCheck: false,
    },
    commission: {
      value: [],
      isCheck: false,
    },
  },
  productSalary: {
    commission: {
      value: '0.00',
      isCheck: false,
    },
  },
  cashPercent: 0,
  fileId: 0,
  imageUrl: '',
  categories: [],
};

export const useProps = ({ params: { isNew, isEdit, item } }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [current_staff, setCurrentStaff] = React.useState(item);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  // new
  const createStaff = (staff) => {
    dispatch(addStaffByMerchant(staff, false, buttonCancelPress));
  };
  // edit
  const editStaffs = (staff, id) => {
    dispatch(editStaff(staff, id, false, buttonCancelPress));
  };

  const updateObject = (values) => {
    const keys = Object.keys(values);
    const newValues = { ...INITIAL_VALUE_STAFF };
    for (let index = 0; index < keys.length; index++) {
      const element = keys[index];
      newValues[element] = values[element];
    }
    return newValues;
  };
  /**
  |--------------------------------------------------
  | VALIDATE
  |--------------------------------------------------
  */
  const form = useFormik({
    initialValues: item ?? INITIAL_VALUE_STAFF,
    validationSchema: Yup.object().shape({
      lastName: Yup.string().required(t('LastName is required!')),
      firstName: Yup.string().required(t('FirstName is required!')),
      cellphone: Yup.string().required(t('Phone is required')),
      email: Yup.string().email(t('Email not valid!')),
      birthdate: Yup.string(),
      gender: Yup.string(),
      pin: Yup.string().length(4, 'Pin code must have 4 digits'),
    }),
    onSubmit: (values) => {
      const displayName = values.firstName + ' ' + values.lastName;
      values.displayName = displayName;
      values.confirmPin = values.pin;
      if (isNew) {
        createStaff(values);
      } else if (isEdit) {
        const newValues = updateObject(values);
        editStaffs(newValues, current_staff.staffId);
      }
    },
  });

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */

  React.useEffect(() => {
    if (item) {
      setCurrentStaff(item);
    }
  }, [item]);
  const buttonCancelPress = () => {
    NavigationServices.goBack();
  };

  return {
    isNew,
    isEdit,
    current_staff,
    buttonCancelPress,
    form,
  };
};
