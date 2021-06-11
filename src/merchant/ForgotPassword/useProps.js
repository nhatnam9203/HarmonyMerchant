import NavigationServices from '@navigators/NavigatorServices';
import { appMerchant, authMerchant } from '@redux/slices';
import { useForgotPassword } from '@shared/services/api/merchant';
import { getTerminalIds, statusSuccess } from '@shared/utils/app';
import { useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

export const useProps = (_params) => {
  /**
  |--------------------------------------------------
  | VARIABLES
  |--------------------------------------------------
  */
  const inputEmailRef = React.useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = React.useState(null);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [forgotData, merchantForgotPassWord] = useForgotPassword();

  /**
  |--------------------------------------------------
  | VALIDATE
  |--------------------------------------------------
  */

  const ForgotPasSchema = Yup.object().shape({
    email: Yup.string().required(t('Email is required!')),
  });

  const forgotPassFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: ForgotPasSchema,
    onSubmit: (values) => {
      merchantForgotPassWord(values);
    },
  });

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */
  React.useEffect(() => {
    if (!forgotData) {
      return;
    }

    const { codeStatus, message } = forgotData;
    if (statusSuccess(codeStatus)) {
      setErrorMsg(null);
      NavigationServices.goBack();
      setTimeout(() => {
        alert(`Please check your email`);
      }, 300);

      return;
    }

    if (message) {
      setErrorMsg(message);
    }
  }, [forgotData]);

  React.useEffect(() => {
    const { email } = forgotPassFormik.errors;
    if (email) {
      setErrorMsg(email);
    } else {
      setErrorMsg(null);
    }
  }, [forgotPassFormik.errors]);

  return {
    inputEmailRef,
    errorMsg,
    inputIdSubmit: () => {
      setErrorMsg(null);
      inputEmailRef?.current?.focus();
    },
    forgotPassFormik,
  };
};
